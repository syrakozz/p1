/* eslint-disable no-bitwise */
import { crc8 } from 'crc';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform } from 'react-native';
import BleManager, {
  BleEventType,
  BleManagerDidUpdateStateEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  BleState,
  Peripheral,
} from 'react-native-ble-manager';
import { useChatStore } from '../chat';
import { getInsightFillerAudio, getThinkFillerAudio } from '../../../assets/sounds/fillers';
import { sleep } from '../../utils/audio.utils';
import { pickRandom } from '../../utils/various.utils';
import { useConnectionStore } from '../connection.store';
import { buttonHandlers } from './buttons.util';
import defaultFrameProcessorOptions from '../../vad/defaultFrameProcessorOptions';
import Message from '../../vad/Message';
import { initializeVadProcessor, vadFrameProcessor, vadProcessPcmBytes } from '../../vad/vad';
import { CharacterLanguage } from '../../../api/vox.types';

export type BleStoreState = {
  bleState: BleState;
  isScanning: boolean;
  isConnecting: boolean;
  isInitialized: boolean;
  isVadEnabled: boolean;
  peripheral: Peripheral | undefined;
  error:
    | 'CONNECTING_ERROR'
    | 'BLUETOOTH_OFF_ERROR'
    | 'DEVICE_NOT_FOUND_ERROR'
    | 'PERMISSIONS_ERROR'
    | 'DEVICE_DISCONNECTED_ERROR'
    | undefined;
  pcmPackets: number[];
  silenceStatus: SilenceStatus;
  batteryLevel: number | undefined;
  firmwareVersion: string;
  macAddress: string;
  voiceBufferStatus: { busy: boolean; timestamp: number };
  startScan: () => Promise<void>;
  stopScan: () => Promise<void>;
  toggleRecording: (enabled: boolean) => Promise<{ pcmPackets: number[] }>;
  displayEmotionId: (experienceId: number, silent?: boolean) => Promise<void>;
  displayEmotion: (emotion: EmotionType) => Promise<void>;
  playAudio: (
    audio: number[],
    options?: { streaming?: boolean; emotion?: EmotionType }
  ) => { addAudio: (data: number[]) => void; stop: (hard?: boolean) => void; run: () => Promise<void> };
  startFiller: (hasInsightFiller: boolean, hasThinkingFiller: boolean, language: CharacterLanguage) => void;
  clearVoiceBuffer: () => Promise<void>;
  stopAudio: () => void;
  startVad: () => void;
  stopVad: () => void;
  disconnect: () => Promise<void>;
  setIsVadEnabled: (enabled: boolean) => void;
  init: () => Promise<void>;
  reset: () => void;
};

enum FunctionCode {
  ReceiveRecording = 0x01,
  ToggleRecording = 0x02,
  PlayAudio = 0x03,
  SyncTime = 0x04,
  SetAlarm = 0x05,
  DisplayEmotion = 0x06,
  KeyStatus = 0x07,
  BatteryStatus = 0x0a,
  SetGain = 0x09,
  VoiceBufferStatus = 0x0b,
  VoiceBufferClear = 0x0c,
  VersionInfo = 0x0d,
  GetVersion = 0x0e,
  MacAddressInfo = 0x0f,
  GetMacAddress = 0x10,
}

export type EmotionType = 'TALK' | 'LISTEN' | 'THINK' | 'IDLE';
export type SilenceStatus = 'SILENCE' | 'VOICE' | 'UNKNOWN';

const BLE_SCAN_DURATION = 10;
const RECEIVE_SERVICE_UUID = 'ae30';
const SEND_SERVICE_UUID = 'ae30';
const RECEIVE_CHARACTERISTIC_UUID = 'ae03';
const SEND_CHARACTERISTIC_UUID = 'ae02';

export const AUDIO_CHARACTERISTICS = {
  SERVER_FORMAT: 'mp3_22050_32',
  BITRATE_KBPS: 32,
  AUDIO_SLICE_SIZE: 175,
  AUDIO_SLICE_INTERVAL: 10,
  PACKET_MAX_BYTE_SIZE: 185,
  PACKET_QUEUE_SLEEP_TIME: 10,
  BUFFER_START: 6_000,
} as const;
const VOICE_BUFFER_READY_TO_PLAY_DELAY = 800;

const BleManagerModule = NativeModules.BleManager;
const { OpusCodec } = NativeModules;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

OpusCodec.initializeDecoder();

const initialState = {
  bleState: BleState.Unknown,
  isScanning: false,
  isInitialized: false,
  isVadEnabled: false,
  silenceStatus: 'UNKNOWN' as const,
  isConnecting: false,
  peripheral: undefined,
  error: undefined,
  pcmPackets: [],
  batteryLevel: undefined,
  firmwareVersion: '',
  macAddress: '',
  voiceBufferStatus: { busy: false, timestamp: new Date().getTime() },
};

function isMegoPeripheral(peripheral: Peripheral) {
  return peripheral.name && (peripheral.name === 'My 2XL' || peripheral.name.toLowerCase().startsWith('mego'));
}

async function getConnectedMegoPeripheral() {
  const peripherals = await BleManager.getConnectedPeripherals();
  return peripherals.find(p => isMegoPeripheral(p));
}

async function getDiscoveredMegoPeripheral() {
  const peripherals = await BleManager.getDiscoveredPeripherals();
  return peripherals.find(p => isMegoPeripheral(p));
}

function createPacketWithPayload(functionCode: FunctionCode, payload: number[]): number[] {
  const sendBuffer = new Uint8Array(payload.length + 5);
  let sendBufferIndex = 0;

  sendBuffer[sendBufferIndex++] = 0x4f;
  sendBuffer[sendBufferIndex++] = 0x42;
  sendBuffer[sendBufferIndex++] = functionCode;
  sendBuffer[sendBufferIndex++] = 0x00;
  sendBuffer[sendBufferIndex++] = 0x00;
  for (let i = 0; i < payload.length; i++) {
    sendBuffer[sendBufferIndex++] = payload[i];
  }
  sendBuffer[3] = (sendBufferIndex + 1) & 0xff;
  sendBuffer[4] = ((sendBufferIndex + 1) >> 8) & 0xff;
  const crcSum = crc8(sendBuffer);
  const packet = [...Array.from(sendBuffer), crcSum];
  return packet;
}

export const useBleStore = createWithEqualityFn<BleStoreState>((set, get) => {
  let idleTimer1: ReturnType<typeof setTimeout>;
  let idleTimer2: ReturnType<typeof setTimeout>;
  let listenTimer1: ReturnType<typeof setTimeout>;
  let listenTimer2: ReturnType<typeof setTimeout>;

  async function init() {
    const { isInitialized } = get();

    if (isInitialized) {
      return;
    }

    console.log('Requesting permissions..');
    const isGranted = await askForPermissions();

    if (!isGranted) {
      return;
    }

    console.log('permissions granted');

    // TODO: handle permission changes that happen through app settings

    console.log('Starting BLE..');
    await BleManager.start({ showAlert: false });

    bleManagerEmitter.addListener(BleEventType.BleManagerDidUpdateValueForCharacteristic, onValueUpdate);
    bleManagerEmitter.addListener(BleEventType.BleManagerDidUpdateState, onStateUpdate);
    bleManagerEmitter.addListener(BleEventType.BleManagerStopScan, onStopScan);
    bleManagerEmitter.addListener(BleEventType.BleManagerDiscoverPeripheral, onDiscoverPeripheral);
    bleManagerEmitter.addListener(BleEventType.BleManagerConnectPeripheral, onConnectPeripheral);
    bleManagerEmitter.addListener(BleEventType.BleManagerDisconnectPeripheral, onDisconnectPeripheral);

    // triggers BleEventType.BleManagerDidUpdateState event
    await BleManager.checkState();

    // Initialize VAD
    await initializeVadProcessor();

    set({ isInitialized: true });
  }

  async function askForPermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        'android.permission.BLUETOOTH_SCAN',
        'android.permission.BLUETOOTH_CONNECT',
      ]);

      const isGranted = Object.values(result).every(value => value === 'granted');
      if (!isGranted) {
        set({ error: 'PERMISSIONS_ERROR' });
      }

      return isGranted;
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      const checkResult = await PermissionsAndroid.check('android.permission.ACCESS_FINE_LOCATION');
      if (!checkResult) {
        const isGranted = (await PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION')) === 'granted';
        if (!isGranted) {
          set({ error: 'PERMISSIONS_ERROR' });
        }

        return isGranted;
      }
    }

    return true;
  }

  function removeAllListeners() {
    [
      BleEventType.BleManagerDidUpdateValueForCharacteristic,
      BleEventType.BleManagerConnectPeripheral,
      BleEventType.BleManagerDisconnectPeripheral,
      BleEventType.BleManagerDiscoverPeripheral,
      BleEventType.BleManagerDidUpdateState,
      BleEventType.BleManagerStopScan,
    ].forEach(value => bleManagerEmitter.removeAllListeners(value));
  }

  async function toggleRecording(enabled: boolean): Promise<{ pcmPackets: number[] }> {
    let pcmPackets: number[] = [];
    const { peripheral, isVadEnabled } = get();

    // Reset if start recording
    if (enabled) {
      set({ pcmPackets: [] });
    }

    if (isVadEnabled) {
      if (enabled) {
        vadFrameProcessor.resume();
      } else {
        vadFrameProcessor.pause();
      }
    }

    if (peripheral) {
      const packet = createPacketWithPayload(FunctionCode.ToggleRecording, [+enabled]);
      await BleManager.writeWithoutResponse(peripheral.id, RECEIVE_SERVICE_UUID, RECEIVE_CHARACTERISTIC_UUID, packet);

      // On stop, pick all the data
      if (!enabled) {
        await sleep(100);
        ({ pcmPackets } = get());
      }
    }

    return { pcmPackets };
  }

  let lastPacketSent = 0;
  async function sendAudioPacket(audio: number[]): Promise<void> {
    const packet = createPacketWithPayload(FunctionCode.PlayAudio, audio);
    const { peripheral } = get();
    if (!peripheral) {
      return;
    }

    const now = performance.now();
    const diff = now - lastPacketSent;
    if (diff < AUDIO_CHARACTERISTICS.AUDIO_SLICE_INTERVAL) {
      await sleep(AUDIO_CHARACTERISTICS.AUDIO_SLICE_INTERVAL - diff);
    }

    await BleManager.writeWithoutResponse(
      peripheral.id,
      RECEIVE_SERVICE_UUID,
      RECEIVE_CHARACTERISTIC_UUID,
      packet,
      AUDIO_CHARACTERISTICS.PACKET_MAX_BYTE_SIZE,
      AUDIO_CHARACTERISTICS.PACKET_QUEUE_SLEEP_TIME
    );

    lastPacketSent = performance.now();
    return;
  }

  let currentFiller: ReturnType<typeof playAudio> | undefined;

  async function stopAudio() {
    if (currentFiller) {
      currentFiller.stop(true);
      currentFiller = undefined;
    }
  }

  async function startFiller(hasInsightFiller: boolean, hasThinkingFiller: boolean, language: CharacterLanguage) {
    if (hasInsightFiller) {
      currentFiller = playAudio(getInsightFillerAudio(language), { emotion: 'TALK' });
      currentFiller.run().then(async () => {
        if (currentFiller) {
          displayEmotion('THINK');
          if (hasThinkingFiller) {
            loopThinkingFiller();
          }
        }
      });
    } else {
      displayEmotion('THINK');
      if (hasThinkingFiller) {
        loopThinkingFiller();
      }
    }
  }

  async function loopThinkingFiller() {
    const thinkingFiller = getThinkFillerAudio();
    currentFiller = playAudio(thinkingFiller);
    while (true) {
      if (!currentFiller || currentFiller.isStopped()) {
        break;
      }
      currentFiller.addAudio(thinkingFiller);
      await currentFiller.run();
      await sleep(400);
      if (!currentFiller || currentFiller.isStopped()) {
        break;
      }
    }
  }

  function startVad() {
    const { startRecording } = useChatStore.getState();
    set({ isVadEnabled: true });
    startRecording(false);
  }

  function stopVad() {
    const { stopRecording } = useChatStore.getState();
    set({ isVadEnabled: false });
    stopRecording(false);
  }

  async function waitUntilVoiceBufferReadyToPlay() {
    while (true) {
      const { voiceBufferStatus } = get();
      const now = new Date().getTime();
      const diff = now - voiceBufferStatus.timestamp;
      if (!voiceBufferStatus.busy && diff > VOICE_BUFFER_READY_TO_PLAY_DELAY) {
        break;
      }
      const sleepTime = voiceBufferStatus.busy ? VOICE_BUFFER_READY_TO_PLAY_DELAY : Math.max(VOICE_BUFFER_READY_TO_PLAY_DELAY - diff, 50);
      // console.log('busy', VOICE_BUFFER_READY_TO_PLAY_DELAY - diff, sleepTime);
      await sleep(sleepTime);
    }
  }

  function getExpectedTimeViaBytes(numBytes: number) {
    const bits = numBytes * 8;
    const bitsRate = AUDIO_CHARACTERISTICS.BITRATE_KBPS * 1000;
    return (bits / bitsRate) * 1000;
  }

  let currentAudioId = 0;
  let currentRunningAudioId: number | undefined;
  function playAudio(
    audioData: number[],
    { streaming = false, emotion = undefined }: { streaming?: boolean; emotion?: EmotionType } = {}
  ): {
    addAudio: (data: number[]) => void;
    isStopped: () => boolean;
    stop: (hard?: boolean) => void;
    run: () => Promise<void>;
  } {
    const localAudioId = currentAudioId++;
    const localAudioD: number[] = [];

    const addAudio = (() => {
      return (_data: number[]) => {
        const numBytes = _data.length;
        for (let i = 0; i < numBytes; i++) {
          localAudioD.push(_data[i]);
        }
      };
    })();
    addAudio(audioData);

    let stopped = false;
    const stop = async (hard = false) => {
      stopped = true;
      streaming = false;

      if (hard) {
        localAudioD.length = 0;
        // console.log(' ==================   clear:', localAudioId, new Date());
        await clearVoiceBuffer();
      }
    };

    const run = async () => {
      currentRunningAudioId = localAudioId;
      await waitUntilVoiceBufferReadyToPlay();
      // await sleep();
      const startTimeMillis = performance.now();

      let emptyStartTime = 0;
      let totalBytesSent = 0;

      if (emotion) {
        displayEmotion(emotion);
      }

      while (streaming || localAudioD.length > 0) {
        //Create bluetooth packet
        const btPacketPayload = localAudioD.splice(0, AUDIO_CHARACTERISTICS.AUDIO_SLICE_SIZE);

        if (btPacketPayload.length > 0) {
          totalBytesSent += btPacketPayload.length;
          if (emptyStartTime) {
            console.log('Start aduio!', new Date());
            emptyStartTime = 0;
          }
          if (currentRunningAudioId !== localAudioId) {
            break;
          }
          // console.log('send packet:', localAudioId, new Date());
          await sendAudioPacket(btPacketPayload);
        } else {
          if (!emptyStartTime) {
            emptyStartTime = performance.now();
            console.error('Empty aduio!', new Date());
          }
          await sleep(10);
        }
      }

      const expectedTime = getExpectedTimeViaBytes(totalBytesSent);
      const elapsedTime = performance.now() - startTimeMillis;
      const remainingTIme = expectedTime - elapsedTime + 100;
      if (remainingTIme > 0) {
        await sleep(remainingTIme);
      }
    };

    return {
      addAudio,
      isStopped() {
        return stopped;
      },
      stop,
      run,
    };
  }

  async function startNotification() {
    const { peripheral } = get();
    if (!peripheral) {
      return;
    }

    return await BleManager.startNotification(peripheral.id, SEND_SERVICE_UUID, SEND_CHARACTERISTIC_UUID);
  }

  async function stopNotification() {
    const { peripheral } = get();
    if (!peripheral) {
      return;
    }

    return await BleManager.stopNotification(peripheral.id, SEND_SERVICE_UUID, SEND_CHARACTERISTIC_UUID);
  }

  async function onStopScan() {
    set({ isScanning: false, isConnecting: true });
    const peripheral = await getDiscoveredMegoPeripheral();

    if (peripheral) {
      console.log('Connecting..');
      try {
        // In iOS, attempts to connect to a peripheral do not time out
        // await Promise.race([new Promise((_, reject) => setTimeout(reject, BLE_SCAN_DURATION)), BleManager.connect(peripheral.id)]);
        await BleManager.connect(peripheral.id);
      } catch {
        set({ error: 'CONNECTING_ERROR' });
      }
    } else {
      set({ isConnecting: false, error: 'DEVICE_NOT_FOUND_ERROR' });
    }
  }

  async function onStateUpdate({ state }: BleManagerDidUpdateStateEvent) {
    console.log('BleStateChange', state);

    set({ bleState: state });

    if (state === 'on') {
      await startScan();
    } else {
      set({ error: 'BLUETOOTH_OFF_ERROR' });
    }
  }

  async function onConnectPeripheral() {
    await stopNotification();
    const peripheral = await getConnectedMegoPeripheral();

    console.log('Connected peripheral:', peripheral?.name);

    set({ peripheral });

    if (peripheral) {
      const peripheralInfo = await BleManager.retrieveServices(peripheral.id);
      await startNotification();

      console.log('Peripheral info:', peripheralInfo);

      if (Platform.OS === 'android') {
        // why do we need this?
        const mtu = await BleManager.requestMTU(peripheral.id, 512);
        console.log('MTU:', mtu);
      }

      set({ isConnecting: false });

      // Update emotion
      displayEmotion('IDLE');

      // Keep device awake while connected to toy
      activateKeepAwakeAsync();

      // Get version & MAC address
      requestVersion();
      requestMacAddress();
    }
  }

  async function onDiscoverPeripheral(peripheral: Peripheral) {
    if (isMegoPeripheral(peripheral)) {
      console.log('Discovered mego peripheral:', peripheral.name);
      await BleManager.stopScan();
    }
  }

  async function onDisconnectPeripheral({ peripheral: peripheralId }: { peripheral: string }) {
    set(({ peripheral, error, isInitialized }) => {
      const isConnected = peripheral && peripheralId !== peripheral.id;
      return {
        ...initialState,
        isInitialized,
        peripheral: isConnected ? peripheral : undefined,
        error: isConnected ? error : 'DEVICE_DISCONNECTED_ERROR',
      };
    });

    // No need to keep it awake any more
    deactivateKeepAwake();
  }

  let last = 0;

  async function onValueUpdate(ev: BleManagerDidUpdateValueForCharacteristicEvent) {
    const { stopRecording } = useChatStore.getState();

    if (
      (ev.characteristic.toLowerCase() === SEND_CHARACTERISTIC_UUID ||
        ev.characteristic.toLowerCase().startsWith('0000' + SEND_CHARACTERISTIC_UUID)) &&
      (ev.service.toLowerCase() === SEND_SERVICE_UUID || ev.service.toLowerCase().startsWith('0000' + SEND_SERVICE_UUID))
    ) {
      let btFramePos = 0;

      do {
        if (ev.value[btFramePos] !== 0x4f || ev.value[btFramePos + 1] !== 0x42) {
          break;
        }
        const packetLength = ((ev.value[btFramePos + 4] << 8) & 0xff00) | (ev.value[btFramePos + 3] & 0x00ff);
        const packetCrc = ev.value[btFramePos + packetLength - 1];
        if (packetCrc === crc8(new Uint8Array(ev.value.slice(btFramePos, btFramePos + packetLength - 1)))) {
          const packetType = ev.value[btFramePos + 2];
          switch (packetType) {
            //Audio packet (OPUS)
            case FunctionCode.ReceiveRecording:
              const btPacket = ev.value.slice(btFramePos + 5, btFramePos + packetLength - 1);

              OpusCodec.decodeMultipleFrames(btPacket).then((currentPcmPackets: number[]) => {
                set(({ pcmPackets }) => ({
                  pcmPackets: pcmPackets.concat(currentPcmPackets),
                }));
              });

              const { pcmPackets, isVadEnabled } = get();

              // allow maximum of roughly 5 mins of recording
              if (pcmPackets.length > 8_000_000) {
                await stopRecording();
                return;
              }

              if (isVadEnabled) {
                const vadPacketSize = defaultFrameProcessorOptions.frameSamples * 2;
                if (pcmPackets.length >= vadPacketSize) {
                  const closest = pcmPackets.length - (pcmPackets.length % vadPacketSize);
                  if (closest === last) {
                    return;
                  }
                  last = closest;
                  // console.log(closest);
                  const _audioFrame = pcmPackets.slice(closest - vadPacketSize, closest);
                  const vad = await vadProcessPcmBytes(_audioFrame);

                  switch (vad?.msg) {
                    case Message.SpeechStart:
                      console.log('onSpeechStart()');
                      displayEmotion('LISTEN');
                      break;

                    case Message.VADMisfire:
                      console.log('onVADMisfire()');
                      displayEmotion('IDLE');
                      break;

                    case Message.SpeechEnd:
                      console.log('onSpeechEnd(audio)', vad.audio?.length);
                      // We could skip it, but this way we save some bytes
                      set({ pcmPackets: vad.audio });
                      stopRecording();
                      break;
                  }
                }
              }

              break;

            // button press
            case FunctionCode.KeyStatus:
              ev.value.slice(btFramePos + 5, btFramePos + 10).forEach((buttonState, idx) => {
                if (!buttonHandlers[idx].pressed && buttonState === 0x01) {
                  buttonHandlers[idx].onPressIn();
                } else if (buttonHandlers[idx].pressed && buttonState === 0x00) {
                  buttonHandlers[idx].onPressOut?.();
                }

                buttonHandlers[idx].pressed = buttonState === 0x01;
              });
              break;

            // battery level
            case FunctionCode.BatteryStatus:
              set({
                batteryLevel: ev.value[btFramePos + 5],
              });
              break;

            case FunctionCode.VoiceBufferStatus:
              set(({ voiceBufferStatus }) => {
                const busy = Boolean(ev.value[btFramePos + 5]);
                return busy === voiceBufferStatus.busy
                  ? { voiceBufferStatus }
                  : { voiceBufferStatus: { busy, timestamp: new Date().getTime() } };
              });
              break;

            case FunctionCode.VersionInfo:
              const firmwareVersion = [ev.value[btFramePos + 5], ev.value[btFramePos + 6]].join('.');
              set({
                firmwareVersion,
              });
              if (!firmwareVersion || firmwareVersion === '2.0') {
                set(({ peripheral }) => {
                  return { macAddress: (peripheral?.id || '').toLowerCase() };
                });
              }
              break;

            case FunctionCode.MacAddressInfo:
              // Format as MAC address
              const macAddress = ev.value
                .slice(btFramePos + 5, btFramePos + 11)
                .reverse()
                .map(n => n.toString(16).toLowerCase())
                .join(':');
              set({
                macAddress,
              });
              break;

            default:
              break;
          }
        }
        btFramePos += packetLength;
      } while (btFramePos < ev.value.length);
    }
  }

  async function displayEmotionId(emotionId: number): Promise<void> {
    const packet = createPacketWithPayload(FunctionCode.DisplayEmotion, [emotionId]);
    const { peripheral } = get();
    if (!peripheral) {
      return;
    }

    return await BleManager.writeWithoutResponse(peripheral.id, RECEIVE_SERVICE_UUID, RECEIVE_CHARACTERISTIC_UUID, packet);
  }

  async function clearVoiceBuffer(): Promise<void> {
    const packet = createPacketWithPayload(FunctionCode.VoiceBufferClear, [1]);
    const { peripheral } = get();
    if (!peripheral) {
      return;
    }

    return await BleManager.writeWithoutResponse(peripheral.id, RECEIVE_SERVICE_UUID, RECEIVE_CHARACTERISTIC_UUID, packet);
  }

  async function requestVersion(): Promise<void> {
    const packet = createPacketWithPayload(FunctionCode.GetVersion, [0]);
    const { peripheral } = get();
    if (!peripheral) {
      return;
    }

    return await BleManager.writeWithoutResponse(peripheral.id, RECEIVE_SERVICE_UUID, RECEIVE_CHARACTERISTIC_UUID, packet);
  }

  async function requestMacAddress(): Promise<void> {
    const packet = createPacketWithPayload(FunctionCode.GetMacAddress, [0]);
    const { peripheral } = get();
    if (!peripheral) {
      return;
    }

    return await BleManager.writeWithoutResponse(peripheral.id, RECEIVE_SERVICE_UUID, RECEIVE_CHARACTERISTIC_UUID, packet);
  }

  async function displayEmotion(emotion: EmotionType): Promise<void> {
    let emotionId: number | undefined;

    clearTimeout(idleTimer1);
    clearTimeout(idleTimer2);
    clearTimeout(listenTimer1);
    clearTimeout(listenTimer2);

    if (emotion === 'IDLE') {
      const { isConnected } = useConnectionStore.getState();
      emotionId = isConnected ? 102 : 12;

      idleTimer1 = setTimeout(() => {
        displayEmotionId(pickRandom([103, 104]));

        idleTimer2 = setTimeout(() => {
          displayEmotion('IDLE');
        }, 3000);
      }, 8000);
    } else if (emotion === 'LISTEN') {
      emotionId = 64;

      listenTimer1 = setTimeout(() => {
        displayEmotionId(68);

        listenTimer2 = setTimeout(() => {
          displayEmotion('LISTEN');
        }, 3000);
      }, 8000);
    } else if (emotion === 'TALK') {
      emotionId = 25;
    } else if (emotion === 'THINK') {
      emotionId = 70;
    }

    // console.log({ emotion, emotionId });

    if (emotionId) {
      return await displayEmotionId(emotionId);
    }
  }

  async function startScan() {
    const { isScanning, peripheral } = get();
    if (isScanning) {
      return;
    }

    set({ error: undefined });

    if (!peripheral) {
      set({ isScanning: true });

      console.log('Scanning..');
      await BleManager.scan([], BLE_SCAN_DURATION, true, {
        matchMode: BleScanMatchMode.Sticky,
        scanMode: BleScanMode.LowLatency,
        callbackType: BleScanCallbackType.AllMatches,
      });
    }
  }

  async function stopScan() {
    BleManager.stopScan();
  }

  function setIsVadEnabled(enabled: boolean) {
    set({ isVadEnabled: enabled });
  }

  async function disconnect() {
    const { peripheral } = get();
    if (peripheral) {
      BleManager.disconnect(peripheral.id);
    }
  }

  function reset() {
    stopScan();
    toggleRecording(false);
    stopNotification();
    removeAllListeners();
    set(initialState);
  }

  return {
    ...initialState,
    init,
    startScan,
    stopScan,
    toggleRecording,
    displayEmotion,
    displayEmotionId,
    playAudio,
    startFiller,
    startVad,
    stopVad,
    stopAudio,
    setIsVadEnabled,
    clearVoiceBuffer,
    disconnect,
    reset,
  };
}, shallow);

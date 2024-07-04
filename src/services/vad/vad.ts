import { convertBytesToShort, convertShortToBytes } from '../utils/audio.utils';
import FrameProcessor from './FrameProcessor';
import Message from './Message';
import { Silero } from './Silero';
import defaultFrameProcessorOptions from './defaultFrameProcessorOptions';

export let vadFrameProcessor: FrameProcessor;

export async function initializeVadProcessor() {
  if (vadFrameProcessor) {
    return;
  }

  const vadModel = await Silero.new();

  vadFrameProcessor = new FrameProcessor(vadModel.process, vadModel.reset_state, defaultFrameProcessorOptions);
  vadFrameProcessor.pause();
}

export async function vadProcessPcmBytes(
  pcmFrame: number[]
): Promise<{ msg: Message.SpeechStart | Message.VADMisfire } | { msg: Message.SpeechEnd; audio: number[] } | undefined> {
  const vadFrame = convertBytesToShort(pcmFrame);
  const vad = await vadFrameProcessor.process(vadFrame);

  if (vad.msg === Message.SpeechEnd && vad.audio) {
    return { msg: Message.SpeechEnd, audio: convertShortToBytes(vad.audio) };
  }

  if (vad.msg === Message.SpeechStart || vad.msg === Message.VADMisfire) {
    return { msg: vad.msg };
  }

  return;
}

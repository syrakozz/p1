import * as ort from 'onnxruntime-react-native';
import { Asset } from 'expo-asset';
import SpeechProbabilities from './SpeechProbabilities';
import { Alert } from 'react-native';

export class Silero {
  _session: any;
  _h: any;
  _c: any;
  _sr: any;

  constructor() {}

  static new = async () => {
    const model = new Silero();
    await model.init();
    return model;
  };

  init = async () => {
    console.debug('initializing vad');
    const assets = await Asset.loadAsync(require('./silero_vad.onnx'));
    const modelUri = assets[0].localUri;
    if (!modelUri) {
      Alert.alert('failed to get VAD model');
      return;
    }
    this._session = await ort.InferenceSession.create(modelUri);
    this._sr = new ort.Tensor('int64', [16000n]);

    this.reset_state();
    console.debug('vad is initialized');
  };

  reset_state = () => {
    const zeroes = Array(2 * 64).fill(0);
    this._h = new ort.Tensor('float32', zeroes, [2, 1, 64]);
    this._c = new ort.Tensor('float32', zeroes, [2, 1, 64]);
  };

  process = async (audioFrame: Float32Array): Promise<SpeechProbabilities> => {
    const t = new ort.Tensor('float32', audioFrame, [1, audioFrame.length]);
    const inputs = {
      input: t,
      h: this._h,
      c: this._c,
      sr: this._sr,
    };
    const out = await this._session.run(inputs);
    this._h = out.hn;
    this._c = out.cn;
    const [isSpeech] = out.output.data;
    const notSpeech = 1 - isSpeech;
    return { notSpeech, isSpeech };
  };
}

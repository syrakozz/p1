import FrameProcessorOptions from './FrameProcessorOptions';

const defaultFrameProcessorOptions: FrameProcessorOptions = {
  positiveSpeechThreshold: 0.8,
  negativeSpeechThreshold: 0.8 - 0.15,
  preSpeechPadFrames: 15,
  redemptionFrames: 10,
  frameSamples: 1536,
  minSpeechFrames: 4,
};

export default defaultFrameProcessorOptions;

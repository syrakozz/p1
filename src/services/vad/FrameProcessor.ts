import FrameProcessorInterface from './FrameProcessorInterface';
import SpeechProbabilities from './SpeechProbabilities';
import FrameProcessorOptions from './FrameProcessorOptions';
import Message from './Message';

const concatArrays = (arrays: Float32Array[]): Float32Array => {
  const sizes = arrays.reduce(
    (out, next) => {
      out.push((out.at(-1) as number) + next.length);
      return out;
    },
    [0]
  );
  const outArray = new Float32Array(sizes.at(-1) as number);
  arrays.forEach((arr, index) => {
    const place = sizes[index];
    outArray.set(arr, place);
  });
  return outArray;
};

class FrameProcessor implements FrameProcessorInterface {
  speaking: boolean = false;
  audioBuffer: { frame: Float32Array; isSpeech: boolean }[];
  redemptionCounter = 0;
  active = false;

  constructor(
    public modelProcessFunc: (frame: Float32Array) => Promise<SpeechProbabilities>,
    public modelResetFunc: () => any,
    public options: FrameProcessorOptions
  ) {
    this.audioBuffer = [];
    this.reset();
  }

  reset = () => {
    this.speaking = false;
    this.audioBuffer = [];
    this.modelResetFunc();
    this.redemptionCounter = 0;
  };

  pause = () => {
    this.active = false;
    this.reset();
  };

  resume = () => {
    this.active = true;
  };

  endSegment = () => {
    const audioBuffer = this.audioBuffer;
    this.audioBuffer = [];
    const speaking = this.speaking;
    this.reset();

    const speechFrameCount = audioBuffer.reduce((acc, item) => {
      return acc + +item.isSpeech;
    }, 0);

    if (speaking) {
      if (speechFrameCount >= this.options.minSpeechFrames) {
        const audio = concatArrays(audioBuffer.map(item => item.frame));
        return { msg: Message.SpeechEnd, audio };
      } else {
        return { msg: Message.VADMisfire };
      }
    }
    return {};
  };

  process = async (frame: Float32Array) => {
    if (!this.active) {
      return {};
    }
    const probs = await this.modelProcessFunc(frame);
    this.audioBuffer.push({
      frame,
      isSpeech: probs.isSpeech >= this.options.positiveSpeechThreshold,
    });

    if (probs.isSpeech >= this.options.positiveSpeechThreshold && this.redemptionCounter) {
      this.redemptionCounter = 0;
    }

    if (probs.isSpeech >= this.options.positiveSpeechThreshold && !this.speaking) {
      this.speaking = true;
      return { probs, msg: Message.SpeechStart };
    }

    if (
      probs.isSpeech < this.options.negativeSpeechThreshold &&
      this.speaking &&
      ++this.redemptionCounter >= this.options.redemptionFrames
    ) {
      this.redemptionCounter = 0;
      this.speaking = false;

      const audioBuffer = this.audioBuffer;
      this.audioBuffer = [];

      const speechFrameCount = audioBuffer.reduce((acc, item) => {
        return acc + +item.isSpeech;
      }, 0);

      if (speechFrameCount >= this.options.minSpeechFrames) {
        const audio = concatArrays(audioBuffer.map(item => item.frame));
        return { probs, msg: Message.SpeechEnd, audio };
      } else {
        return { probs, msg: Message.VADMisfire };
      }
    }

    if (!this.speaking) {
      while (this.audioBuffer.length > this.options.preSpeechPadFrames) {
        this.audioBuffer.shift();
      }
    }
    return { probs };
  };
}

export default FrameProcessor;

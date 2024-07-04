export type Message = { text: string; role: 'user' | 'assistant' } | { imageUri?: string; role: 'image' };

export type ChatState = {
  messages: Message[];
  isTalking: boolean;
  isRecording: boolean;
  isLoading: boolean;
  startRecording: (shouldDisplay: boolean) => Promise<void>;
  stopRecording: (shouldPlayback?: boolean) => Promise<void>;
  reset: () => void;
};

export const emptyCharacter = '🤷';

export const initialState = {
  messages: [] as Message[],
  isTalking: false,
  isRecording: false,
  isLoading: false,
} as const;

import { ColorSchemeName } from 'react-native';

export const DEFAULT_INTERESTS = [
  'music',
  'gaming',
  'fantasy',
  'sports',
  'art',
  'dancing',
  'animals',
  'exploration',
  'collecting',
  'fashion',
  'science',
  'movies_tv',
  'math',
  'cooking_baking',
  'role_playing',
  'reading',
  'building',
  'trading_cards',
] as const;

export const DEFAULT_MODERATION_CATEGORIES = [
  'hate',
  'hate_threatening',
  'harassment',
  'harassment_threatening',
  'selfharm',
  'selfharm_intent',
  'selfharm_instructions',
  'sexual',
  'sexual_minors',
  'violence',
  'violence_graphic',
] as const;

export const DEFAULT_TEXT_ANALYSIS_CATEGORIES = ['toxic', 'pegi_rating'] as const;

export const moderationMap = {
  harassment: 'harassment',
  'harassment/threatening': 'harassment_threatening',
  hate: 'hate',
  'hate/threatening': 'hate_threatening',
  'self-harm': 'selfharm',
  'self-harm/instructions': 'selfharm_instructions',
  'self-harm/intent': 'selfharm_intent',
  sexual: 'sexual',
  'sexual/minors': 'sexual_minors',
  violence: 'violence',
  'violence/graphic': 'violence_graphic',
};

export const SUPPORTED_APP_LANGUAGES = ['en', 'fr', 'es', 'de', 'it', 'bg', 'cz', 'da', 'nl', 'fi', 'el', 'pl', 'sv', 'ro', 'ru', 'pt'] as const;
export const SUPPORTED_CHARACTER_LANGUAGES = [
  '',
  'zh',
  'da',
  'nl',
  'de',
  'hi',
  'id',
  'it',
  'ja',
  'ko',
  'pl',
  'sv',
  'ta',
  'tr',
  'uk',
  'cz',
  'ar',
  'bg',
  'hr',
  'tl',
  'fi',
  'ms',
  'ro',
  'ru',
  'sk',
  'el',
  'en-AU',
  'en-GB',
  'en-NZ',
  'en-US',
  'es-ES',
  'es-419',
  'fr-CA',
  'fr-FR',
  'pt-BR',
  'pt-PT',
] as const;

export const SUPPORTED_MODES = ['conversation', 'fun', 'story'] as const;
export const SUPPORTED_VOICES = ['default', 'male', 'female'] as const;
export const SUPPORTED_TALKING_MODES = ['press', 'push', 'auto'] as const;
export const SUPPORTED_IMAGE_STYLES = [
  'anime',
  'comic-book',
  'digital-art',
  'enhance',
  'fantasy-art',
  'isometric',
  'line-art',
  'low-poly',
  'modeling-compound',
  'neon-punk',
  'origami',
  'pixel-art',
  'tile-texture',
] as const;

export type AppLanguage = (typeof SUPPORTED_APP_LANGUAGES)[number];
export type CharacterLanguage = (typeof SUPPORTED_CHARACTER_LANGUAGES)[number];
export type Interest = (typeof DEFAULT_INTERESTS)[number];
export type ModeratonCategory = (typeof DEFAULT_MODERATION_CATEGORIES)[number];
export type TextAnalysisCategory = (typeof DEFAULT_TEXT_ANALYSIS_CATEGORIES)[number];
export type CharacterMode = (typeof SUPPORTED_MODES)[number];
export type CharacterVoice = (typeof SUPPORTED_VOICES)[number];
export type TalkingMode = (typeof SUPPORTED_TALKING_MODES)[number];
export type CharacterEntry = {
  language: CharacterLanguage;
  mode: CharacterMode;
  voice: CharacterVoice;
  image_style: CharacterImageStyle;
};
export type CharacterImageStyle = (typeof SUPPORTED_IMAGE_STYLES)[number];

export type Profile = {
  id: string;
  moderate?: boolean;
  inactive?: boolean;
  name: string;
  response_age: number;
  interests?: Interest[] | null;
  topics_discourage?: string[] | null;
  topics_encourage?: string[] | null;
  dont_say?: string[] | null;
  notifications: {
    moderations?: Record<ModeratonCategory, boolean>;
    text_analysis?: Record<TextAnalysisCategory, boolean>;
    emails?: string[];
  };
  selected_character?: string;
  characters?: Record<string, CharacterEntry>;
};

export type Moderation = {
  categories: Record<ModeratonCategory, boolean>;
  analysis: {
    topic: string;
    classifications?: string[] | null;
    movie_rating: string;
    tv_rating: string;
    esrb_rating: string;
    pegi_rating: number;
    sentiment: string;
    emotion: string;
    intent: string;
    toxicity: string;
    subject_category: string;
  };
  tokens_prompt: number;
  tokens_response: number;
};

export type Account = {
  admin: boolean;
  characters?: null;
  display_name: string;
  email: string;
  id: string;
  timezone: string;
  developer_mode: boolean;
  pin: string;
  pin_enabled: boolean;
};

export type AccountReqPayload = Partial<Pick<Account, 'display_name' | 'pin' | 'pin_enabled'>>;

export type AccountPreferences = {
  '2xl:isFirstLogin'?: boolean;
  '2xl:colorScheme'?: ColorSchemeName;
  '2xl:activeProfileId'?: string;
  '2xl:language'?: AppLanguage;
  '2xl:talkingMode'?: TalkingMode;
  '2xl:hasInsightFiller'?: boolean;
  '2xl:hasThinkingFiller'?: boolean;
};

export type ArchiveSummary = {
  topic: string;
  analysis: string[];
  user_summary: string;
  topic_summary: string;
};

export type ArchiveEntry = {
  user: string;
  assistant: string;
  user_audio: string;
  assistant_audio: string;
  moderation: {
    categories: Record<ModeratonCategory, boolean>;
    analysis: {
      topic: string;
      classifications: string[];
      sentiment: string;
      intent: string;
      toxicity: string;
    };
    tokens_prompt: number;
    tokens_response: number;
  };
  timestamp: string;
  tokens_prompt: number;
  tokens_response: number;
  duration: number;
};

export type Notification = {
  id: string;
  type: 'moderation';
  inactive?: boolean;
  read: boolean;
  timestamp: string;
  moderation_value: {
    profile: {
      id: string;
      name: string;
    };
    character: {
      name: string;
    };
    session: {
      archive: string;
      entry: {
        audio_id: string;
        moderation: Moderation;
        path: string;
        session_id: number;
        user: string;
        timestamp: string;
      };
      entry_number: number;
    };
  };
};

export type RobotStatus = 'TALK' | 'LISTEN' | 'THINK';

export type Characters = Record<
  string,
  {
    name: string;
    versions: Record<
      string,
      {
        languages: CharacterLanguage[];
        modes: CharacterMode[];
        voices: CharacterVoice[];
      }
    >;
  }
>;

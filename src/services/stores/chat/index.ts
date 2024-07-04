import Config from 'react-native-config';
import { useMagicChatStore } from './magic-chat.store';
import { use2XLChatStore } from './2xl-chat.store';

export const useChatStore = Config.PUBLIC_WHITELABEL === '2xl' ? use2XLChatStore : useMagicChatStore;

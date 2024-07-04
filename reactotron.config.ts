import Reactotron, { networking } from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (Reactotron.setAsyncStorageHandler) {
  Reactotron.setAsyncStorageHandler(AsyncStorage).configure({ name: 'RN-2XL' }).useReactNative().use(networking()).connect();
}

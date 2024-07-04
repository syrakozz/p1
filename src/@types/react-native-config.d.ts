declare module 'react-native-config' {
  export interface NativeConfig {
    PUBLIC_WHITELABEL: '2xl' | 'magic';
    PUBLIC_WHITELABEL_NAME: 'My2XL' | 'magic';
  }

  export const Config: NativeConfig;
  export default Config;
}

import { Platform } from 'react-native';

const CONFIG_KEYS = {
  UAT: {
    '2xl': 'uat_2xl',
  },
  TEST: {
    '2xl': 'test_2xl',
  },
  DEV: {
    '2xl': 'dev_2xl',
  },
  AD: {
    '2xl': 'prod_eu_2xl',
  },
  AE: {
    '2xl': 'prod_asia_2xl',
  },
  AF: {
    '2xl': 'prod_asia_2xl',
  },
  AG: {
    '2xl': 'prod_na_2xl',
  },
  AL: {
    '2xl': 'prod_eu_2xl',
  },
  AM: {
    '2xl': 'prod_eu_2xl',
  },
  AO: {
    '2xl': 'prod_eu_2xl',
  },
  AR: {
    '2xl': 'prod_na_2xl',
  },
  AT: {
    '2xl': 'prod_eu_2xl',
  },
  AU: {
    '2xl': 'prod_asia_2xl',
  },
  AZ: {
    '2xl': 'prod_asia_2xl',
  },
  BA: {
    '2xl': 'prod_eu_2xl',
  },
  BB: {
    '2xl': 'prod_na_2xl',
  },
  BD: {
    '2xl': 'prod_asia_2xl',
  },
  BE: {
    '2xl': 'prod_eu_2xl',
  },
  BF: {
    '2xl': 'prod_eu_2xl',
  },
  BG: {
    '2xl': 'prod_eu_2xl',
  },
  BH: {
    '2xl': 'prod_asia_2xl',
  },
  BI: {
    '2xl': 'prod_eu_2xl',
  },
  BJ: {
    '2xl': 'prod_eu_2xl',
  },
  BN: {
    '2xl': 'prod_asia_2xl',
  },
  BO: {
    '2xl': 'prod_na_2xl',
  },
  BR: {
    '2xl': 'prod_na_2xl',
  },
  BS: {
    '2xl': 'prod_na_2xl',
  },
  BT: {
    '2xl': 'prod_asia_2xl',
  },
  BW: {
    '2xl': 'prod_eu_2xl',
  },
  BY: {
    '2xl': 'prod_eu_2xl',
  },
  BZ: {
    '2xl': 'prod_na_2xl',
  },
  CA: {
    '2xl': 'prod_na_2xl',
  },
  CF: {
    '2xl': 'prod_eu_2xl',
  },
  CG: {
    '2xl': 'prod_eu_2xl',
  },
  CH: {
    '2xl': 'prod_eu_2xl',
  },
  CI: {
    '2xl': 'prod_eu_2xl',
  },
  CL: {
    '2xl': 'prod_na_2xl',
  },
  CM: {
    '2xl': 'prod_eu_2xl',
  },
  CN: {
    '2xl': 'prod_asia_2xl',
  },
  CO: {
    '2xl': 'prod_na_2xl',
  },
  CR: {
    '2xl': 'prod_na_2xl',
  },
  CU: {
    '2xl': 'prod_na_2xl',
  },
  CV: {
    '2xl': 'prod_eu_2xl',
  },
  CY: {
    '2xl': 'prod_eu_2xl',
  },
  CZ: {
    '2xl': 'prod_eu_2xl',
  },
  DE: {
    '2xl': 'prod_eu_2xl',
  },
  DJ: {
    '2xl': 'prod_eu_2xl',
  },
  DK: {
    '2xl': 'prod_eu_2xl',
  },
  DM: {
    '2xl': 'prod_na_2xl',
  },
  DO: {
    '2xl': 'prod_na_2xl',
  },
  DZ: {
    '2xl': 'prod_eu_2xl',
  },
  EC: {
    '2xl': 'prod_na_2xl',
  },
  EE: {
    '2xl': 'prod_eu_2xl',
  },
  EG: {
    '2xl': 'prod_eu_2xl',
  },
  ER: {
    '2xl': 'prod_eu_2xl',
  },
  ES: {
    '2xl': 'prod_eu_2xl',
  },
  ET: {
    '2xl': 'prod_eu_2xl',
  },
  FI: {
    '2xl': 'prod_eu_2xl',
  },
  FJ: {
    '2xl': 'prod_asia_2xl',
  },
  FM: {
    '2xl': 'prod_asia_2xl',
  },
  FR: {
    '2xl': 'prod_eu_2xl',
  },
  GA: {
    '2xl': 'prod_eu_2xl',
  },
  GB: {
    '2xl': 'prod_eu_2xl',
  },
  GD: {
    '2xl': 'prod_na_2xl',
  },
  GE: {
    '2xl': 'prod_eu_2xl',
  },
  GH: {
    '2xl': 'prod_eu_2xl',
  },
  GM: {
    '2xl': 'prod_eu_2xl',
  },
  GN: {
    '2xl': 'prod_eu_2xl',
  },
  GQ: {
    '2xl': 'prod_eu_2xl',
  },
  GR: {
    '2xl': 'prod_eu_2xl',
  },
  GT: {
    '2xl': 'prod_na_2xl',
  },
  GW: {
    '2xl': 'prod_eu_2xl',
  },
  GY: {
    '2xl': 'prod_na_2xl',
  },
  HN: {
    '2xl': 'prod_na_2xl',
  },
  HR: {
    '2xl': 'prod_eu_2xl',
  },
  HT: {
    '2xl': 'prod_na_2xl',
  },
  HU: {
    '2xl': 'prod_eu_2xl',
  },
  ID: {
    '2xl': 'prod_asia_2xl',
  },
  IE: {
    '2xl': 'prod_eu_2xl',
  },
  IL: {
    '2xl': 'prod_asia_2xl',
  },
  IN: {
    '2xl': 'prod_asia_2xl',
  },
  IQ: {
    '2xl': 'prod_asia_2xl',
  },
  IR: {
    '2xl': 'prod_asia_2xl',
  },
  IS: {
    '2xl': 'prod_eu_2xl',
  },
  IT: {
    '2xl': 'prod_eu_2xl',
  },
  JM: {
    '2xl': 'prod_na_2xl',
  },
  JO: {
    '2xl': 'prod_asia_2xl',
  },
  JP: {
    '2xl': 'prod_asia_2xl',
  },
  KE: {
    '2xl': 'prod_eu_2xl',
  },
  KG: {
    '2xl': 'prod_asia_2xl',
  },
  KH: {
    '2xl': 'prod_asia_2xl',
  },
  KI: {
    '2xl': 'prod_asia_2xl',
  },
  KM: {
    '2xl': 'prod_eu_2xl',
  },
  KN: {
    '2xl': 'prod_na_2xl',
  },
  KP: {
    '2xl': 'prod_asia_2xl',
  },
  KR: {
    '2xl': 'prod_asia_2xl',
  },
  KW: {
    '2xl': 'prod_asia_2xl',
  },
  KZ: {
    '2xl': 'prod_asia_2xl',
  },
  LA: {
    '2xl': 'prod_asia_2xl',
  },
  LB: {
    '2xl': 'prod_asia_2xl',
  },
  LC: {
    '2xl': 'prod_na_2xl',
  },
  LI: {
    '2xl': 'prod_eu_2xl',
  },
  LK: {
    '2xl': 'prod_asia_2xl',
  },
  LR: {
    '2xl': 'prod_eu_2xl',
  },
  LS: {
    '2xl': 'prod_eu_2xl',
  },
  LT: {
    '2xl': 'prod_eu_2xl',
  },
  LU: {
    '2xl': 'prod_eu_2xl',
  },
  LV: {
    '2xl': 'prod_eu_2xl',
  },
  LY: {
    '2xl': 'prod_eu_2xl',
  },
  MA: {
    '2xl': 'prod_eu_2xl',
  },
  MC: {
    '2xl': 'prod_eu_2xl',
  },
  MD: {
    '2xl': 'prod_eu_2xl',
  },
  ME: {
    '2xl': 'prod_eu_2xl',
  },
  MG: {
    '2xl': 'prod_eu_2xl',
  },
  MH: {
    '2xl': 'prod_asia_2xl',
  },
  MK: {
    '2xl': 'prod_eu_2xl',
  },
  ML: {
    '2xl': 'prod_eu_2xl',
  },
  MM: {
    '2xl': 'prod_asia_2xl',
  },
  MN: {
    '2xl': 'prod_asia_2xl',
  },
  MR: {
    '2xl': 'prod_eu_2xl',
  },
  MT: {
    '2xl': 'prod_eu_2xl',
  },
  MU: {
    '2xl': 'prod_eu_2xl',
  },
  MV: {
    '2xl': 'prod_asia_2xl',
  },
  MW: {
    '2xl': 'prod_eu_2xl',
  },
  MX: {
    '2xl': 'prod_na_2xl',
  },
  MY: {
    '2xl': 'prod_asia_2xl',
  },
  MZ: {
    '2xl': 'prod_eu_2xl',
  },
  NA: {
    '2xl': 'prod_eu_2xl',
  },
  NE: {
    '2xl': 'prod_eu_2xl',
  },
  NG: {
    '2xl': 'prod_eu_2xl',
  },
  NI: {
    '2xl': 'prod_na_2xl',
  },
  NL: {
    '2xl': 'prod_eu_2xl',
  },
  NO: {
    '2xl': 'prod_eu_2xl',
  },
  NP: {
    '2xl': 'prod_asia_2xl',
  },
  NR: {
    '2xl': 'prod_asia_2xl',
  },
  NZ: {
    '2xl': 'prod_asia_2xl',
  },
  OM: {
    '2xl': 'prod_asia_2xl',
  },
  PA: {
    '2xl': 'prod_na_2xl',
  },
  PE: {
    '2xl': 'prod_na_2xl',
  },
  PG: {
    '2xl': 'prod_asia_2xl',
  },
  PH: {
    '2xl': 'prod_asia_2xl',
  },
  PK: {
    '2xl': 'prod_asia_2xl',
  },
  PL: {
    '2xl': 'prod_eu_2xl',
  },
  PT: {
    '2xl': 'prod_eu_2xl',
  },
  PW: {
    '2xl': 'prod_asia_2xl',
  },
  PY: {
    '2xl': 'prod_na_2xl',
  },
  QA: {
    '2xl': 'prod_asia_2xl',
  },
  RO: {
    '2xl': 'prod_eu_2xl',
  },
  RS: {
    '2xl': 'prod_eu_2xl',
  },
  RU: {
    '2xl': 'prod_asia_2xl',
  },
  RW: {
    '2xl': 'prod_eu_2xl',
  },
  SA: {
    '2xl': 'prod_asia_2xl',
  },
  SB: {
    '2xl': 'prod_asia_2xl',
  },
  SC: {
    '2xl': 'prod_eu_2xl',
  },
  SD: {
    '2xl': 'prod_eu_2xl',
  },
  SE: {
    '2xl': 'prod_eu_2xl',
  },
  SG: {
    '2xl': 'prod_asia_2xl',
  },
  SI: {
    '2xl': 'prod_eu_2xl',
  },
  SK: {
    '2xl': 'prod_eu_2xl',
  },
  SL: {
    '2xl': 'prod_eu_2xl',
  },
  SM: {
    '2xl': 'prod_eu_2xl',
  },
  SN: {
    '2xl': 'prod_eu_2xl',
  },
  SO: {
    '2xl': 'prod_eu_2xl',
  },
  SR: {
    '2xl': 'prod_na_2xl',
  },
  SS: {
    '2xl': 'prod_eu_2xl',
  },
  ST: {
    '2xl': 'prod_eu_2xl',
  },
  SV: {
    '2xl': 'prod_na_2xl',
  },
  SY: {
    '2xl': 'prod_asia_2xl',
  },
  SZ: {
    '2xl': 'prod_eu_2xl',
  },
  TD: {
    '2xl': 'prod_eu_2xl',
  },
  TG: {
    '2xl': 'prod_eu_2xl',
  },
  TH: {
    '2xl': 'prod_asia_2xl',
  },
  TJ: {
    '2xl': 'prod_asia_2xl',
  },
  TL: {
    '2xl': 'prod_asia_2xl',
  },
  TM: {
    '2xl': 'prod_asia_2xl',
  },
  TN: {
    '2xl': 'prod_eu_2xl',
  },
  TO: {
    '2xl': 'prod_asia_2xl',
  },
  TR: {
    '2xl': 'prod_eu_2xl',
  },
  TT: {
    '2xl': 'prod_na_2xl',
  },
  TV: {
    '2xl': 'prod_asia_2xl',
  },
  TW: {
    '2xl': 'prod_asia_2xl',
  },
  TZ: {
    '2xl': 'prod_asia_2xl',
  },
  UA: {
    '2xl': 'prod_eu_2xl',
  },
  UG: {
    '2xl': 'prod_asia_2xl',
  },
  US: {
    '2xl': 'prod_na_2xl',
  },
  UY: {
    '2xl': 'prod_na_2xl',
  },
  UZ: {
    '2xl': 'prod_asia_2xl',
  },
  VA: {
    '2xl': 'prod_eu_2xl',
  },
  VC: {
    '2xl': 'prod_na_2xl',
  },
  VE: {
    '2xl': 'prod_na_2xl',
  },
  VN: {
    '2xl': 'prod_asia_2xl',
  },
  VU: {
    '2xl': 'prod_asia_2xl',
  },
  WS: {
    '2xl': 'prod_asia_2xl',
  },
  XK: {
    '2xl': 'prod_eu_2xl',
  },
  YE: {
    '2xl': 'prod_asia_2xl',
  },
  ZA: {
    '2xl': 'prod_eu_2xl',
  },
  ZM: {
    '2xl': 'prod_asia_2xl',
  },
  ZW: {
    '2xl': 'prod_asia_2xl',
  },
};

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  databaseURL: string;
};

const FIREBASE_CONFIG_MAP: { [key: string]: FirebaseConfig } = {
  prod_asia_2xl_android: {
    databaseURL: '',
    apiKey: 'AIzaSyBarmeHCUhUQoljVIGh-X2pjq57HlNIM84',
    authDomain: 'prj-d1s-2xl-asia-se1.firebaseapp.com',
    projectId: 'prj-d1s-2xl-asia-se1',
    storageBucket: 'prj-d1s-2xl-asia-se1.appspot.com',
    messagingSenderId: '925351289885',
    appId: '1:925351289885:android:715aff2d9cba4ffaf612f4',
    measurementId: 'G-WXM45JMM34',
  },
  prod_eu_2xl_android: {
    databaseURL: '',
    apiKey: 'AIzaSyAPN-UCSibbH-RkrcSoT7oPyk9Rte52T6I',
    authDomain: 'prj-d1s-2xl-eur3.firebaseapp.com',
    projectId: 'prj-d1s-2xl-eur3',
    storageBucket: 'prj-d1s-2xl-eur3.appspot.com',
    messagingSenderId: '334890088752',
    appId: '1:334890088752:android:6ee32199cf8a11e352b0f5',
    measurementId: 'G-2163XLVRCD',
  },
  prod_na_2xl_android: {
    databaseURL: '',
    apiKey: 'AIzaSyDMXs3j2KcQD4vVp7nx2emYRuouLhOqgOE',
    authDomain: 'prj-d1s-2xl-nam5.firebaseapp.com',
    projectId: 'prj-d1s-2xl-nam5',
    storageBucket: 'prj-d1s-2xl-nam5.appspot.com',
    messagingSenderId: '700358016207',
    appId: '1:700358016207:android:cac6f39d1de9d9aa25cbba',
    measurementId: 'G-GTS95KFE21',
  },
  uat_2xl_android: {
    databaseURL: '',
    apiKey: 'AIzaSyDP23N-R-tS0xFpHK6MYjaIU_i0ylITAqc',
    authDomain: 'prj-d1s-2xl-uat.firebaseapp.com',
    projectId: 'prj-d1s-2xl-uat',
    storageBucket: 'prj-d1s-2xl-uat.appspot.com',
    messagingSenderId: '962853942765',
    appId: '1:962853942765:android:240bb25302b90ea6cda3e4',
    measurementId: 'G-NEPG2VXL0G',
  },
  test_2xl_android: {
    databaseURL: '',
    apiKey: 'AIzaSyCfln0ui3cjmaZKANoa_pd3LkNOlx3WLEY',
    authDomain: 'prj-d1s-sandbox.firebaseapp.com',
    projectId: 'prj-d1s-sandbox',
    storageBucket: 'prj-d1s-sandbox.appspot.com',
    messagingSenderId: '1079695387518',
    appId: '1:1079695387518:android:edd193b7208cfe8003212f',
    measurementId: 'G-YG14LNW7KP',
  },
  dev_2xl_android: {
    databaseURL: '',
    apiKey: 'AIzaSyCfln0ui3cjmaZKANoa_pd3LkNOlx3WLEY',
    authDomain: 'prj-d1s-sandbox.firebaseapp.com',
    projectId: 'prj-d1s-sandbox',
    storageBucket: 'prj-d1s-sandbox.appspot.com',
    messagingSenderId: '1079695387518',
    appId: '1:1079695387518:android:edd193b7208cfe8003212f',
    measurementId: 'G-YG14LNW7KP',
  },
  prod_asia_2xl_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyBarmeHCUhUQoljVIGh-X2pjq57HlNIM84',
    authDomain: 'prj-d1s-2xl-asia-se1.firebaseapp.com',
    projectId: 'prj-d1s-2xl-asia-se1',
    storageBucket: 'prj-d1s-2xl-asia-se1.appspot.com',
    messagingSenderId: '925351289885',
    appId: '1:925351289885:ios:c2a88cfbb9fb755cf612f4',
    measurementId: 'G-WXM45JMM34',
  },
  prod_eu_2xl_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyAPN-UCSibbH-RkrcSoT7oPyk9Rte52T6I',
    authDomain: 'prj-d1s-2xl-eur3.firebaseapp.com',
    projectId: 'prj-d1s-2xl-eur3',
    storageBucket: 'prj-d1s-2xl-eur3.appspot.com',
    messagingSenderId: '334890088752',
    appId: '1:334890088752:ios:82054b8d4b7e3bc052b0f5',
    measurementId: 'G-2163XLVRCD',
  },
  prod_na_2xl_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyDMXs3j2KcQD4vVp7nx2emYRuouLhOqgOE',
    authDomain: 'prj-d1s-2xl-nam5.firebaseapp.com',
    projectId: 'prj-d1s-2xl-nam5',
    storageBucket: 'prj-d1s-2xl-nam5.appspot.com',
    messagingSenderId: '700358016207',
    appId: '1:700358016207:ios:52056405d40face425cbba',
    measurementId: 'G-GTS95KFE21',
  },
  uat_2xl_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyDP23N-R-tS0xFpHK6MYjaIU_i0ylITAqc',
    authDomain: 'prj-d1s-2xl-uat.firebaseapp.com',
    projectId: 'prj-d1s-2xl-uat',
    storageBucket: 'prj-d1s-2xl-uat.appspot.com',
    messagingSenderId: '962853942765',
    appId: '1:962853942765:ios:d11da8d28c07a15ccda3e4',
    measurementId: 'G-NEPG2VXL0G',
  },
  test_2xl_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyCfln0ui3cjmaZKANoa_pd3LkNOlx3WLEY',
    authDomain: 'prj-d1s-sandbox.firebaseapp.com',
    projectId: 'prj-d1s-sandbox',
    storageBucket: 'prj-d1s-sandbox.appspot.com',
    messagingSenderId: '1079695387518',
    appId: '1:1079695387518:ios:49246aa8c49fd13203212f',
    measurementId: 'G-YG14LNW7KP',
  },
  dev_2xl_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyCfln0ui3cjmaZKANoa_pd3LkNOlx3WLEY',
    authDomain: 'prj-d1s-sandbox.firebaseapp.com',
    projectId: 'prj-d1s-sandbox',
    storageBucket: 'prj-d1s-sandbox.appspot.com',
    messagingSenderId: '1079695387518',
    appId: '1:1079695387518:ios:49246aa8c49fd13203212f',
    measurementId: 'G-YG14LNW7KP',
  },
  prod_asia_magic_android: {
    databaseURL: '',
    apiKey: 'AIzaSyBarmeHCUhUQoljVIGh-X2pjq57HlNIM84',
    authDomain: 'prj-d1s-2xl-asia-se1.firebaseapp.com',
    projectId: 'prj-d1s-2xl-asia-se1',
    storageBucket: 'prj-d1s-2xl-asia-se1.appspot.com',
    messagingSenderId: '925351289885',
    appId: '1:925351289885:android:17f992162746ab97f612f4',
    measurementId: 'G-WXM45JMM34',
  },
  prod_eu_magic_android: {
    databaseURL: '',
    apiKey: 'AIzaSyAPN-UCSibbH-RkrcSoT7oPyk9Rte52T6I',
    authDomain: 'prj-d1s-2xl-eur3.firebaseapp.com',
    projectId: 'prj-d1s-2xl-eur3',
    storageBucket: 'prj-d1s-2xl-eur3.appspot.com',
    messagingSenderId: '334890088752',
    appId: '1:334890088752:android:be1c1f3c59efbf0852b0f5',
    measurementId: 'G-2163XLVRCD',
  },
  prod_na_magic_android: {
    databaseURL: '',
    apiKey: 'AIzaSyDMXs3j2KcQD4vVp7nx2emYRuouLhOqgOE',
    authDomain: 'prj-d1s-2xl-nam5.firebaseapp.com',
    projectId: 'prj-d1s-2xl-nam5',
    storageBucket: 'prj-d1s-2xl-nam5.appspot.com',
    messagingSenderId: '700358016207',
    appId: '1:700358016207:android:ada706bf31ae545325cbba',
    measurementId: 'G-GTS95KFE21',
  },
  uat_magic_android: {
    databaseURL: '',
    apiKey: 'AIzaSyDP23N-R-tS0xFpHK6MYjaIU_i0ylITAqc',
    authDomain: 'prj-d1s-2xl-uat.firebaseapp.com',
    projectId: 'prj-d1s-2xl-uat',
    storageBucket: 'prj-d1s-2xl-uat.appspot.com',
    messagingSenderId: '962853942765',
    appId: '1:962853942765:android:0fe2312b8f4f9a8ccda3e4',
    measurementId: 'G-NEPG2VXL0G',
  },
  test_magic_android: {
    databaseURL: '',
    apiKey: 'AIzaSyCfln0ui3cjmaZKANoa_pd3LkNOlx3WLEY',
    authDomain: 'prj-d1s-sandbox.firebaseapp.com',
    projectId: 'prj-d1s-sandbox',
    storageBucket: 'prj-d1s-sandbox.appspot.com',
    messagingSenderId: '1079695387518',
    appId: '1:1079695387518:android:20061fefc29a4fbc03212f',
    measurementId: 'G-YG14LNW7KP',
  },
  dev_magic_android: {
    databaseURL: '',
    apiKey: 'AIzaSyCfln0ui3cjmaZKANoa_pd3LkNOlx3WLEY',
    authDomain: 'prj-d1s-sandbox.firebaseapp.com',
    projectId: 'prj-d1s-sandbox',
    storageBucket: 'prj-d1s-sandbox.appspot.com',
    messagingSenderId: '1079695387518',
    appId: '1:1079695387518:android:20061fefc29a4fbc03212f',
    measurementId: 'G-YG14LNW7KP',
  },
  prod_asia_magic_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyBarmeHCUhUQoljVIGh-X2pjq57HlNIM84',
    authDomain: 'prj-d1s-2xl-asia-se1.firebaseapp.com',
    projectId: 'prj-d1s-2xl-asia-se1',
    storageBucket: 'prj-d1s-2xl-asia-se1.appspot.com',
    messagingSenderId: '925351289885',
    appId: '1:925351289885:ios:ecc07ce3be03acedf612f4',
    measurementId: 'G-WXM45JMM34',
  },
  prod_eu_magic_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyAPN-UCSibbH-RkrcSoT7oPyk9Rte52T6I',
    authDomain: 'prj-d1s-2xl-eur3.firebaseapp.com',
    projectId: 'prj-d1s-2xl-eur3',
    storageBucket: 'prj-d1s-2xl-eur3.appspot.com',
    messagingSenderId: '334890088752',
    appId: '1:334890088752:ios:de62a0d90b3248a652b0f5',
    measurementId: 'G-2163XLVRCD',
  },
  prod_na_magic_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyDMXs3j2KcQD4vVp7nx2emYRuouLhOqgOE',
    authDomain: 'prj-d1s-2xl-nam5.firebaseapp.com',
    projectId: 'prj-d1s-2xl-nam5',
    storageBucket: 'prj-d1s-2xl-nam5.appspot.com',
    messagingSenderId: '700358016207',
    appId: '1:700358016207:ios:a43b7a84257f4be125cbba',
    measurementId: 'G-GTS95KFE21',
  },
  uat_magic_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyDP23N-R-tS0xFpHK6MYjaIU_i0ylITAqc',
    authDomain: 'prj-d1s-2xl-uat.firebaseapp.com',
    projectId: 'prj-d1s-2xl-uat',
    storageBucket: 'prj-d1s-2xl-uat.appspot.com',
    messagingSenderId: '962853942765',
    appId: '1:962853942765:ios:1b9ff70a7257f38ccda3e4',
    measurementId: 'G-NEPG2VXL0G',
  },
  test_magic_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyCfln0ui3cjmaZKANoa_pd3LkNOlx3WLEY',
    authDomain: 'prj-d1s-sandbox.firebaseapp.com',
    projectId: 'prj-d1s-sandbox',
    storageBucket: 'prj-d1s-sandbox.appspot.com',
    messagingSenderId: '1079695387518',
    appId: '1:1079695387518:ios:f3d511454523818003212f',
    measurementId: 'G-YG14LNW7KP',
  },
  dev_magic_ios: {
    databaseURL: '',
    apiKey: 'AIzaSyCfln0ui3cjmaZKANoa_pd3LkNOlx3WLEY',
    authDomain: 'prj-d1s-sandbox.firebaseapp.com',
    projectId: 'prj-d1s-sandbox',
    storageBucket: 'prj-d1s-sandbox.appspot.com',
    messagingSenderId: '1079695387518',
    appId: '1:1079695387518:ios:f3d511454523818003212f',
    measurementId: 'G-YG14LNW7KP',
  },
};

export const getFirebaseConfig = (countryCode: string): FirebaseConfig => {
  const configKey = CONFIG_KEYS[countryCode as keyof typeof CONFIG_KEYS]?.['2xl'];
  const defaultConfigKey = CONFIG_KEYS.US['2xl'];
  return FIREBASE_CONFIG_MAP[(configKey || defaultConfigKey) + '_' + Platform.OS];
};

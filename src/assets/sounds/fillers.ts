import type { CharacterLanguage } from '../../api/vox.types';
import { Asset } from 'expo-asset';
import RNFS from 'react-native-fs';
import { decode as atob } from 'base-64';
import { pickRandom } from '../../services/utils/various.utils';

type SUPPORTED_FILLERS = keyof typeof soundFiles;
type SUPPORTED_FILLER_LANGUAGE = keyof (typeof soundFiles)['mp3_22050_32']['INSIGHT'];

const soundFiles = {
  mp3_22050_32: {
    THINK: [require('./think/Vers_8.mp3'), require('./think/Vers_8A.mp3')],
    INSIGHT: {
      bg: [
        require('./insight/bg/001.mp3'),
        require('./insight/bg/002.mp3'),
        require('./insight/bg/003.mp3'),
        require('./insight/bg/004.mp3'),
        require('./insight/bg/005.mp3'),
      ],
      cz: [
        require('./insight/cz/001.mp3'),
        require('./insight/cz/002.mp3'),
        require('./insight/cz/003.mp3'),
        require('./insight/cz/004.mp3'),
        require('./insight/cz/005.mp3'),
      ],
      da: [
        require('./insight/da/001.mp3'),
        require('./insight/da/002.mp3'),
        require('./insight/da/003.mp3'),
        require('./insight/da/004.mp3'),
        require('./insight/da/005.mp3'),
      ],
      de: [
        require('./insight/de/001.mp3'),
        require('./insight/de/002.mp3'),
        require('./insight/de/003.mp3'),
        require('./insight/de/004.mp3'),
        require('./insight/de/005.mp3'),
        require('./insight/de/006.mp3'),
        require('./insight/de/007.mp3'),
        require('./insight/de/008.mp3'),
        require('./insight/de/009.mp3'),
        require('./insight/de/010.mp3'),
      ],
      el: [
        require('./insight/el/001.mp3'),
        require('./insight/el/002.mp3'),
        require('./insight/el/003.mp3'),
        require('./insight/el/004.mp3'),
        require('./insight/el/005.mp3'),
      ],
      en: [
        require('./insight/en/001.mp3'),
        require('./insight/en/002.mp3'),
        require('./insight/en/003.mp3'),
        require('./insight/en/004.mp3'),
        require('./insight/en/005.mp3'),
        require('./insight/en/006.mp3'),
        require('./insight/en/007.mp3'),
        require('./insight/en/008.mp3'),
        require('./insight/en/009.mp3'),
        require('./insight/en/010.mp3'),
        require('./insight/en/011.mp3'),
        require('./insight/en/012.mp3'),
        require('./insight/en/013.mp3'),
        require('./insight/en/014.mp3'),
        require('./insight/en/015.mp3'),
        require('./insight/en/016.mp3'),
        require('./insight/en/017.mp3'),
        require('./insight/en/018.mp3'),
        require('./insight/en/019.mp3'),
        require('./insight/en/020.mp3'),
        require('./insight/en/021.mp3'),
        require('./insight/en/022.mp3'),
        require('./insight/en/023.mp3'),
        require('./insight/en/024.mp3'),
        require('./insight/en/025.mp3'),
        require('./insight/en/026.mp3'),
        require('./insight/en/027.mp3'),
        require('./insight/en/028.mp3'),
        require('./insight/en/029.mp3'),
        require('./insight/en/030.mp3'),
      ],
      es: [
        require('./insight/es/001.mp3'),
        require('./insight/es/002.mp3'),
        require('./insight/es/003.mp3'),
        require('./insight/es/004.mp3'),
        require('./insight/es/005.mp3'),
      ],
      fi: [
        require('./insight/fi/001.mp3'),
        require('./insight/fi/002.mp3'),
        require('./insight/fi/003.mp3'),
        require('./insight/fi/004.mp3'),
        require('./insight/fi/005.mp3'),
      ],
      fr: [
        require('./insight/fr/001.mp3'),
        require('./insight/fr/002.mp3'),
        require('./insight/fr/003.mp3'),
        require('./insight/fr/004.mp3'),
        require('./insight/fr/005.mp3'),
      ],
      hi: [
        require('./insight/hi/001.mp3'),
        require('./insight/hi/002.mp3'),
        require('./insight/hi/003.mp3'),
        require('./insight/hi/004.mp3'),
        require('./insight/hi/005.mp3'),
      ],
      hr: [
        require('./insight/hr/001.mp3'),
        require('./insight/hr/002.mp3'),
        require('./insight/hr/003.mp3'),
        require('./insight/hr/004.mp3'),
        require('./insight/hr/005.mp3'),
      ],
      id: [
        require('./insight/id/001.mp3'),
        require('./insight/id/002.mp3'),
        require('./insight/id/003.mp3'),
        require('./insight/id/004.mp3'),
        require('./insight/id/005.mp3'),
      ],
      it: [
        require('./insight/it/001.mp3'),
        require('./insight/it/002.mp3'),
        require('./insight/it/003.mp3'),
        require('./insight/it/004.mp3'),
        require('./insight/it/005.mp3'),
      ],
      ja: [
        require('./insight/ja/001.mp3'),
        require('./insight/ja/002.mp3'),
        require('./insight/ja/003.mp3'),
        require('./insight/ja/004.mp3'),
        require('./insight/ja/005.mp3'),
        require('./insight/ja/006.mp3'),
        require('./insight/ja/007.mp3'),
        require('./insight/ja/008.mp3'),
        require('./insight/ja/009.mp3'),
        require('./insight/ja/010.mp3'),
      ],
      ko: [
        require('./insight/ko/001.mp3'),
        require('./insight/ko/002.mp3'),
        require('./insight/ko/003.mp3'),
        require('./insight/ko/004.mp3'),
        require('./insight/ko/005.mp3'),
      ],
      ms: [
        require('./insight/ms/001.mp3'),
        require('./insight/ms/002.mp3'),
        require('./insight/ms/003.mp3'),
        require('./insight/ms/004.mp3'),
        require('./insight/ms/005.mp3'),
      ],
      nl: [
        require('./insight/nl/001.mp3'),
        require('./insight/nl/002.mp3'),
        require('./insight/nl/003.mp3'),
        require('./insight/nl/004.mp3'),
        require('./insight/nl/005.mp3'),
      ],
      pl: [
        require('./insight/pl/001.mp3'),
        require('./insight/pl/002.mp3'),
        require('./insight/pl/003.mp3'),
        require('./insight/pl/004.mp3'),
        require('./insight/pl/005.mp3'),
      ],
      pt: [
        require('./insight/pt/001.mp3'),
        require('./insight/pt/002.mp3'),
        require('./insight/pt/003.mp3'),
        require('./insight/pt/004.mp3'),
        require('./insight/pt/005.mp3'),
      ],
      ro: [
        require('./insight/ro/001.mp3'),
        require('./insight/ro/002.mp3'),
        require('./insight/ro/003.mp3'),
        require('./insight/ro/004.mp3'),
        require('./insight/ro/005.mp3'),
      ],
      ru: [
        require('./insight/ru/001.mp3'),
        require('./insight/ru/002.mp3'),
        require('./insight/ru/003.mp3'),
        require('./insight/ru/004.mp3'),
        require('./insight/ru/005.mp3'),
      ],
      sk: [
        require('./insight/sk/001.mp3'),
        require('./insight/sk/002.mp3'),
        require('./insight/sk/003.mp3'),
        require('./insight/sk/004.mp3'),
        require('./insight/sk/005.mp3'),
      ],
      sv: [
        require('./insight/sv/001.mp3'),
        require('./insight/sv/002.mp3'),
        require('./insight/sv/003.mp3'),
        require('./insight/sv/004.mp3'),
        require('./insight/sv/005.mp3'),
      ],
      ta: [
        require('./insight/ta/001.mp3'),
        require('./insight/ta/002.mp3'),
        require('./insight/ta/003.mp3'),
        require('./insight/ta/004.mp3'),
        require('./insight/ta/005.mp3'),
      ],
      th: [
        require('./insight/th/001.mp3'),
        require('./insight/th/002.mp3'),
        require('./insight/th/003.mp3'),
        require('./insight/th/004.mp3'),
        require('./insight/th/005.mp3'),
      ],
      tl: [
        require('./insight/tl/001.mp3'),
        require('./insight/tl/002.mp3'),
        require('./insight/tl/003.mp3'),
        require('./insight/tl/004.mp3'),
        require('./insight/tl/005.mp3'),
      ],
      tr: [
        require('./insight/tr/001.mp3'),
        require('./insight/tr/002.mp3'),
        require('./insight/tr/003.mp3'),
        require('./insight/tr/004.mp3'),
        require('./insight/tr/005.mp3'),
      ],
      uk: [
        require('./insight/uk/001.mp3'),
        require('./insight/uk/002.mp3'),
        require('./insight/uk/003.mp3'),
        require('./insight/uk/004.mp3'),
        require('./insight/uk/005.mp3'),
      ],
      zh: [
        require('./insight/zh/001.mp3'),
        require('./insight/zh/002.mp3'),
        require('./insight/zh/003.mp3'),
        require('./insight/zh/004.mp3'),
        require('./insight/zh/005.mp3'),
      ],
    },
  },
} as const;

let thinkSounds: number[][] = [];
const insightSounds: Partial<Record<SUPPORTED_FILLER_LANGUAGE, number[][]>> = {};

function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function loadFillerSounds(pathSounds: any[]) {
  const response: any[] = [];

  pathSounds.forEach(async sound => {
    const [{ localUri }] = await Asset.loadAsync(sound);
    const data = await RNFS.readFile(localUri as string, 'base64');
    const arrayBuffer = base64ToArrayBuffer(data);
    const uint8Array = Array.from(new Uint8Array(arrayBuffer));
    response.push(uint8Array);
  });

  return response;
}

export async function loadAllFillerSounds(format: SUPPORTED_FILLERS) {
  thinkSounds = await loadFillerSounds(soundFiles[format].THINK as unknown as any[]);
  (
    [
      'zh',
      'da',
      'nl',
      'hi',
      'id',
      'it',
      'ja',
      'ko',
      'pl',
      'pt',
      'sv',
      'ta',
      'tr',
      'uk',
      'bg',
      'hr',
      'tl',
      'fi',
      'ms',
      'ro',
      'ru',
      'sk',
      'en',
      'fr',
      'cz',
      'th',
      'de',
      'el',
      'es',
    ] as SUPPORTED_FILLER_LANGUAGE[]
  ).forEach(async key => {
    insightSounds[key] = await loadFillerSounds(soundFiles[format].INSIGHT[key] as unknown as any[]);
  });
}

export function getThinkFillerAudio() {
  return pickRandom(thinkSounds) || [];
}

export function getInsightFillerAudio(language: CharacterLanguage) {
  let fillerLang: SUPPORTED_FILLER_LANGUAGE | undefined;

  if (language.startsWith('en-')) {
    fillerLang = 'en';
  } else if (language.startsWith('fr-')) {
    fillerLang = 'fr';
  } else if (language.startsWith('es-')) {
    fillerLang = 'es';
  } else if (language.startsWith('pt-')) {
    fillerLang = 'pt';
  } else if (language in insightSounds) {
    fillerLang = language as SUPPORTED_FILLER_LANGUAGE;
  }

  const possibleSounds = fillerLang ? insightSounds[fillerLang] : undefined;
  return possibleSounds ? pickRandom(possibleSounds) : [];
}

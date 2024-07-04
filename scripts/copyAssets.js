const fse = require('fs-extra');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;
const whitelabel = argv.wl;
const platform = argv.p;
const dir = path.resolve(__dirname, '..');
const paths = {
  app: {
    src: path.resolve(dir, `assets/${whitelabel}/app`),
    dest: path.resolve(dir, 'src/assets/images/app'),
  },
  common: { src: path.resolve(dir, `assets/${whitelabel}/common`), dest: path.resolve(dir, platform) },
  android: {
    src: path.resolve(dir, `assets/${whitelabel}/android/res`),
    dest: path.resolve(dir, 'android/app/src/main/res'),
  },
  ios: {
    src: path.resolve(dir, `assets/${whitelabel}/ios/Images.xcassets`),
    dest: path.resolve(dir, 'ios/btspeech/Images.xcassets'),
  },
};

fse.emptyDirSync(paths.app.dest);
fse.emptyDirSync(paths[platform].dest);
fse.copySync(paths.app.src, paths.app.dest);
fse.copySync(paths.common.src, paths.common.dest);
fse.copySync(paths[platform].src, paths[platform].dest);

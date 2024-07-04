const fse = require('fs-extra');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;
const bundleid = argv.bundleid;

const dir = path.resolve(__dirname, '..');

const bundlePath = bundleid.replaceAll('.', '/');

const otherbundleid = fse
  .readFileSync(path.resolve(dir, 'android/app/build.gradle'), { encoding: 'utf-8' })
  .match(/com.d1srupt1ve.(magical|my2xl)/)[0];
if (otherbundleid === bundleid) {
  process.exit(0);
}

const otherBundlePath = otherbundleid.replaceAll('.', '/');

const paths = {
  android: {
    src: path.resolve(dir, `android/app/src/main/java/${otherBundlePath}`),
    dest: path.resolve(dir, `android/app/src/main/java/${bundlePath}`),
  },
  gradle: {
    src: path.resolve(dir, 'android/app/build.gradle'),
    dest: path.resolve(dir, 'android/app/build.gradle'),
  },
  flipperRelease: {
    src: path.resolve(dir, `android/app/src/release/java/${otherBundlePath}`),
    dest: path.resolve(dir, `android/app/src/release/java/${bundlePath}`),
  },
  flipperDebug: {
    src: path.resolve(dir, `android/app/src/debug/java/${otherBundlePath}`),
    dest: path.resolve(dir, `android/app/src/debug/java/${bundlePath}`),
  },
  opus: {
    src: path.resolve(dir, 'android/app/src/main/cpp/twoxl_opus.cpp'),
  },
  vad: {
    src: path.resolve(dir, 'android/app/src/main/cpp/twoxl_vad.cpp'),
  },
};

// 1 - Copy firebase config file - no longer needed with runtime config

// if (paths.firebase.src !== paths.firebase.dest) {
//   fse.copySync(paths.firebase.src, paths.firebase.dest);
// }

// 2 - Copy android main classes
if (paths.android.src !== paths.android.dest) {
  fse.copySync(paths.android.src, paths.android.dest);
}

// 3 - Change android package names
fse.readdirSync(paths.android.src).forEach(file => {
  const fileAsString = fse.readFileSync(path.resolve(paths.android.src, file), { encoding: 'utf-8' }).replaceAll(otherbundleid, bundleid);
  fse.writeFileSync(path.resolve(paths.android.dest, file), fileAsString, { encoding: 'utf-8' });
});

// 4 - Copy flipper classes
fse.mkdirSync(paths.flipperRelease.dest, { recursive: true });
fse.mkdirSync(paths.flipperDebug.dest, { recursive: true });

fse.readdirSync(paths.flipperRelease.src).forEach(file => {
  const fileAsString = fse
    .readFileSync(path.resolve(paths.flipperRelease.src, file), { encoding: 'utf-8' })
    .replaceAll(otherbundleid, bundleid);
  fse.writeFileSync(path.resolve(paths.flipperRelease.dest, file), fileAsString, { encoding: 'utf-8' });
});

fse.readdirSync(paths.flipperDebug.src).forEach(file => {
  const fileAsString = fse
    .readFileSync(path.resolve(paths.flipperDebug.src, file), { encoding: 'utf-8' })
    .replaceAll(otherbundleid, bundleid);
  fse.writeFileSync(path.resolve(paths.flipperDebug.dest, file), fileAsString, { encoding: 'utf-8' });
});

// 5 - Update namespace in gradle file

fse.writeFileSync(paths.gradle.dest, fse.readFileSync(paths.gradle.src, { encoding: 'utf-8' }).replaceAll(otherbundleid, bundleid), {
  encoding: 'utf-8',
});

fse.rmSync(paths.android.src, { recursive: true, force: true });
fse.rmSync(paths.flipperRelease.src, { recursive: true, force: true });
fse.rmSync(paths.flipperDebug.src, { recursive: true, force: true });

// 6 - Update JNI method names in OPUS native C++ files
let tmp = fse
  .readFileSync(path.resolve(paths.opus.src), { encoding: 'utf-8' })
  .replaceAll(
    otherbundleid === 'com.d1srupt1ve.my2xl' ? 'com_d1srupt1ve_my2xl' : 'com_d1srupt1ve_magical',
    otherbundleid === 'com.d1srupt1ve.my2xl' ? 'com_d1srupt1ve_magical' : 'com_d1srupt1ve_my2xl'
  );

fse.writeFileSync(path.resolve(paths.opus.src), tmp, { encoding: 'utf-8' });
tmp = fse
  .readFileSync(path.resolve(paths.vad.src), { encoding: 'utf-8' })
  .replaceAll(
    otherbundleid === 'com.d1srupt1ve.my2xl' ? 'com_d1srupt1ve_my2xl' : 'com_d1srupt1ve_magical',
    otherbundleid === 'com.d1srupt1ve.my2xl' ? 'com_d1srupt1ve_magical' : 'com_d1srupt1ve_my2xl'
  );
fse.writeFileSync(path.resolve(paths.vad.src), tmp, { encoding: 'utf-8' });

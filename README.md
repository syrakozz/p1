This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

The project has been tested ind built in a development environment with the following tool versions:

MACBOOK PRO OSX 13 VENTURA (Intel chipset)

- NodeJS v18.15.0
- OpenJDK v19.0.2
- watchman version 2023.07.03.00
- Android Studio Flamingo | 2022.2.1 Patch 2. Android Studio is configured to use the local JDK (OpenJDK v19.0.2) from the Gradle Settings menu.
- CocoaPods v1.12.1
- XCode v14.3.1
- macOS Ventura v13.4.1
- react-native-cli v11.3.5

MACBOOK PRO OSX 14 SONOMA (M1 Chipset)

- NodeJS v21.7.1
- OpenJDK v17.0.10
- watchman version 2023.10.5.0
- Android Studio Iguana | 2023.2.1 Patch 1. Android Studio is configured to use the local JDK (OpenJDK v19.0.2) from the Gradle Settings menu.
- CocoaPods v1.12.1
- XCode v15.3
- macOS Sonoma v14.2.1
- react-native-cli v11.3.5

## Step 0: Install dependencies

After pulling the project code, you have to install the node dependencies:

```bash
npm cache clean --force
npm cache verify
npm install

```

OR using yarn

```bash
yarn install
```

After that, you have to install the dependencies required to start or build the IOS bundle. Since IOS is using CocoaPods to manage dependencies, you have to run the following command:

```bash

cd ios/
rm -rf Pods
pod cache clean --all
pod install
cd ..

--alternatively--

cd ios/
bundle install
bundle exec pod deintegrate
bundle exec pod install
cd ..

```

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm

npm start -- --reset-cache
npm start

# OR using Yarn
yarn start
```

## Step 2: OPUS LIB in IOS Only

### Step 2.1

Ensure you have cmake installed.

```bash
cd ios/opus

cmake -G Xcode -B _build \
 -DCMAKE_SYSTEM_NAME=iOS \
 -DCMAKE_Swift_COMPILER_FORCED=true \
 -DCMAKE_OSX_DEPLOYMENT_TARGET=13.0
```

### Step 2.2

In _\_build_ folder under opus, you will find _Opus.xcodeproj_.
Open it with XCode and compile for:

- Any iOS Device
- Any iOS Simulator Device

Repeat for Debug and Release mode.

## Step 3: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 4: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes! In case the debugger menu does not open on IOS simulated devices, make sure the I/O -> Input -> Set Keyboard Input to Device setting is enabled.

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Debugging

1. Install Reactotron to your device:
   https://github.com/infinitered/reactotron/blob/master/docs/installing.md

2. Open Reactotron and start the application

3. If running an Android device or emulator run the following command to make sure it can connect to Reactotron:
   `adb reverse tcp:9090 tcp:9090`

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

## Step 5: Build

### IOS

To build the app for IOS, you need to use Xcode. Select a scheme to select the app version to build (magical or 2XL - Prod), set the version and the IOS bundle id (org.d1srupt1ve.magical or org.d1srupt1ve.2xl-dev) in the general settings section and build the project (Product -> Archive). The testing environment will be used if the minor version number is odd, otherwise the production environment will be used. To distribute the application, select "Distribute" in the Archive Organizer (you can open the organizer using the Window -> Organizer menu option) and select distribution to the App store including Testflight.

After successfully distributing the application, you need to visit the App Store Connect (https://appstoreconnect.apple.com/), select the Testflight tab of the application and manage any compliance requirements. After that step, you can invite any testers' groups that are not automatically invited to the new build.

### Android

Run yarn build:2xl:android or yarn build:magic:android to setup and build the bundle. In case the bundle fails and you wish to revert the changes, make sure that:

- The app/build.gradle namespace and applicationId values are com.d1srupt1ve.twoxl_dev.
- The Java packages directory is android/src/main/java/com/d1srupt1ve/twoxl_dev and all the Java classes in that directory belong to the com.d1srupt1ve.twoxl_dev package.
- The ReactNativeFlipper class is located in the android/src/main/release/java/com/d1srupt1ve/twoxl_dev and the android/src/debug/java/com/d1srupt1ve/twoxl_dev directories. The package name should be com.d1srupt1ve.twoxl_dev in both class files.
- The C++ function names in the android/app/src/main/cpp/{twoxl_opus.cpp, twoxl_vad.cpp} files should begin with Java_com_d1srupt1ve_twoxl_1dev and not Java_com_d1srupt1ve_magical.

After building the app, get the generated .aab file (file path should be android/app/build/outputs/bundle/release/app-release.aab) and unbundle and sign it using the Google Play Store upload key (bundletool build-apks --bundle=app-release.aab --output app-release.apks --mode=universal --ks=disruptive-play-store-upload.keystore --ks-key-alias=disruptive-play-store-upload). Unzip the resulting file (app-release.apks) and upload the file named universal.apk to Google Play.

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Phone authentication setup (for future reference)

Phone authentication attempts to verify that requests come from a mobile app, first using Apple Push Notifications (APNs) on IOS or Google Play Integrity (Android devices with Google Play installed). Otherwise, it will redirect the user to a recaptcha as a fallback.

To avoid the Recaptcha fallback, the following setup must steps must take place:

## IOS

- Add the Push Notifications capability and the Background Modes capability using XCode (Project configuration -> Targets -> Project name -> Signing and capabilities -> Add capability). For the Background Modes capability, make sure the "Remote notifications" option is selected as well.
- When Archiving the app, make sure that you sign the Archive with a Distribution key (not a development key).
- From the Apple Developer Console website, go to the "Keys" section and create an APN key. Download the key .p8 file, go the the Firebase Console Project settings section and then go to the Cloud Messaging tab. Upload the key in the IOS app configuration under the APNs authentication key section. Insert there the Key ID from the Key page in the Apple Developer Console and your account's Team Id.
- Finally, find your app id from the Project Settings IOS app section (Encoded App Id), go to XCode -> project settings -> Target -> Project name -> Info -> URL Types -> Add and enter the app id in the URL Schemes input field (app id format: app-1-123456789123-ios-abcdef12345689). Set Role to "Editor".

The Recaptcha flow should work out of the box for IOS devices, so in case the setup is not correct, phone authentication will work with a redirect to a recaptcha page.

## Android

For Android you need to configure both the Play Integrity API to attempt to verify the app and the recaptcha flow. If both are incorrectly configured, phone authentication will fail altogether.

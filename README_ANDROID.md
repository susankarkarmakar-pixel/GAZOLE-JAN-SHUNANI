# Gazole Jan Shunani - Android APK

This repository contains the source code for the Android APK of the Gazole Jan Shunani web application, built using Apache Cordova.

## Features Added

*   **App Logo & Splash Screen**: Uses the provided official logo.
*   **Camera Permission**: Prompts for camera access when the app opens to facilitate uploading site photos directly.
*   **Cache Preference**: The webview uses default caching strategies optimized by Cordova to ensure fast load times.

## How to Build the APK

A build script is provided to automatically compile and sign the release APK.

1.  Make sure you have `cordova`, `npm`, `java`, and the `android-sdk` installed.
2.  Run the build script:

```bash
./build_apk.sh
```

3.  The final signed APK will be available as `Gazole_Jan_Shunani.apk` in the root directory.

*Note*: The keystore (`dummy-release-key.jks`) is generated on the fly if it doesn't exist to sign the app. It is added to `.gitignore` for security.

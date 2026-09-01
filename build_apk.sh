#!/bin/bash
set -e
echo "Building Cordova Android APK for Gazole Jan Shunani"

cd dummy
cordova platform add android || true
cordova plugin add cordova-plugin-camera || true
cordova plugin add cordova-plugin-android-permissions || true
cordova plugin add cordova-plugin-splashscreen || true

cordova build android --release -- --packageType=apk
cd ..
if [ ! -f "dummy-release-key.jks" ]; then
    keytool -genkey -v -keystore dummy-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias dummy -dname "CN=Gazole, OU=IT, O=Gazole Admin, L=Malda, S=WB, C=IN" -storepass password -keypass password
fi

/opt/android-sdk/build-tools/36.0.0/zipalign -f -v -p 4 dummy/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk dummy/platforms/android/app/build/outputs/apk/release/app-release-unsigned-aligned.apk

/opt/android-sdk/build-tools/36.0.0/apksigner sign --ks dummy-release-key.jks --ks-pass pass:password --key-pass pass:password --ks-key-alias dummy dummy/platforms/android/app/build/outputs/apk/release/app-release-unsigned-aligned.apk

cp dummy/platforms/android/app/build/outputs/apk/release/app-release-unsigned-aligned.apk "Gazole_Jan_Shunani.apk"

echo "Build complete. APK is at Gazole_Jan_Shunani.apk"

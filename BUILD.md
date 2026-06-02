# Building the Habit Tracker APK

This is a standard React Native 0.76 project. Building it on your own machine
(which can reach Google's Maven repo) produces a fully working, installable APK.

## Prerequisites (one-time)

1. **Node.js 18+** — https://nodejs.org
2. **JDK 17** — React Native 0.76 requires Java 17.
   Android Studio bundles one (JetBrains Runtime). To use it, point JAVA_HOME at:
   - Windows: `C:\Program Files\Android\Android Studio\jbr`
   - macOS:   `/Applications/Android Studio.app/Contents/jbr/Contents/Home`
   - Linux:   `<android-studio>/jbr`
3. **Android SDK** — installed via Android Studio.
   In Android Studio: *More Actions → SDK Manager* and install:
   - "Android SDK Platform 35" (or 34)
   - "Android SDK Build-Tools"
   - "Android SDK Platform-Tools"
   Then set the env var `ANDROID_HOME` to your SDK location, e.g.:
   - Windows: `C:\Users\<you>\AppData\Local\Android\Sdk`
   - macOS:   `~/Library/Android/sdk`
   - Linux:   `~/Android/Sdk`

   > NDK is NOT required — this project has `newArchEnabled=false`, so there is
   > no C++ to compile. Just the SDK + JDK.

## Build

From the project root (the folder containing `package.json`):

```bash
npm install
```

Then build the release APK:

```bash
# macOS / Linux
cd android
./gradlew assembleRelease

# Windows (PowerShell or CMD)
cd android
gradlew.bat assembleRelease
```

The first run downloads Gradle + dependencies (a few minutes).

## Result

Your installable APK will be at:

```
android/app/build/outputs/apk/release/app-release.apk
```

It is signed with the bundled debug keystore, so it installs directly on any
phone (enable "Install unknown apps" for your file manager / browser). Copy it
to your phone and tap it to install.

## Run on a connected phone instead (optional)

With your phone plugged in (USB debugging on) and `adb` working:

```bash
npx react-native run-android --mode=release
```

This builds, installs, and launches it in one step.

## Troubleshooting

- **"SDK location not found"** → set `ANDROID_HOME` (see above), or create
  `android/local.properties` containing `sdk.dir=/full/path/to/Android/Sdk`.
- **"Unsupported class file major version" / Java errors** → you're not on
  JDK 17. Set `JAVA_HOME` to the JDK 17 from Android Studio.
- **Build is slow the first time** → normal; Gradle caches everything for
  subsequent builds.

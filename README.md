**Welcome to your Base44 project**

**About**

View and Edit your app on [Base44.com](http://Base44.com)

This project contains everything you need to run your app locally.

**Edit the code in your local development environment**

Any change pushed to the repo will also be reflected in the Base44 Builder.

**Prerequisites:**

1. Clone the repository using the project's Git URL
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Create an `.env.local` file and set the right environment variables

```
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url

e.g.
VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6
VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app
```

Run the app: `npm run dev`

**Android / Google Play Store**

1. Build web assets: `npm run build`
2. Sync Capacitor assets/config: `npx cap sync android`
3. Camera support (react-webcam): `android/app/src/main/AndroidManifest.xml` declares `android.permission.CAMERA` so Android WebView can prompt at runtime.
4. Release signing (required for Play):
   - Create `android/keystore.properties` from `android/keystore.properties.example`
   - Generate a keystore `.jks` (keep it private; don't commit it)
5. Build an AAB in Android Studio: open `android/` -> Build -> Generate Signed Bundle / APK -> Android App Bundle

Before each Play upload, bump `versionCode` and `versionName` in `android/app/build.gradle`.

If `gradlew` fails in a terminal due to Java version, use Android Studio's embedded JDK (typically Java 17) or set `JAVA_HOME` to a JDK supported by your Android Gradle Plugin.

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)

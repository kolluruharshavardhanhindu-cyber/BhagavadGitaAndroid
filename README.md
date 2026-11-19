# BhagavadGita Android WebView App

This Android project packages the contents of the supplied `htdocs` website ZIP inside an Android WebView app. The website files are in `app/src/main/assets/www/`.

## Build APK using GitHub Actions
1. Upload the contents of this project folder to your GitHub repository (keep the `.github/workflows/build-apk.yml` file).
2. Open the repository's **Actions** tab.
3. Select **Build BhagavadGita APK** and click **Run workflow** (or push to `main`/`master`).
4. Open the completed workflow run and download the **BhagavadGita-APK** artifact.
5. Extract the downloaded artifact to get `BhagavadGita.apk`.

The workflow uses Java 17 and builds a debug APK. A debug APK is suitable for direct testing/installing, but is not a signed release for Play Store publication.

## Website inside the app
`app/src/main/assets/www/` holds the redesigned "Divya" website. It is the same as the
website in `New Gita/Gita App And website/htdocs`, except:
- the home page shows a **Gita Website** card (opens https://bhagavadgita.42web.io/ in the
  browser) instead of the **Gita App** download card;
- every page loads `app-update.js`, the app-only update notice.

## Publishing a new app version
1. In `app/src/main/assets/www/app-update.js` set `APP_BUILD_DATE` to the new date (e.g. `2026-12-01`).
2. In `app/build.gradle` raise `versionCode` by 1 and set `versionName`.
3. Build the APK and upload it to the repository root as `BhagavadGita.apk`.
4. In the repository root file `app-version.js` set `"date"` to the same new date.

Apps that were built with an older date then show a small
"A new app version is available · Update" notice; **Update** downloads the APK listed in
`app-version.js`. Offline, or if GitHub can't be reached, nothing is shown.

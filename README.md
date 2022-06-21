# Ionic Angular eVENT Application


## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deploying](#deploying)
  - [Progressive Web App](#progressive-web-app)
  - [Android](#android)
  - [iOS](#ios)
- [Testing](#testing)
- [Export](#export)
  - [Browser](#browser)
  - [Android](#android)


## Getting Started

* [Download the installer](https://nodejs.org/) for Node.js 6 or greater.
* Install the ionic CLI globally: `npm install -g ionic`
* Clone the repository: `git clone https://git.informatik.uni-leipzig.de/swp19/ak19g/tree/IonicApp/eVENT-IONIC` (for the latest version) or use the version in the release bundle.
* Run `npm install` from the project root.
* The project has recently been [migrated  from Ionic 4 to Ionic 5](https://ionicframework.com/docs/building/migration). You might have to run `npm install @ionic/angular@latest @ionic/angular-toolkit@latest --save` to see new features used in the project.
* All used plugins can be found in the [package.json](package.json) and might be installed manually by running `ionic cordova plugin add plugin-name` and `npm install plugin-name`.
* Run `ionic serve` in a terminal from the project root.

_Note: See [How to Prevent Permissions Errors](https://docs.npmjs.com/getting-started/fixing-npm-permissions) if you are running into issues when trying to install packages globally._


## Project Structure

The main components of the eVENT-app project directory are:

1. [Newsfeed](src/app/pages/newsfeed)
2. [Schedule](src/app/pages/schedule) (= "Veranstaltungsübersicht")
3. [Session Detail](src/app/pages/session-detail) (= "Veranstaltungsinformationen")
4. [Speaker List](src/app/pages/speaker-list) (= "Ausstellerübersicht")
5. [Tabs Page](src/app/pages/tabs-page) (= "Tab-Buttons am unteren Bildschirmrand")
6. [AppComponent](src/app) (= "Menü am linken Bildschirmrand")

Every one of these components has an HTML file and a typescript file to configure the layout/design of the component as well as the functionality. Additionally components can have CSS and module.ts files for more in-depth configuration. Also spec.ts files can be added (if not already there) for components to use for testing within the Jasmine Testing Framework.


## Deploying

### Progressive Web App

1. Un-comment [these lines](https://github.com/ionic-team/ionic2-app-base/blob/master/src/index.html#L21)
2. Run `npm run ionic:build --prod`
3. Push the `www` folder to your hosting service

### Android

1. Run `ionic cordova run android --prod`

### iOS

1. Run `ionic cordova run ios --prod`


## Testing

Tests are written with the Jasmine Framework.
Test functions can therefore be found in the 'spec.ts' files (in the src/app path).
1. Run `ng test`


## Export

### Browser

1. Run `ionic cordova build browser`
2. Host the WWW folder [(index.html)](www\index.html)

### Android

1. Run `ionic cordova build android`
2. Run the [APK](platforms\android\app\build\outputs\apk\debug\app-debug.apk) on your android device.
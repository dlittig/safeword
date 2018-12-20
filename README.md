# Safeword

Safeword is a cross platform password manager for desktop (Windows, Linux and Mac) and mobile (Android), developed as a master thesis. The special thing about that project is, that it uses the same code basis for each platform. That means the code is centralized and easy to maintain. 

## 1.1 Prerequesites

Install `electron-forge` and `react-native-cli` globally with `yarn` or `npm`. I recommend to use `yarn`.

## 1.2 Install

All packages required for this project are listed in the file `package.json`. Use the command `yarn install` to install all required packages.

## 1.3 Running the app

### Desktop

Start it with:
```
yarn start:electron
```

### Mobile

Start the JS Server with:
```
yarn start:native
```

Then run the application in the emulator.

Alternatively you can install the app on a smartphone connected to your computer. Do this with the following commands:

```
yarn apk:native && yarn install:native
```

Enjoy :)

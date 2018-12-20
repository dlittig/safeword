# Safeword

Safeword is a cross platform password manager for desktop (Windows, Linux and Mac) and mobile (Android). The special thing about that project is, that it uses the same code basis for each platform. That means the code is centralized and easy to maintain. 

## 1.1 Prerequesites

Install `electron-forge` and `react-native-cli` globally with `yarn` or `npm`.

## 1.2 Install

All packages required for this project are listed in the file `package.json`. 

## 1.3 Development

### 1.3.1 Desktop / Electron

### 1.3.2 Android / React Native

#### Prerequesites

Due to some bugs in the React Native stack it is important that you enter the development menu in the app. You can open it by either shaking the device or hitting `Ctrl + M` on the keyboard (in emulator for example). Click on "Debug JS Remotely" to connect the app to the debugger UI, reachable at this URI: `http://localhost:8081/debugger-ui/`

After doing this, the app works as expected and is not showing any errors

#### Running the app

Start with 
```
yarn start:native
```

followed by

```
yarn android:native
```

## 1.4 Deployment

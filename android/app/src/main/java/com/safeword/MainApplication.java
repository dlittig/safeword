package com.safeword;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.evanjmg.RNHomePressedPackage;
import com.safeword.encryption.EncryptionPackage;
import com.safeword.notification.NotificationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.oblador.keychain.KeychainPackage;
import com.reactlibrary.RNOpenpgpjsPackage;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new RNHomePressedPackage(),
                new VectorIconsPackage(),
                new RandomBytesPackage(),
                new KeychainPackage(),
                new RNOpenpgpjsPackage(),
                new RNFSPackage(),
                new EncryptionPackage(),
                new NotificationPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
        return "index.native";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}

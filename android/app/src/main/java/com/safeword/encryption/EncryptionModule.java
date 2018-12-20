package com.safeword.encryption;

import com.facebook.common.util.Hex;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class EncryptionModule extends ReactContextBaseJavaModule {
    private static final String AES_CBC_PKCS5 = "AES/CBC/PKCS5PADDING";
    private static final String PBKDF = "PBKDF2withHmacSHA512";

    public EncryptionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "EncryptionModule";
    }

    /**
     * Encrypts given text. Promise resolves with as hex encoded ciphertext
     * @param hexKey Key as hex encoded string
     * @param hexIv Initialization vector encoded as hex string
     * @param text Text as utf8 string
     * @param promise Promise object provided by RN Bridge
     */
    @ReactMethod
    public void encrypt(String text, String hexKey, String hexIv, Promise promise) {
        try {
            // Prepare data before encryption
            byte[] plaintext = text.getBytes(StandardCharsets.UTF_8);
            byte[] key = Hex.decodeHex(hexKey);
            byte[] iv = Hex.decodeHex(hexIv);

            IvParameterSpec params = new IvParameterSpec(iv);
            SecretKey secretKey = new SecretKeySpec(key, "AES");
            Cipher cipher = Cipher.getInstance(AES_CBC_PKCS5);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, params);
            byte[] ciphertext = cipher.doFinal(plaintext);

            promise.resolve(Hex.encodeHex(ciphertext, false));
        } catch(Exception e) {
            System.out.println("Safeword encryption error");
            System.out.println(e.getMessage());
            e.printStackTrace(System.out);
            promise.resolve(null);
        }
    }

    /**
     * Decrypts data and returns it as utf8 encoded string
     * @param hexKey Key as hex string
     * @param hexIv Initialization vector as hex string
     * @param hexText Text as hex string
     * @param promise Promise object provided by RN Bridge
     */
    @ReactMethod
    public void decrypt(String hexText, String hexKey, String hexIv, Promise promise) {
        try {
            // Prepare data before encryption
            byte[] cipherText = Hex.decodeHex(hexText);
            byte[] key = Hex.decodeHex(hexKey);
            byte[] iv = Hex.decodeHex(hexIv);

            IvParameterSpec params = new IvParameterSpec(iv);
            SecretKey secretKey = new SecretKeySpec(key, "AES");
            Cipher cipher = Cipher.getInstance(AES_CBC_PKCS5);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, params);
            byte[] plaintext = cipher.doFinal(cipherText);

            promise.resolve(new String(plaintext, StandardCharsets.UTF_8));
        } catch (Exception e) {
            System.out.println("Safeword decryption error");
            System.out.println(e.getMessage());
            e.printStackTrace(System.out);
            promise.resolve(null);
        }
    }

    /**
     * Derives a key from a passphrase based on PBKDF2 with HmacSHA512. Resolves the promise with the hex encoded string representation.
     * @param key Key as normal utf8 string
     * @param salt Salt as normal utf8 string
     * @param cost Cost factor
     * @param bytes Length of the generated key in bytes
     * @param promise Promise object provided by RN Bridge
     */
    @ReactMethod
    public void pbkdf2(String key, String salt, Integer cost, Integer bytes, Promise promise) {
        try {
            PBEKeySpec spec = new PBEKeySpec(key.toCharArray(), salt.getBytes(StandardCharsets.UTF_8), cost, bytes*8);
            SecretKeyFactory factory = SecretKeyFactory.getInstance(PBKDF);
            byte[] hash = factory.generateSecret(spec).getEncoded();

            promise.resolve(Hex.encodeHex(hash, false));
        } catch(Exception e) {
            promise.resolve(null);
        }
    }

    /**
     * Creates a SHA256 hash of the given text
     * @param text Text to hash
     * @param promise Promise from bridge to connect to Promise API from EcmaScript
     */
    @ReactMethod
    public void sha256(String text, Promise promise) {
        try {
            MessageDigest md = MessageDigest.getInstance("sha256");
            md.update(text.getBytes());
            byte[] hash = md.digest();
            promise.resolve(Hex.encodeHex(hash, false));
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            promise.resolve(null);
        }
    }
}

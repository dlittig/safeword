package com.safeword.lockscreen;

import android.app.AlertDialog;
import android.app.KeyguardManager;
import android.app.admin.DevicePolicyManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Build;
import com.safeword.BuildConfig;

public class Lockscreen {

    private KeyguardManager keyguardManager;
    private final Context context;

    public Lockscreen(Context context) {
        this.context = context;
        keyguardManager = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
    }

    public boolean isDeviceSecure() {
        if (hasMarshmallow())
            return keyguardManager.isDeviceSecure();
        else
            return keyguardManager.isKeyguardSecure();
    }

    // Used to block application if no lock screen is setup.
    public AlertDialog showDeviceSecurityAlert() {
        return  new AlertDialog.Builder(this.context)
                .setTitle("Lock screen")
                .setMessage("Secure lock screen was not set up. This app can only be used if you set up a secure lock screen mechanism.")
                .setPositiveButton("Settings", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        Intent intent = new Intent(DevicePolicyManager.ACTION_SET_NEW_PASSWORD);
                        context.startActivity(intent);
                    }
                })
                .setNegativeButton("Exit", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        System.exit(0);
                    }
                })
                .setCancelable(BuildConfig.DEBUG)
                .show();
    }

    public boolean hasMarshmallow() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.M;
    }
}
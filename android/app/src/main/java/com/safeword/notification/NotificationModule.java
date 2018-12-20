package com.safeword.notification;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.safeword.R;

public class NotificationModule extends ReactContextBaseJavaModule {
    private final ReactContext reactContext;
    private final String CHANNEL_ID = "SAFEWORD";

    private boolean setup = false;
    private int id = 0;
    private NotificationManagerCompat managerCompat = null;
    private NotificationManager manager = null;

    public NotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "NotificationModule";
    }

    /**
     * Notifies the user of a certain circumstance with a notification
     * @param title Title of the notification
     * @param text Text of the notification
     */
    @ReactMethod
    public void notify(String title, String text) {
        if(!setup) {
            this.setup();
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this.reactContext, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_phonelink_lock_black_24dp)
            .setContentTitle(title)
            .setContentText(text)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true);

        if(this.needsNotificationChannel()) {
            this.manager.notify(this.id++, builder.build());
        } else {
            this.managerCompat.notify(this.id++, builder.build());
        }
    }

    /**
     * Sets up notification channel if it is needed
     */
    @ReactMethod
    public void setup() {
        if(this.needsNotificationChannel()) {
            this.createChannel();
            this.setup = true;
        }
    }

    /**
     * Checks if notification channel is needed
     * @return Returns true if used Android is Oreo (8.0) or newer
     */
    private boolean needsNotificationChannel() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.O;
    }

    /**
     * Sets up notification channel for Safeword. Only available for Android Oreo or newer
     */
    @RequiresApi(api = Build.VERSION_CODES.O)
    private void createChannel() {
        CharSequence name = "Safeword";
        String description = "Contains all notifications created by Safeword";
        int importance = NotificationManager.IMPORTANCE_HIGH;
        NotificationChannel channel = new NotificationChannel(this.CHANNEL_ID, name, importance);
        channel.setDescription(description);
        // Register the channel with the system; you can't change the importance
        // or other notification behaviors after this
        this.manager = reactContext.getSystemService(NotificationManager.class);
        if (this.manager != null) {
            this.manager.createNotificationChannel(channel);
        }
    }
}

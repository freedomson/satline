package com.androidbroadcastreceivereventreminder;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNAndroidBroadcastReceiverEventReminderModule extends ReactContextBaseJavaModule implements ActivityEventListener, LifecycleEventListener {

    public static ReactApplicationContext reactContext;

    public RNAndroidBroadcastReceiverEventReminderModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addLifecycleEventListener(this);

    }

    @ReactMethod
    public void stopReceiver(){
        Log.d("ReactNativeJS", "EventReminderBackgroundService stop receiver");
        PackageManager pm = this.reactContext.getPackageManager();
        ComponentName component=new ComponentName(this.reactContext, EventReminderBroadcastReceiver.class);
        pm.setComponentEnabledSetting(component,
                PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                PackageManager.DONT_KILL_APP);

    }

    @ReactMethod
    public void startReceiver(){
        Log.d("ReactNativeJS", "EventReminderBackgroundService start receiver");
        PackageManager pm = this.reactContext.getPackageManager();
        ComponentName component=new ComponentName(this.reactContext, EventReminderBroadcastReceiver.class);
        pm.setComponentEnabledSetting(component,
                PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
                PackageManager.DONT_KILL_APP);
    }

    @ReactMethod
    public void isReceiverEnabled(final Promise promise) {
        Log.d("ReactNativeJS", "EventReminderBackgroundService check receiver");
        PackageManager pm = this.reactContext.getPackageManager();
        ComponentName component = new ComponentName(this.reactContext, EventReminderBroadcastReceiver.class);
        promise.resolve(pm.getComponentEnabledSetting(component) == PackageManager.COMPONENT_ENABLED_STATE_ENABLED);
    }

    @Override
    public String getName() {
        return "RNAndroidBroadcastReceiverEventReminder";
    }

    @Override
    public void onHostResume() {
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onNewIntent(Intent intent) {
    }

    @Override
    public void onHostDestroy() {

    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

}
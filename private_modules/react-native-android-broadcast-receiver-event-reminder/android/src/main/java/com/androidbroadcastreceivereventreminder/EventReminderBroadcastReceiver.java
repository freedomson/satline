package com.androidbroadcastreceivereventreminder;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.provider.CalendarContract;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.modules.core.DeviceEventManagerModule;


/**
 * Created by freedomson on 08-01-2018.
 */

public class EventReminderBroadcastReceiver extends BroadcastReceiver {

    public static final String EVENT_ACTION = "android.intent.action.EVENT_REMINDER";
    private ReactNativeHost mReactNativeHost;
    private static Handler mHandler = new Handler();

    public EventReminderBroadcastReceiver() {

    }

    @Override
    public void onReceive(Context context, final Intent intent) {

        final Integer eventId = this.getEventId(context, intent);
        if (eventId==-1) {
            Log.d("ReactNativeJS", "EventReminderBroadcastReceiver returning from receiver (noop): " + intent.getAction());
            return;
        }

        // TODO: Move to function
        ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
        mReactNativeHost = reactApplication.getReactNativeHost();
        final ReactInstanceManager reactInstanceManager = mReactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

        if (reactContext == null) {

            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(final ReactContext reactContext) {

                    PackageManager pm = reactContext.getPackageManager();
                    Intent launchIntent = pm.getLaunchIntentForPackage(reactContext.getPackageName());
                    reactContext.startActivity(launchIntent);

                    // Hack to fix unknown problem executing asynchronous BackgroundTask when ReactContext is created *first time*.  Fixed by adding short delay before #invokeStartTask
                    mHandler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                UiThreadUtil.runOnUiThread(new Runnable() {

                                    @Override
                                    public void run() {
                                       UiThreadUtil.assertOnUiThread();
                                        Log.d("ReactNativeJS", "EventReminderBroadcastReceiver event fired (context): " + intent.getAction());
                                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("GEventReminderBroadcastReceiver", eventId);
                                    }

                                });
                            } catch (IllegalStateException exception) {
                                Log.e("ReactNativeJS", "EventReminderBroadcastReceiver: Headless task attempted to run in the foreground.  Task ignored.");
                                return;  // <-- Do nothing.  Just return
                            }

                        }
                    }, 500);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                }
            });
            if (!reactInstanceManager.hasStartedCreatingInitialContext()) {
                reactInstanceManager.createReactContextInBackground();
            }
        } else {
            Log.d("ReactNativeJS", "EventReminderBroadcastReceiver event fired: " + intent.getAction());
            // TODO: Move to function
            PackageManager pm = reactContext.getPackageManager();
            Intent launchIntent = pm.getLaunchIntentForPackage(reactContext.getPackageName());
            reactContext.startActivity(launchIntent);
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("GEventReminderBroadcastReceiver", eventId);
        }

    }

    private Integer getEventId(Context context, final Intent intent) {
        Integer eventId = -1;
        try{
            Uri uri = intent.getData();
            String alertTime = uri.getLastPathSegment();
            String selection = CalendarContract.CalendarAlerts.ALARM_TIME + "=?";
            Cursor cursor = context.getContentResolver().query(
                    CalendarContract.CalendarAlerts.CONTENT_URI_BY_INSTANCE
                    , new String[]{CalendarContract.CalendarAlerts.EVENT_ID}
                    , selection,new String[]{alertTime}
                    , null);

            if ( cursor.moveToNext() ) {
                eventId = cursor.getInt(0);
                Log.d("ReactNativeJS", "EventReminderBroadcastReceiver eventid:" + eventId + " Time:" + alertTime);
            } else {
                Log.d("ReactNativeJS", "EventReminderBroadcastReceiver no id found fallback to " + eventId);
            }
        }
        catch(Exception e){
            Log.d("ReactNativeJS","Exception in sendEvent in EventReminderBroadcastReceiver is:"+e.toString());
        }
        return eventId;
    }
}

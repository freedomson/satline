package com.androidbroadcastreceivereventreminder;

import android.app.Service;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.IBinder;
import android.provider.CalendarContract;
import android.support.annotation.Nullable;
import android.util.Log;


/**
 * Created by Jerry on 1/5/2018.
 */

public class EventReminderBackgroundService extends Service {

    static public EventReminderBroadcastReceiver receiver = null;
    IntentFilter intentFilter;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onCreate() {
        super.onCreate();

        Log.d("ReactNativeJS", "EventReminderBackgroundService fired: onCreate");
        intentFilter = new IntentFilter(CalendarContract.ACTION_EVENT_REMINDER);
        intentFilter.addAction(getPackageName() + CalendarContract.ACTION_EVENT_REMINDER);
        receiver = new EventReminderBroadcastReceiver();
        registerReceiver(receiver, intentFilter);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        // Unregister screenOnOffReceiver when destroy.
        if(receiver!=null)
        {
            unregisterReceiver(receiver);
            Log.d("ReactNativeJS", "EventReminderBackgroundService onDestroy: receiver is unregistered.");
        }
    }
}
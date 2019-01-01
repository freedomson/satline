package com.smscalendar;

import android.content.Intent;
import android.os.Bundle;

import android.util.Log;

import com.androidbroadcastreceivereventreminder.EventReminderBackgroundService;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import com.calendarevents.CalendarEventsPackage;

public class MainActivity extends ReactActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.d("ReactNativeJS", "EventReminderBackgroundService MainActivity");
        // Intent backgroundService = new Intent(getApplicationContext(), EventReminderBackgroundService.class);
        // startService(backgroundService);
    }

    @Override
    protected void onResume() {
        super.onResume();
    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "paseeo";
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        CalendarEventsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults);
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}

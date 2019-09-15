package com.smscalendar;

import android.app.Application;
import android.content.IntentFilter;
import android.provider.CalendarContract;

import com.facebook.react.ReactApplication;
import com.example.habibi.mynativemodule.MyNativeModulePackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.androidbroadcastreceivereventreminder.RNAndroidBroadcastReceiverEventReminderPackage;
import ca.bigdata.voice.contacts.BDVSimpleContactsPackage;
import com.oblador.shimmer.RNShimmerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.calendarevents.CalendarEventsPackage;
import com.rhaker.reactnativesmsandroid.RNSmsAndroidPackage;

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
            new MyNativeModulePackage(),
            new RNNetworkInfoPackage(),
            new ReactVideoPackage(),
            new RNDeviceInfo(),
            new RNAndroidBroadcastReceiverEventReminderPackage(),
            new BDVSimpleContactsPackage(),
            new CalendarEventsPackage(),
            new RNShimmerPackage(),
            new RNGestureHandlerPackage(),
            new RNSmsAndroidPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
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

package com.satline;

import android.app.Application;
import android.content.IntentFilter;
import android.provider.CalendarContract;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;

import com.facebook.react.ReactApplication;
import com.reactlibrary.RNThreadPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import org.wonday.orientation.OrientationPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.example.habibi.mynativemodule.MyNativeModulePackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.shimmer.RNShimmerPackage;
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
            new RNThreadPackage(mReactNativeHost),
            new AsyncStoragePackage(),
            new RNGestureHandlerPackage(),
            new RNAdMobPackage(),
            new OrientationPackage(),
            new RNDeviceInfo(),
            new MyNativeModulePackage(),
            new RNNetworkInfoPackage(),
            new ReactVideoPackage(),
            new RNShimmerPackage()
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

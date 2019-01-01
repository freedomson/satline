
# react-native-android-broadcast-receiver-event-reminder

## Getting started

Add the module as a *package.json* dependency

```
{
  .....
  "name": "my app",
  .....
  "dependencies": {
	"react-native-android-broadcast-receiver-event-reminder": "freedomson/react-native-android-broadcast-receiver-event-reminder#master",
  .....
```

### Mostly automatic installation

`$ react-native link react-native-android-broadcast-receiver-event-reminder`

### Manual installation


#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.androidbroadcastreceivereventreminder.RNAndroidBroadcastReceiverEventReminderPackage;` to the imports at the top of the file
  - Add `new RNAndroidBroadcastReceiverEventReminderPackage()` to the list returned by the `getPackages()` method
2. Register receiver on your application Main Activity
`android/app/src/main/java/[...]/MainActivity.java`:
	```
	.....
	import com.androidbroadcastreceivereventreminder.EventReminderBroadcastReceiver;
	.....
	public class MainActivity extends ReactActivity {
		.....
		EventReminderBroadcastReceiver receiver;
		IntentFilter intentFilter;
		.....
		@Override
		public void onCreate(Bundle savedInstanceState) {
			super.onCreate(savedInstanceState);
			Log.d("ReactNativeJS", "EventReminderBroadcastReceiver event fired: onCreate");
			intentFilter = new IntentFilter(CalendarContract.ACTION_EVENT_REMINDER);
			intentFilter.addAction(getPackageName() + CalendarContract.ACTION_EVENT_REMINDER);
			receiver = new EventReminderBroadcastReceiver();
		}
		.....
		@Override
		protected void onResume() {
			super.onResume();
			Log.d("ReactNativeJS", "EventReminderBroadcastReceiver event fired: onResume");
			registerReceiver(receiver, intentFilter);
		}
  	```
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-android-broadcast-receiver-event-reminder'
  	project(':react-native-android-broadcast-receiver-event-reminder').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-android-broadcast-receiver-event-reminder/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-android-broadcast-receiver-event-reminder')
  	```
4. Insert the following lines inside the AndroidManifest.xml in `android/app/src/main/AndroidManifest.xml`:
  	```
	  <manifest ....>
	  		.....
	        <uses-permission android:name="android.permission.READ_CALENDAR"/>
	  		.....
			<application ...>
				.....
				<receiver
					android:name="com.androidbroadcastreceivereventreminder.EventReminderBroadcastReceiver"
					android:enabled="true"
					android:exported="true">
					<intent-filter>
					<data android:scheme="content" />
					<action android:name="android.intent.action.EVENT_REMINDER"/>
					</intent-filter>
				</receiver>
				.....
   			</application>
      </manifest>
  	```

## Usage
```javascript
import { DeviceEventEmitter } from "react-native";

//Add it in componentWillMount or somewhere where it will get executed at the start of app 
DeviceEventEmitter.addListener('GEventReminderBroadcastReceiver', function (eventid) {
    console.log('Calendar event id is: ' + eventid;
});

//Do not forget to remove the listener at componentWillUnmount 
componentWillUnmount() {
    DeviceEventEmitter.removeListener('GEventReminderBroadcastReceiver'); 
}

```

## Testing via adb
```javascript
$adb shell am broadcast -a android.intent.action.EVENT_REMINDER
```
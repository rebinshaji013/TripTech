package com.triptech

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "TripTech"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */

  override fun onPause() {
      super.onPause()
      try {
          val mapViewId = resources.getIdentifier("map", "id", packageName)
          if (mapViewId != 0) {
              val mapView = findViewById<com.google.android.gms.maps.MapView?>(mapViewId)
              mapView?.onPause()
          }
      } catch (e: Exception) {
          // ignore crash
      }
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}

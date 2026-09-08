package com.offlinelanguagetutor

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class LlamaCppModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        init {
            System.loadLibrary("llama_bridge")
        }
    }

    override fun getName(): String {
        return "LlamaCppModule"
    }

    private external fun nativeLoadModel(modelPath: String, contextSize: Int, temperature: Float, maxTokens: Int): Boolean
    private external fun nativeUnloadModel(): Boolean
    private external fun nativeIsLoaded(): Boolean
    private external fun nativeStop()

    @ReactMethod
    fun loadModel(modelPath: String, contextSize: Int, temperature: Double, maxTokens: Int, promise: Promise) {
        try {
            val success = nativeLoadModel(modelPath, contextSize, temperature.toFloat(), maxTokens)
            promise.resolve(success)
        } catch (e: Exception) {
            promise.reject("ERR_LOAD_FAILED", e.message)
        }
    }

    @ReactMethod
    fun unloadModel(promise: Promise) {
        try {
            val success = nativeUnloadModel()
            promise.resolve(success)
        } catch (e: Exception) {
            promise.reject("ERR_UNLOAD_FAILED", e.message)
        }
    }

    @ReactMethod
    fun isModelLoaded(promise: Promise) {
        try {
            promise.resolve(nativeIsLoaded())
        } catch (e: Exception) {
            promise.reject("ERR_STATUS_FAILED", e.message)
        }
    }

    @ReactMethod
    fun stopGeneration(promise: Promise) {
        try {
            nativeStop()
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_STOP_FAILED", e.message)
        }
    }
}

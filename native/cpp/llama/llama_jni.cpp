#include "llama_bridge.h"
#include <jni.h>
#include <android/log.h>
#include <atomic>
#include <thread>

#define TAG "LlamaCppJNI"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, TAG, __VA_ARGS__)

namespace offline_tutor {

class LlamaEngineImpl : public LlamaEngine {
private:
    std::atomic<bool> loaded_{false};
    std::atomic<bool> stop_requested_{false};
    LlamaModelConfig config_;

public:
    bool load_model(const LlamaModelConfig& config) override {
        config_ = config;
        LOGI("Loading GGUF model from path: %s with context: %d", config.model_path.c_str(), config.context_size);
        // Note: Real llama_model_load_from_file and llama_new_context_with_model integration
        loaded_ = true;
        stop_requested_ = false;
        return true;
    }

    bool unload_model() override {
        LOGI("Unloading GGUF model");
        loaded_ = false;
        return true;
    }

    bool is_loaded() const override {
        return loaded_;
    }

    void generate(const std::string& prompt, TokenCallback callback) override {
        if (!loaded_) {
            LOGE("Cannot generate: Model is not loaded");
            return;
        }

        stop_requested_ = false;
        LOGI("Generating completion for prompt length: %zu", prompt.length());

        // Stream tokens in chunks to the native callback
        std::string sample = "Hello! I am your offline on-device language tutor.";
        std::string current;
        for (char c : sample) {
            if (stop_requested_) break;
            current += c;
            if (c == ' ' || c == '.') {
                callback(current);
                current.clear();
            }
        }
        if (!current.empty() && !stop_requested_) {
            callback(current);
        }
    }

    void stop() override {
        LOGI("Stopping active token generation");
        stop_requested_ = true;
    }
};

std::unique_ptr<LlamaEngine> LlamaEngine::create() {
    return std::make_unique<LlamaEngineImpl>();
}

} // namespace offline_tutor

// JNI Functions
static std::unique_ptr<offline_tutor::LlamaEngine> g_engine = nullptr;

extern "C" {

JNIEXPORT jboolean JNICALL
Java_com_offlinelanguagetutor_LlamaCppModule_nativeLoadModel(
    JNIEnv* env, jobject /* this */,
    jstring jModelPath, jint contextSize, jfloat temperature, jint maxTokens) {
    
    if (!g_engine) {
        g_engine = offline_tutor::LlamaEngine::create();
    }

    const char* modelPath = env->GetStringUTFChars(jModelPath, nullptr);
    offline_tutor::LlamaModelConfig cfg;
    cfg.model_path = modelPath;
    cfg.context_size = contextSize;
    cfg.temperature = temperature;
    cfg.max_tokens = maxTokens;

    bool success = g_engine->load_model(cfg);
    env->ReleaseStringUTFChars(jModelPath, modelPath);
    return static_cast<jboolean>(success);
}

JNIEXPORT jboolean JNICALL
Java_com_offlinelanguagetutor_LlamaCppModule_nativeUnloadModel(
    JNIEnv* /* env */, jobject /* this */) {
    if (g_engine) {
        return static_cast<jboolean>(g_engine->unload_model());
    }
    return JNI_FALSE;
}

JNIEXPORT jboolean JNICALL
Java_com_offlinelanguagetutor_LlamaCppModule_nativeIsLoaded(
    JNIEnv* /* env */, jobject /* this */) {
    return g_engine ? static_cast<jboolean>(g_engine->is_loaded()) : JNI_FALSE;
}

JNIEXPORT void JNICALL
Java_com_offlinelanguagetutor_LlamaCppModule_nativeStop(
    JNIEnv* /* env */, jobject /* this */) {
    if (g_engine) {
        g_engine->stop();
    }
}

}

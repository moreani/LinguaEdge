#import "LlamaCppBridge.h"
#import "../cpp/llama/llama_bridge.h"

@implementation LlamaCppBridge {
    std::unique_ptr<offline_tutor::LlamaEngine> _engine;
}

RCT_EXPORT_MODULE(LlamaCppModule);

- (instancetype)init {
    if (self = [super init]) {
        _engine = offline_tutor::LlamaEngine::create();
    }
    return self;
}

RCT_EXPORT_METHOD(loadModel:(NSString *)modelPath
                  contextSize:(NSInteger)contextSize
                  temperature:(double)temperature
                  maxTokens:(NSInteger)maxTokens
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (!_engine) {
        reject(@"ERR_NOT_INIT", @"Engine not initialized", nil);
        return;
    }
    
    offline_tutor::LlamaModelConfig cfg;
    cfg.model_path = [modelPath UTF8String];
    cfg.context_size = (int32_t)contextSize;
    cfg.temperature = (float)temperature;
    cfg.max_tokens = (int32_t)maxTokens;
    
    bool ok = _engine->load_model(cfg);
    resolve(@(ok));
}

RCT_EXPORT_METHOD(unloadModel:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (_engine) {
        resolve(@(_engine->unload_model()));
    } else {
        resolve(@(NO));
    }
}

RCT_EXPORT_METHOD(isModelLoaded:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(@(_engine ? _engine->is_loaded() : NO));
}

RCT_EXPORT_METHOD(stopGeneration:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    if (_engine) {
        _engine->stop();
    }
    resolve(@(YES));
}

@end

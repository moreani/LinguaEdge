#pragma once

#include <string>
#include <functional>
#include <memory>
#include <vector>

namespace offline_tutor {

struct LlamaModelConfig {
    std::string model_path;
    int32_t context_size = 2048;
    float temperature = 0.7f;
    int32_t max_tokens = 512;
    int32_t threads = 4;
};

using TokenCallback = std::function<void(const std::string& token)>;

class LlamaEngine {
public:
    virtual ~LlamaEngine() = default;

    virtual bool load_model(const LlamaModelConfig& config) = 0;
    virtual bool unload_model() = 0;
    virtual bool is_loaded() const = 0;
    virtual void generate(const std::string& prompt, TokenCallback callback) = 0;
    virtual void stop() = 0;

    static std::unique_ptr<LlamaEngine> create();
};

} // namespace offline_tutor

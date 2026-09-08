# Skills & Online Resources
## Skills to Learn for the Offline AI Language Tutor

This list is ordered by usefulness to this project. Start with the first section and do not try to master everything before building.

---

## 1. React Native + TypeScript

### Why you need it

This is the application layer: screens, navigation, state, forms, accessibility and interaction.

### Learn

- React Native fundamentals
- components
- hooks
- TypeScript types
- async/await
- error handling
- platform-specific code
- performance basics

### Resources

- React Native TypeScript: https://reactnative.dev/docs/typescript
- React Native docs: https://reactnative.dev/docs/getting-started
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/intro

### When to use

Use these skills every day while building the mobile UI and service layer.

---

## 2. React Native Native Modules / Turbo Modules

### Why you need it

Your JavaScript/TypeScript code must communicate with the native C++ inference runtime.

### Learn

- Turbo Native Modules
- Codegen
- native interfaces
- Android/iOS native integration
- JNI / Obj-C++ concepts

### Resource

- React Native Turbo Native Modules: https://reactnative.dev/docs/turbo-native-modules-introduction

### When to use

Start learning this immediately after the UI prototype. This is the bridge between React Native and llama.cpp.

---

## 3. C++ Fundamentals

### Why you need it

llama.cpp is C/C++. You do not need to become a C++ expert, but you need to understand native memory, pointers/references, RAII, threads, build systems and interfaces.

### Learn

- classes/structs
- pointers and references
- RAII
- smart pointers
- threading basics
- CMake
- shared/static libraries

### Resources

- C++ Reference: https://en.cppreference.com/
- CMake tutorial: https://cmake.org/cmake/help/latest/guide/tutorial/index.html

### When to use

Use these skills when compiling or modifying the native inference bridge and debugging memory/performance.

---

## 4. llama.cpp

### Why you need it

This is the core local inference engine if you choose the recommended architecture.

### Learn

- model loading
- GGUF
- context size
- tokens
- sampling
- batching basics
- quantization
- backends
- streaming
- memory management

### Resources

- llama.cpp repository: https://github.com/ggml-org/llama.cpp
- Build documentation: https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md
- Android documentation: https://github.com/ggml-org/llama.cpp/blob/master/docs/android.md
- Hugging Face llama.cpp guide: https://huggingface.co/docs/inference-endpoints/engines/llama_cpp

### When to use

This is your main technical learning area during the first proof-of-concept milestone.

---

## 5. GGUF + Quantization

### Why you need it

The model file is a core part of a mobile local-LLM app. You need to understand why different quantizations trade model size, memory and quality.

### Learn

- GGUF metadata
- quantization basics
- model size vs quality
- context vs memory
- compatible model families

### Resources

- Hugging Face GGUF documentation: https://huggingface.co/docs/hub/gguf
- GGUF + llama.cpp usage: https://huggingface.co/docs/hub/en/gguf-llamacpp

### When to use

Use this knowledge when choosing your first model and designing the Model Manager.

---

## 6. Android NDK + Native Build Systems

### Why you need it

Android native integration requires understanding how C/C++ libraries are built for ARM64 and linked into the app.

### Learn

- Android NDK basics
- CMake on Android
- ABI / arm64-v8a
- JNI basics
- native library packaging

### Resources

- Android NDK: https://developer.android.com/ndk
- Android native build overview: https://developer.android.com/studio/projects/configure-cmake

### When to use

Use this during Android llama.cpp integration.

---

## 7. Apple Metal + iOS Native Integration

### Why you need it

For iOS performance, you need to understand Apple's native GPU/compute stack and how native libraries are packaged and called.

### Learn

- iOS native modules
- Objective-C++ basics
- Swift concurrency basics
- Metal concepts
- frameworks/XCFrameworks

### Resources

- Apple Metal documentation: https://developer.apple.com/documentation/metal
- Swift concurrency: https://developer.apple.com/documentation/swift/concurrency

### When to use

Use this when bringing the inference runtime to iOS and performance-tuning the Apple side.

---

## 8. SQLite / Offline Data Architecture

### Why you need it

Your learner profile, mistakes, vocabulary and progress all need to survive without a network.

### Learn

- relational modeling
- tables/indexes
- migrations
- transactions
- repository pattern
- local-first architecture

### Resource

- Expo SQLite: https://docs.expo.dev/versions/latest/sdk/sqlite/

### When to use

Start when the first local AI chat works. Do not postpone data architecture until the very end.

---

## 9. React Navigation

### Why you need it

The app has onboarding, tabs, detail screens and settings.

### Resource

- React Navigation getting started: https://reactnavigation.org/docs/getting-started/

### When to use

Use from the beginning of the UI implementation.

---

## 10. Prompt Engineering for Local Models

### Why you need it

Small on-device models benefit from narrow prompts, clear instructions and predictable output formats.

### Learn

- system vs dynamic context
- few-shot examples
- constrained outputs
- JSON schemas
- context trimming
- role separation
- prompt evaluation

### Resources

- OpenAI prompt engineering guide: https://platform.openai.com/docs/guides/prompt-engineering
- Hugging Face course: https://huggingface.co/learn/nlp-course/chapter1/1

### When to use

Use once your local model can generate text. Then iterate against real learner mistakes.

---

## 11. Structured AI Outputs + Validation

### Why you need it

The UI needs predictable objects rather than free-form AI text.

### Learn

- JSON Schema
- runtime validation
- schema versioning
- safe fallback handling

### Resources

- JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
- Zod: https://zod.dev/

### When to use

Use for correction objects, exercises, lesson summaries and other LLM-to-UI contracts.

---

## 12. Async Programming + Streaming

### Why you need it

Local inference is long-running work. The UI must remain responsive and should show streamed output.

### Learn

- Promises
- AsyncIterable
- cancellation
- queues
- backpressure concepts
- native thread vs JS thread responsibilities

### Resources

- MDN async functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
- React Native native modules: https://reactnative.dev/docs/turbo-native-modules-introduction

### When to use

Use during token streaming and cancellation implementation.

---

## 13. Mobile Performance & Memory

### Why you need it

An LLM can consume significant RAM and CPU/GPU time. Mobile performance is not the same as a desktop demo.

### Learn

- profiling
- memory pressure
- background execution limits
- battery/thermal behavior
- native vs JS performance

### Resources

- Android performance: https://developer.android.com/topic/performance
- Apple performance: https://developer.apple.com/documentation/xcode/improving-your-app-s-performance

### When to use

Use after the first working model and before release.

---

## 14. Offline-First Mobile Design

### Why you need it

Offline is a core product promise, not a side feature.

### Learn

- local persistence
- retryable downloads
- state machines
- graceful errors
- sync boundaries
- network-awareness

### Resources

- Expo docs: https://docs.expo.dev/
- Android offline-first guidance: https://developer.android.com/topic/architecture/data-layer/offline-first

### When to use

Use throughout model download, learning history and app lifecycle work.

---

## 15. Speech — V2 Skill

### Why you need it

Voice turns the app from a text tutor into a speaking coach.

### Learn

- speech-to-text
- text-to-speech
- audio permissions
- streaming audio
- pronunciation evaluation concepts

### Resources

- Android SpeechRecognizer: https://developer.android.com/reference/android/speech/SpeechRecognizer
- Apple Speech framework: https://developer.apple.com/documentation/speech

### When to use

Only after the text-based offline tutor is stable.

---

# Recommended Learning Order

```text
1. React Native + TypeScript
        ↓
2. React Navigation
        ↓
3. SQLite
        ↓
4. C++ basics
        ↓
5. llama.cpp
        ↓
6. GGUF + quantization
        ↓
7. Android NDK / CMake
        ↓
8. Turbo Native Modules
        ↓
9. Prompting + structured outputs
        ↓
10. Performance / memory
        ↓
11. iOS native + Metal
        ↓
12. Speech for V2
```

# What You Actually Need to Know Before Coding

You do **not** need to finish all these courses first.

For the first working prototype, focus on:

- React Native + TypeScript
- basic C++
- llama.cpp
- GGUF
- native module concepts
- asynchronous streaming
- SQLite

Then learn the next topic exactly when the architecture requires it.

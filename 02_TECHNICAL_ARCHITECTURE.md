# Technical Architecture
## Offline AI Language Tutor

## 1. Recommended Stack

| Layer | Choice | Reason |
|---|---|---|
| Mobile UI | React Native + TypeScript | Reuse your React/JS knowledge across Android and iOS |
| Navigation | React Navigation | Mature mobile routing and typed navigation |
| Local database | SQLite / Expo SQLite | Persistent local data and offline-first design |
| State | Zustand | Small and simple state layer |
| AI runtime | llama.cpp | Native C/C++ inference for GGUF models |
| Model format | GGUF | Designed for efficient local inference/execution |
| Native bridge | React Native Turbo Native Module / JSI | Connect TypeScript to native inference |
| Android native | Kotlin/C++ + Android NDK | Native runtime and C++ integration |
| iOS native | Swift/Objective-C++/C++ | Native lifecycle and llama.cpp integration |
| Build | CMake + platform build tooling | Native library compilation |

---

## 2. High-Level Architecture

```text
┌──────────────────────────────────────────────┐
│              React Native UI                 │
│                                              │
│ Home | Practice | Chat | Progress | Profile │
└───────────────────────┬──────────────────────┘
                        │
┌───────────────────────▼──────────────────────┐
│             Application Services             │
│                                              │
│ TeacherEngine | ProgressEngine | ModelMgr   │
└───────────────┬──────────────┬───────────────┘
                │              │
        ┌───────▼───────┐  ┌───▼─────────────┐
        │ Learning Data │  │ Prompt / Context │
        │ SQLite        │  │ Manager         │
        └───────────────┘  └──────┬──────────┘
                                  │
                         ┌────────▼────────┐
                         │ Inference API   │
                         │ typed contract  │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │ Native Bridge   │
                         │ RN TurboModule  │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │ llama.cpp       │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │ GGUF model      │
                         └─────────────────┘
```

---

## 3. Why llama.cpp Is the Primary Engine

Use a thin inference abstraction so the app can swap runtimes later.

The current llama.cpp ecosystem supports GGUF and native CPU/GPU backends across desktop and mobile environments. Keep all runtime-specific code behind an interface.

Do not make screen components know anything about C++, GGUF, GPU layers or tensor memory.

---

## 4. Inference Interface

Define an app-level contract similar to:

```ts
export type InferenceConfig = {
  modelPath: string;
  contextSize: number;
  temperature: number;
  maxTokens: number;
};

export interface LocalInference {
  load(config: InferenceConfig): Promise<void>;
  unload(): Promise<void>;
  isLoaded(): Promise<boolean>;
  generate(prompt: string): AsyncIterable<string>;
  stop(): Promise<void>;
}
```

The UI should only depend on `LocalInference` or `TeacherEngine`.

---

## 5. React Native Native Module

Use a typed native interface and let React Native Codegen produce the native interfaces. The current React Native documentation describes Turbo Native Modules for this style of typed JS/TS-to-native integration.

Conceptually:

```text
TS spec
  ↓
React Native Codegen
  ↓
Android native interface   iOS native interface
  ↓                         ↓
C++ / JNI                  C++ / Obj-C++
  ↓                         ↓
llama.cpp                  llama.cpp
```

---

## 6. Model Manager

Responsibilities:

```text
ModelManager
├── listModels()
├── getRecommendedModel(device)
├── downloadModel()
├── pauseDownload()
├── resumeDownload()
├── cancelDownload()
├── verifyChecksum()
├── installModel()
├── loadModel()
├── unloadModel()
├── deleteModel()
└── getStorageInfo()
```

### Storage lifecycle

Use an incomplete-file extension during download, then rename only after verification:

```text
model.gguf.part
       ↓
checksum verified
       ↓
model.gguf
```

This prevents a partial model from being loaded as if it were valid.

---

## 7. TeacherEngine

The central product service.

```ts
class TeacherEngine {
  startConversation(input: ConversationInput) {}
  correctSentence(input: CorrectionInput) {}
  generateExercise(input: ExerciseInput) {}
  explainGrammar(input: GrammarInput) {}
  generateVocabularyReview(input: VocabularyInput) {}
  summarizeLesson(input: LessonInput) {}
}
```

Internally it should:

1. Read learner profile.
2. Read relevant weaknesses.
3. Read recent conversation context.
4. Build a constrained prompt.
5. Call local inference.
6. Parse/validate the structured result.
7. Store the useful learning signal.
8. Return a UI-friendly object.

---

## 8. Prompt Context Strategy

Do not send the entire history on every turn.

Build a compact context:

```text
System rules
+
Learner profile
+
Current lesson goal
+
Top relevant weaknesses
+
Recent conversation turns
+
Current user input
```

Example:

```text
Learner:
Target language: English
Level: A2
Native language: Marathi

Weak topics:
- past tense
- prepositions

Current lesson:
Travel conversation

Recent context:
2-4 most recent turns

Task:
Correct the learner naturally and continue the conversation.
```

---

## 9. Structured Output

Prefer JSON/schema-constrained responses when the response must drive UI state.

Example:

```json
{
  "type": "correction",
  "correct": false,
  "original": "I go market yesterday",
  "corrected": "I went to the market yesterday",
  "explanation": "Use past tense because the action happened yesterday.",
  "grammarTopic": "past_tense",
  "difficulty": "beginner",
  "nextExercise": "I ___ to work yesterday."
}
```

Validate the result in TypeScript before using it.

If validation fails, fall back to a safe plain-text teaching response rather than crashing the UI.

---

## 10. Database Architecture

Repository pattern:

```text
UI
 ↓
Learning Service
 ↓
Repository
 ↓
SQLite
```

Avoid putting SQL directly in screens.

Example repositories:

```text
UserRepository
ConversationRepository
MessageRepository
MistakeRepository
VocabularyRepository
LessonRepository
SkillRepository
```

---

## 11. Device Capability Detection

Collect non-sensitive capability data needed for model selection:

- OS
- CPU architecture
- available memory estimate
- available storage
- supported runtime/backend features

Then map it to model recommendations.

Do not assume every device can run the same context size or quantization.

---

## 12. Background / Foreground Handling

Inference is a heavyweight operation.

Required behavior:

```text
App foreground
    ↓
Inference active

App backgrounded
    ↓
Cancel/stop active generation when appropriate
    ↓
Release or suspend heavy native resources according to runtime limits

App resumed
    ↓
Reload/reinitialize only if necessary
```

Test this aggressively on mid-range Android devices.

---

## 13. Performance Instrumentation

Track internally in development builds:

- load duration
- prompt tokens
- generated tokens
- first-token latency
- total generation time
- tokens/sec
- context length
- peak memory if available
- model size
- backend/runtime

Create a developer screen:

```text
Model: Teacher Balanced
Load: 4.8 sec
Context: 4096
First token: 1.3 sec
Generation: 18.7 tok/s
Memory: 2.9 GB
```

---

## 14. Security / Privacy

V1 should not require cloud inference for core functions.

Protect local data with platform storage protections where appropriate.

Clearly explain:

- model source
- what data stays local
- optional network behavior
- whether crash analytics are used

Do not claim “private” if future telemetry actually uploads conversation content.

---

## 15. Suggested Folder Structure

```text
src/
├── app/
├── components/
├── screens/
│   ├── onboarding/
│   ├── home/
│   ├── practice/
│   ├── chat/
│   ├── progress/
│   └── profile/
├── ai/
│   ├── TeacherEngine.ts
│   ├── PromptBuilder.ts
│   ├── ContextManager.ts
│   ├── ModelManager.ts
│   ├── ModelCatalog.ts
│   ├── inference/
│   └── schemas/
├── learning/
│   ├── SkillEngine.ts
│   ├── MistakeEngine.ts
│   ├── VocabularyEngine.ts
│   └── SpacedRepetition.ts
├── database/
│   ├── schema.ts
│   ├── migrations/
│   └── repositories/
├── store/
└── utils/

native/
├── ios/
├── android/
└── cpp/
    └── llama/
```

---

## 16. Runtime Alternatives

Keep the inference layer swappable.

### Primary

`llama.cpp + GGUF`

Use when you want flexible GGUF model support and direct native control.

### Alternative

`Google AI Edge / MediaPipe LLM Inference`

Use when you prefer Google's mobile-oriented runtime/model flow and your selected models/platforms are supported.

Do not build two runtimes in V1. Prove one first.

---

## 17. Build Sequence

### Milestone A — native inference proof

- Build llama.cpp for Android.
- Load one small compatible model.
- Prompt it from a native test harness.
- Measure performance.

### Milestone B — mobile shell

- Create React Native app.
- Implement navigation.
- Implement UI screens with mocked AI.

### Milestone C — bridge

- Define typed native module.
- Implement load/unload/generate/stop.
- Stream tokens to JS.

### Milestone D — teacher

- TeacherEngine
- structured outputs
- correction UI
- exercise UI

### Milestone E — memory

- SQLite
- mistakes
- skills
- vocabulary
- adaptive generation

### Milestone F — offline hardening

- download model
- verify checksum
- disable network
- run full acceptance test

---

## 18. Core Technical Acceptance Test

```text
Install app
  ↓
Download model
  ↓
Verify checksum
  ↓
Load model
  ↓
Disable internet
  ↓
Chat
  ↓
Stream tokens
  ↓
Correct learner mistake
  ↓
Save mistake
  ↓
Generate targeted exercise
  ↓
Save score
  ↓
Restart app
  ↓
Data still present
  ↓
Model still usable
```

# Implementation Roadmap
## Offline AI Language Tutor

## Phase 0 — Project Setup

### Deliverables

- Git repository
- React Native + TypeScript app
- Android + iOS build pipeline
- basic navigation
- design tokens
- linting/type checking
- dev environment documentation

### Exit criteria

App builds on at least one Android device and one iOS simulator/device where available.

---

## Phase 1 — Local LLM Proof of Concept

This is the highest-priority technical milestone.

### Tasks

1. Select one small GGUF model.
2. Build/test llama.cpp for Android.
3. Load model from local storage.
4. Send a prompt.
5. Receive generated text.
6. Measure speed and memory.
7. Test longer context.
8. Test repeated generation.
9. Test unload/reload.

### Exit criteria

A simple native test screen can:

```text
Load model
→ Generate response
→ Stop generation
→ Unload model
```

with no crash during repeated tests.

---

## Phase 2 — UI Foundation

Build screens with mocked data.

### Screens

- onboarding
- model download
- home
- practice
- chat
- progress
- profile
- model manager

### Exit criteria

The entire primary user journey is navigable without AI.

---

## Phase 3 — Native Bridge

### Tasks

- typed Turbo Module spec
- Codegen integration
- Android native implementation
- iOS native implementation
- load/unload API
- streaming generation
- cancellation
- error mapping

### Exit criteria

React Native chat screen receives streamed tokens from the local model.

---

## Phase 4 — Teacher Engine

### Tasks

- TeacherEngine
- PromptBuilder
- ContextManager
- schemas
- JSON validation
- conversation memory policy
- correction flow
- exercise generation

### Exit criteria

The same user input produces a structured teacher response that the UI can reliably render.

---

## Phase 5 — SQLite Learning Memory

### Tasks

- schema
- migrations
- repositories
- conversation persistence
- mistake persistence
- skills
- vocabulary
- lesson history

### Exit criteria

Close and reopen the app; learner history remains available.

---

## Phase 6 — Adaptive Learning

### Tasks

- mistake frequency
- skill scoring
- weak-topic selection
- targeted exercise generation
- review queue

### Initial heuristic

A simple V1 rule is sufficient:

```text
weaknessScore =
  errorFrequency × severity × recencyWeight
```

Then select the highest-scoring topic for additional practice.

Do not build a complex machine-learning recommender in V1.

---

## Phase 7 — Offline Hardening

### Test plan

```text
Install
↓
Download
↓
Verify
↓
Disable Wi-Fi/mobile data
↓
Conversation
↓
Practice
↓
Progress
↓
Restart
↓
Repeat
```

### Failure cases

- download interrupted
- insufficient storage
- corrupted model
- model load failure
- native crash recovery
- app backgrounded during generation
- user cancels generation
- database migration failure

---

## Phase 8 — Performance Tuning

### Measure on real devices

- load time
- first token latency
- tokens/sec
- RAM
- thermal behavior
- battery drain

### Optimization levers

- model size
- quantization
- context length
- number of GPU layers where backend supports it
- prompt length
- conversation history size
- output length

Benchmark each change instead of guessing.

---

## Phase 9 — Voice V2

Only after text is stable.

### Pipeline

```text
Microphone
  ↓
Speech-to-text
  ↓
Teacher Engine
  ↓
Response
  ↓
Text-to-speech
```

Treat speech recognition and speech synthesis as separate subsystems from the text LLM.

---

## Phase 10 — Polish / Release

### Release checklist

- onboarding complete
- model download UX polished
- clear privacy copy
- no broken offline flow
- accessibility pass
- dark mode decision
- crash reporting decision
- app icon
- splash screen
- store screenshots
- release notes
- test matrix

---

## Suggested Coding Order for an AI Coding Agent

Work vertically, one thin slice at a time:

### Slice 1

`onboarding → select language → home`

### Slice 2

`home → chat UI with mock response`

### Slice 3

`native model load → real local response`

### Slice 4

`real response → structured correction UI`

### Slice 5

`save mistake → progress updates`

### Slice 6

`generate targeted next exercise`

### Slice 7

`offline acceptance test`

This is better than asking an agent to generate the entire app in one huge step.

---

## Definition of Done for a Feature

A feature is done only when:

1. UI works.
2. Loading/error/empty states exist.
3. TypeScript passes.
4. Native code builds where relevant.
5. Data persists where relevant.
6. Offline behavior is tested where relevant.
7. The feature works after app restart.
8. No secrets or API keys are hard-coded.
9. A short manual test procedure exists.

---

## Recommended Project Milestones

| Milestone | Result |
|---|---|
| M0 | Buildable React Native shell |
| M1 | Local model runs on device |
| M2 | React Native receives streamed tokens |
| M3 | AI teacher behavior works |
| M4 | Learning memory works |
| M5 | Adaptive practice works |
| M6 | Fully offline MVP |
| M7 | Voice prototype |
| M8 | Release candidate |

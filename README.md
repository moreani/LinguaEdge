# Offline AI Language Tutor — Project Pack

This pack is the build specification for a cross-platform mobile language-learning app that runs an LLM on-device and works offline after the model is installed.

## Included

- `01_MASTER_PRD.md` — complete product requirements document
- `02_TECHNICAL_ARCHITECTURE.md` — app architecture, data model, inference layer, model manager, testing and deployment approach
- `03_LLM_USAGE_GUIDE.md` — exactly where/when to use the LLM, where not to use it, prompting and structured-output strategy
- `04_IMPLEMENTATION_ROADMAP.md` — phased build plan, milestones, acceptance criteria and testing checklist
- `05_SKILLS_AND_RESOURCES.md` — skills to learn, why they matter, and current online resources
- `UI_Mockup.png` — generated UI concept covering onboarding, dashboard, AI conversation, practice and progress

## Recommended starting stack

- React Native + TypeScript
- Native inference bridge using `llama.cpp`
- GGUF model files
- SQLite for local learning data
- Zustand for app state
- React Navigation for navigation

## Build order

1. Prove local inference on a real Android device.
2. Build the React Native UI with mock data.
3. Build the native bridge and streaming inference.
4. Implement the Teacher Engine and structured AI responses.
5. Add local learning memory and adaptive exercises.
6. Test fully offline.
7. Add voice only after the text product is stable.

## Important

The model/runtime layer is the highest-risk part of the project. Do not commit to a particular model size or GPU backend before measuring the target devices.

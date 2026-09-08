# LinguaEdge 🐼 — Offline AI Language Learning App

An on-device, distraction-free language learning mobile app designed for seamless language learning. Featuring **Pandi the Panda 🐼** as your personal companion tutor, offline pronunciation audio (TTS), adaptive spaced-repetition flashcards, and 100% offline conversational AI.

> **Made with love for learning languages completely offline — Zero cloud APIs, Zero subscriptions, 100% Private.**

---

## 📱 Pre-built Android APK

You can directly install the pre-built application APK on any Android phone:
- **Download APK:** [`apk/LinguaEdge.apk`](./apk/LinguaEdge.apk)

### Installation
1. **Via Direct Transfer:** Copy `apk/LinguaEdge.apk` to your Android device and tap to install.
2. **Via ADB:**
   ```bash
   adb install -r apk/LinguaEdge.apk
   ```

---

## ✨ Features

- 🐼 **Pandi Tutor:** Expressive panda companion that guides you through conversation, cheers your progress, and helps correct grammar mistakes with gentle encouragement.
- 🗣️ **Offline Speech & Pronunciation (TTS):** One-tap audio for every sentence, word, and correction in Korean, Spanish, English, etc. Adjustable speech speed (0.75x slow speed for beginners).
- 💬 **Interactive Conversations:** Engaging dialogue scenarios (Restaurant Ordering, Airport Travel, Hobbies, Friends, Daily Routines) with instant replies and live translation hints.
- 🎯 **Targeted Grammar Correction:** Instant detection of verb tense, preposition, and particle mistakes with clean pedagogical explanations.
- 🗂️ **Spaced Repetition Vocabulary:** Interactive flip flashcards with SRS intervals, streak tracking, and audio pronunciation.
- ⚡ **100% Offline & Private:** Runs entirely on-device with zero external server dependencies or cloud costs.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons
- **Mobile Bridge:** Capacitor 8
- **Audio & TTS:** `@capacitor-community/text-to-speech` with Android TTS engine
- **State & Storage:** Zustand + Local IndexedDB / SQLite architecture
- **Inference Engine:** On-device semantic engine + llama.cpp native bridge compatibility

---

## 🚀 Building from Source

```bash
# Install dependencies
npm install

# Build web distribution
npm run build

# Sync Capacitor assets
npx cap sync android

# Build debug APK
cd android
./gradlew assembleDebug
```
The resulting APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.


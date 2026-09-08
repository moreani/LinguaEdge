# Product Requirements Document (PRD)
## Offline AI Language Tutor

**Document status:** Build-ready product specification  
**Target platforms:** Android + iOS  
**Primary framework:** React Native + TypeScript  
**Core differentiator:** Personal language teacher powered by an on-device LLM

---

## 1. Product Summary

Build a mobile language-learning application that behaves like a personal AI teacher and can continue teaching after the user has downloaded a compatible local model. The product should teach through conversation, corrections, exercises, vocabulary review and adaptive practice rather than behaving like a generic chatbot.

The central loop is:

`Learn → Practice → Make mistakes → Analyze → Remember → Adapt → Practice again`

### Product promise

> Your personal language teacher — offline, private and personalized.

---

## 2. Problem

Most AI language apps depend on cloud inference. This creates latency, recurring API costs, privacy concerns and weak offline support. Traditional language apps often provide fixed exercises but lack open-ended conversation and individualized correction.

This product combines:

- Open-ended AI tutoring
- Local/on-device inference
- Local learner memory
- Adaptive practice
- Offline-first UX

---

## 3. Goals

### Primary goals

1. Run a supported language model directly on the user's device.
2. Provide useful conversational teaching without a network connection after setup.
3. Correct grammar and word usage in a pedagogically useful way.
4. Remember learner mistakes and weaknesses locally.
5. Generate personalized follow-up exercises.
6. Track progress across grammar, vocabulary and conversation.
7. Make model/download state obvious to the user.

### Secondary goals

- Support multiple target languages.
- Offer model choices based on device capability.
- Add voice input/output after the text experience is stable.

### Non-goals for V1

- Social network
- User-to-user chat
- Leaderboards
- Cloud synchronization
- Paid subscriptions
- Human tutors
- AI image generation
- Complex multiplayer systems

---

## 4. Target User

### Primary persona

A learner who wants to practice a language frequently, prefers privacy/offline access, and wants explanations instead of only right/wrong answers.

### Typical session

1. Open app.
2. See daily goal/streak.
3. Start a conversation or practice session.
4. Make an error.
5. Receive correction + explanation.
6. Answer a follow-up exercise.
7. Save the lesson outcome.
8. Return later and get practice based on weak areas.

---

## 5. Core User Stories

- As a learner, I want to choose a target language and level so that the teacher can adapt to me.
- As a learner, I want the app to work without internet after model setup.
- As a learner, I want the AI to correct my mistakes and explain why they are wrong.
- As a learner, I want the app to remember recurring mistakes.
- As a learner, I want exercises to become more relevant to my weak areas.
- As a learner, I want to see progress over time.
- As a learner, I want to know whether AI processing is happening locally.
- As a learner, I want to delete or replace the local model without losing my learning history.

---

## 6. V1 Feature Scope

### 6.1 Onboarding

- Welcome screen
- Native language selection
- Target language selection
- Level selection
- Optional lightweight placement test
- Learning goal selection
- Model compatibility check
- Recommended model screen
- Model download with progress
- Model verification
- Model-ready state

### 6.2 Home

Display:

- Greeting
- Daily learning goal
- Streak
- Overall progress
- Continue learning CTA
- Conversation practice
- Grammar
- Vocabulary
- Daily challenge
- Model/offline status

### 6.3 AI Conversation

- Create conversation
- Select topic
- Free-text input
- Suggested replies
- Streaming response
- Correct mistakes inline
- Explain grammar
- Give a follow-up exercise
- End session and summarize

### 6.4 Practice

Exercise types for V1:

- Fill in the blank
- Multiple choice
- Sentence correction
- Translate sentence
- Vocabulary recall
- Short free-response answer

### 6.5 Vocabulary

- Add word
- Word meaning
- Example sentence
- Confidence level
- Review history
- Due-for-review queue

### 6.6 Progress

- Overall score
- Skill breakdown
- Weekly trend
- Practice count
- Accuracy
- Streak
- Weak topics
- Recent mistakes

### 6.7 Profile / Settings

- Language settings
- Learning level
- Daily goal
- AI model manager
- Storage information
- Delete model
- Replace model
- Offline status
- About/privacy

---

## 7. Information Architecture

```text
App
├── Onboarding
│   ├── Welcome
│   ├── Language
│   ├── Level
│   ├── Goal
│   ├── Device Check
│   └── Model Download
│
├── Main Tabs
│   ├── Home
│   ├── Practice
│   ├── Chat
│   ├── Progress
│   └── Profile
│
└── Profile
    ├── Language
    ├── Learning Goal
    ├── AI Model
    ├── Storage
    └── About
```

---

## 8. UI Requirements

### Design direction

- Premium educational product
- White/off-white surfaces
- Deep navy typography
- Indigo/purple primary accent
- Soft blue/purple gradients
- Rounded cards
- Clear visual hierarchy
- Friendly but not childish
- Strong accessibility contrast
- Responsive to small and large phones

### Navigation

Bottom navigation:

`Home | Practice | Chat | Progress | Profile`

### Offline indicator

A persistent compact indicator should communicate one of:

- `● Offline — AI Ready`
- `✓ AI Running On Device`
- `Downloading Model`
- `Model Required`

---

## 9. AI Teacher Behavior

The AI should behave as a teacher, not a generic assistant.

### When the learner is correct

- Confirm briefly.
- Optionally expand with a useful note.
- Continue the conversation.

### When the learner is incorrect

1. Identify the error.
2. Show the corrected sentence.
3. Explain the reason in simple language.
4. Optionally show a short rule.
5. Give a targeted follow-up.

### Teacher personality

- Encouraging
- Clear
- Concise
- Patient
- Non-judgmental
- Adapted to learner level

### Difficulty adaptation

The teacher should use stored learner data to decide:

- vocabulary complexity
- sentence length
- grammar focus
- correction depth
- exercise difficulty

---

## 10. Local Learning Memory

Store locally:

```text
Learner Profile
- nativeLanguage
- targetLanguage
- level
- dailyGoal

Conversation
- topic
- timestamp
- messages

Mistake
- category
- original
- corrected
- frequency
- severity
- lastSeen

Vocabulary
- word
- translation
- example
- confidence
- reviewCount
- lastReviewed
- nextReview

Skill
- grammar
- vocabulary
- conversation
- listening
- pronunciation (future)
```

---

## 11. Adaptive Learning Logic

Example:

```text
Learner repeatedly confuses:
"in Monday" vs "on Monday"

        ↓

Mistake frequency increases

        ↓

Prepositions skill score decreases

        ↓

Teacher Engine receives weak-topic context

        ↓

Generate more preposition exercises

        ↓

Performance improves

        ↓

Reduce frequency and move to next weakness
```

---

## 12. Model Management Requirements

The application must not assume one fixed model.

### Model catalog

Each model entry should contain:

- id
- displayName
- fileName
- source URL
- format
- quantization
- estimated size
- minimum RAM recommendation
- platform support
- checksum
- language coverage

### Download manager

Must support:

- progress
- pause/resume where feasible
- retry
- cancellation
- insufficient storage detection
- checksum/integrity verification
- atomic install

### Model lifecycle

```text
Not Installed
    ↓
Downloading
    ↓
Verifying
    ↓
Installed
    ↓
Loaded
    ↓
Ready
    ↓
Unload
    ↓
Installed
```

---

## 13. Data Model

### users

- id
- native_language
- target_language
- level
- daily_goal
- created_at

### conversations

- id
- topic
- created_at
- duration_seconds

### messages

- id
- conversation_id
- role
- content
- created_at

### mistakes

- id
- message_id
- category
- original_text
- corrected_text
- severity
- frequency
- last_seen

### vocabulary

- id
- word
- translation
- example
- confidence
- review_count
- last_reviewed
- next_review

### lessons

- id
- type
- topic
- difficulty
- score
- completed_at

### skills

- id
- skill
- score
- trend
- updated_at

---

## 14. Non-Functional Requirements

### Offline

After model installation, core teaching flows should work with network disabled.

### Performance

Measure:

- model load time
- first-token latency
- tokens/second
- memory use
- battery/thermal behavior
- long-session stability

### Reliability

- App should survive model load errors gracefully.
- Backgrounding should not leave uncontrolled native inference running.
- Corrupt model files should not be treated as installed.
- Database migrations must be safe.

### Privacy

Core learner data should remain local in V1. The app should not send user conversations to a cloud LLM by default.

---

## 15. Success Metrics

### Product metrics

- onboarding completion rate
- model download completion
- first lesson completion
- daily active learners
- 7-day retention
- average learning session length
- lessons completed per week
- repeat mistake rate

### Technical metrics

- model load success rate
- inference crash rate
- median first-token latency
- median tokens/second
- peak memory usage
- offline test pass rate

---

## 16. Acceptance Criteria for V1

V1 is ready when a tester can:

1. Install the app.
2. Select a target language.
3. Select a level.
4. Download a supported model.
5. Turn off internet.
6. Start an AI conversation.
7. Receive a streamed local response.
8. Submit an incorrect sentence.
9. Receive a correction and explanation.
10. Complete a follow-up exercise.
11. See progress update.
12. Reopen the app and see learning history.
13. View/delete/replace the installed model.
14. Use core learning flows while offline.

---

## 17. Future Versions

### V1.1

- spaced repetition improvements
- more exercise types
- lesson summaries
- custom topics

### V2

- speech-to-text
- text-to-speech
- roleplay mode
- pronunciation practice

### V3

- model marketplace/catalog
- optional cloud backup
- advanced analytics
- personalized curriculum generation

---

## 18. Product Principle

The app should always optimize for learning value, not for the amount of AI-generated text.

A good session should leave the learner knowing something they did not know before.

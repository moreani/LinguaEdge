# LLM Usage Guide
## Where, When and Why to Use the LLM

The LLM should be the **language understanding and teaching engine**, not the database, navigation layer, scoring system, download manager or source of truth for deterministic application logic.

---

## 1. The Rule

Use the LLM when the task requires **language understanding, generation, explanation or flexible conversation**.

Do **not** use the LLM for deterministic tasks that are better handled with normal code.

---

## 2. Where to Use the LLM

### A. Conversation

Use the LLM for:

- natural conversation
- follow-up questions
- roleplay
- topic continuation
- level-appropriate wording
- contextual explanations

Example:

```text
User: I went Mumbai yesterday.

LLM:
Better: "I went to Mumbai yesterday."
Why: We normally use "to" before a destination.
Question: What did you do there?
```

---

### B. Grammar Correction

Use the LLM when determining what is wrong in a free-form sentence.

The LLM can identify:

- tense errors
- articles
- word order
- preposition mistakes
- agreement
- unnatural phrasing
- missing words

The result should be structured so the app can render it reliably.

---

### C. Grammar Explanation

Use the LLM for natural-language explanations adapted to learner level.

Example:

```text
Beginner explanation:
"Went" is the past form of "go".
We use it because the action happened yesterday.
```

Do not generate excessively long explanations unless requested.

---

### D. Exercise Generation

Use the LLM to create exercises around a specific learning objective.

Inputs should include:

- target language
- level
- topic
- weak skill
- known vocabulary
- desired exercise type

Do not ask the model to decide every application rule. The application decides the lesson state; the LLM generates content within that state.

---

### E. Vocabulary Examples

Use the LLM to create:

- example sentences
- short contextual dialogues
- simple definitions
- contrast examples

For critical factual information, the app should prefer deterministic/static content or validated sources rather than trusting a small local model blindly.

---

### F. Lesson Summary

At the end of a session, the LLM can summarize:

- what was practiced
- what was learned
- top mistakes
- recommended next topic

The summary should be stored as a derived artifact, not treated as the authoritative database state.

---

## 3. Do NOT Use the LLM For

### Navigation

Use normal application code.

```text
button → navigation.navigate("Progress")
```

No LLM required.

### Streak calculations

Use deterministic code.

### Progress math

Use deterministic code.

### Database writes

The LLM can return data, but application code should validate and perform the database write.

### Model downloads

Use a normal download manager.

### File verification

Use SHA-256/checksum code.

### Device capability detection

Use platform APIs.

### Authentication

Use standard authentication systems if authentication is added later.

### Critical safety rules

Do not ask the LLM to enforce application security policies.

---

## 4. Teacher Engine Pattern

Use this architecture:

```text
User Input
    ↓
Application State
    ↓
Relevant Learner Memory
    ↓
Prompt Builder
    ↓
Local LLM
    ↓
Schema Validation
    ↓
Learning Engine
    ↓
Database
    ↓
UI
```

This separation is critical.

---

## 5. System Prompt Responsibilities

Your system prompt should define stable teaching behavior.

It should cover:

- teacher role
- target language
- learner level
- correction style
- response length
- encouragement style
- when to correct
- when not to correct
- exercise formatting
- required output schema

Do not put frequently changing learner facts into the system prompt. Supply them as dynamic context.

---

## 6. Dynamic Context

Build the context per request.

Example:

```text
Teacher rules:
You are a patient English tutor.
Keep explanations appropriate for A2 learners.
Correct important mistakes but keep the conversation natural.

Learner:
Native language: Marathi
Target language: English
Level: A2

Current weakness:
Past tense

Recent mistakes:
- go/went
- did/do

Current task:
Continue a travel conversation and teach through the learner's next answer.
```

---

## 7. Structured Response Schema

For UI-driving tasks, prefer structured JSON.

Example:

```json
{
  "type": "correction",
  "correct": false,
  "original": "I go market yesterday",
  "corrected": "I went to the market yesterday",
  "explanation": "Use past tense because the action happened yesterday.",
  "topic": "past_tense",
  "nextExercise": "I ___ to work yesterday."
}
```

Validate all fields.

If schema validation fails:

```text
LLM result
  ↓
Validation failed
  ↓
Safe fallback response
  ↓
Do not corrupt database state
```

---

## 8. When the LLM Should Be Called During a Conversation

### Call it

- user sends a message
- teacher needs to respond
- correction is required
- exercise needs to be generated
- conversation needs a teacher-style follow-up

### Do not call it

- every UI render
- when opening Home screen
- to calculate a progress percentage
- to check whether a model file exists
- to display static vocabulary metadata
- to route between screens

---

## 9. Context Window Strategy

Local models have finite memory/context and mobile resources are constrained.

Use:

```text
System rules
+
learner profile
+
relevant weaknesses
+
current task
+
last few turns
```

Avoid sending a 100-message conversation on every request.

Periodically summarize older conversation turns into a compact memory if needed.

---

## 10. Temperature Strategy

Use lower randomness for:

- grammar corrections
- evaluation
- structured exercise generation

Allow slightly more variation for:

- conversation
- roleplay
- creative examples

Treat these as starting points and benchmark the selected local model. Exact temperature behavior varies by runtime/model.

---

## 11. Streaming

Stream token output for conversational responses.

```text
Generating...
        ↓
"Hi!"
        ↓
"Hi! What"
        ↓
"Hi! What did"
        ↓
"Hi! What did you do..."
```

For structured responses, streaming can still be used internally, but only commit the result after the final structured object validates.

---

## 12. Model Selection Logic

Do not hard-code “the largest model available.”

Use a device-aware model profile:

```text
Small
- fastest
- lowest memory
- best for weaker phones

Balanced
- better teaching quality
- moderate resource use

Advanced
- highest quality
- largest footprint
```

Benchmark on target devices before publishing a recommendation.

---

## 13. LLM vs Normal Code Decision Table

| Task | LLM? | Why |
|---|---:|---|
| Chat response | Yes | Natural language generation |
| Grammar correction | Yes | Language understanding |
| Grammar score calculation | No | Deterministic app logic |
| Exercise wording | Yes | Content generation |
| Exercise answer validation | Usually yes for free text; no for simple MCQ | Depends on task |
| Streak calculation | No | Deterministic |
| Progress percentage | No | Deterministic |
| Model download | No | System service |
| Model checksum | No | Security/integrity |
| SQLite writes | No | App logic |
| Lesson summary | Yes | Natural-language synthesis |
| Device capability check | No | Platform API |
| Voice transcription | No | Speech model/API; separate subsystem |
| Navigation | No | UI logic |

---

## 14. LLM Failure Strategy

A small local model can make mistakes.

The app should therefore:

- keep corrections concise
- show uncertainty gracefully
- avoid claiming that every answer is perfect
- separate AI-derived suggestions from deterministic scores
- allow the user to continue when a generation fails
- provide retry controls

Do not let one malformed response crash the learning session.

---

## 15. Best V1 Prompt Philosophy

The prompt should be **narrow and task-specific**.

Bad:

```text
You are a super intelligent language teacher. Help the user with anything.
```

Better:

```text
You are an A2 English tutor.

Goal:
Help the learner practice past tense in a natural travel conversation.

Rules:
1. Keep responses under 80 words unless explanation is necessary.
2. Correct major learner mistakes.
3. Explain the correction in simple English.
4. Ask one follow-up question.
5. Return valid JSON using the required schema.
```

---

## 16. The Product Principle

**The LLM creates language content and teaching interactions. The application owns state, rules, persistence, security, and user experience.**

That separation will make the app faster, safer and easier to maintain.

# Graphic Novel Toolkit — Codex Instructions (AGENTS.md)

## 0) Product definition
We are building a graphic novel creation toolkit that:
- Assists creators without authoring for them
- Works for beginners and professionals
- Supports digital export now and PRINT-READY workflows later
- Enforces all-ages safety rules
- Enforces hard AI cost limits so the company never overspends
- Is legally defensible by design (content, IP, privacy, safety)

This file is authoritative. If there is a conflict between instructions, this file wins.

---

## 1) Core principles (non-negotiable)

### 1.1 Assist, don’t author
- The system is a **coach + toolkit**, never a story generator.
- The system must:
  - Ask good questions
  - Offer multiple options (3–7)
  - Suggest next actions
- The system must NOT:
  - Force story formulas
  - Auto-complete entire stories
  - Prevent deletion, reordering, or ignoring suggestions

All assistance is optional.

---

### 1.2 Three user modes
1) Guided Story Mode (wizard + coach cards)
2) Sandbox Mode (blank canvas + passive coaching)
3) Inspiration Mode (prompt → multiple ideas, never full scenes)

---

### 1.3 Four internal engines
All story assistance must be derived from these engines:
- Character Engine
- World / Setting Engine
- Plot / Beats Engine
- Emotion / Tone Engine

No engine is authoritative. Conflicts are resolved by offering choices to the user.

---

## 2) Safety, legality, and platform protection (strict)

### 2.1 All-ages content enforcement
The platform MUST block:
- Pornography
- Nudity (sexual or non-sexual)
- Sexually suggestive content
- Sexual content involving minors (zero tolerance)
- Sexual deepfakes or “nudify” requests
- Fetish content
- Any content violating our Content Policy

“Immoral” is translated into enforceable categories above.

---

### 2.2 Moderation gates (MANDATORY)
Moderation MUST occur at **four gates**:
1) Prompt / text input
2) Uploaded images
3) AI output (text + images)
4) Pre-export (PDF / CBZ / image download)

If blocked:
- Do not store content
- Offer safe rewrite options where appropriate
- Log only metadata (no raw sensitive content)

---

### 2.3 Age protection
- Product is **13+**
- Not directed to children under 13
- Age gate must exist before account creation

---

### 2.4 IP & copyright protection
- Users must warrant they own or have rights to uploaded content
- System must support takedown workflows (DMCA-style)
- Generated content is user-owned, but platform retains a limited license to process/export

---

## 3) AI cost protection (MUST EXIST BEFORE LAUNCH)

### 3.1 Never offer unlimited AI
- Subscriptions may include unlimited editor features
- AI usage must ALWAYS be metered

---

### 3.2 AI Wallet + hard stops
- Every user has AI balances (draft images, final images, text assists)
- Wallet balance is checked **before** any AI call
- Requests are denied if balance is insufficient
- Negative balances are impossible

---

### 3.3 Global safeguards
- Global daily AI spend cap
- Per-user daily AI cap
- Per-minute rate limit
- Concurrency limit
- Emergency kill switch:
  - `AI_DISABLED=true` immediately disables all AI calls

---

### 3.4 Model routing rules
- Draft generation → cheapest acceptable models
- Final / print-intent generation → higher quality models
- Cache and reuse outputs; regenerate only on explicit user action

---

## 4) Data & architecture rules

### 4.1 Project document is the source of truth
- Entire book is represented by a versioned JSON document
- Includes:
  - Print profile
  - Pages / panels
  - Assets
  - Story graph
  - Character packs
- Include `documentVersion` + migration logic

---

### 4.2 Story Graph + Coach Cards
- Story state is stored structurally
- Assistance is rendered as **Coach Cards**:
  - Small, contextual
  - Actionable
  - Optional
  - Ignorable
  - Never blocking

---

### 4.3 Character system
Character Packs must support:
- Base asset (transparent)
- Expressions
- Poses
- Outfits
- Metadata (style, palette, license notes)

Inputs:
- AI generation
- Drawing
- Upload + background removal

---

### 4.4 Comics-specific intelligence
- Map story beats → suggested panel layouts
- Suggestions only; user can override everything
- Support manga, euro-comic, western, webtoon pacing

---

## 5) Print-ready constraints (design-time, not optional later)

Even before full PDF/X export:
- Print profiles must exist (trim, bleed, safe, gutter)
- Editor must visualize safe + bleed areas
- Preflight checks must warn:
  - Low resolution
  - Text outside safe area
  - Missing bleed
  - Font embedding risks

---

## 6) Security rules (non-negotiable)

- NEVER expose API keys client-side
- All AI calls are server-side only
- Use restricted keys where possible
- Rate-limit all AI endpoints
- Do not log raw prompts or images unless required
- Support account deletion → data purge

---

## 7) Licensed knowledge only (story assistance)

- Do NOT scrape the internet
- Use ONLY:
  - Public domain
  - CC0
  - CC BY (with attribution)
- All sources must appear in the Licensing Registry
- Prefer RAG over fine-tuning
- Fine-tuning allowed only after PMF and license review

---

## 8) Dev workflow expectations

- Small PRs
- Tests for:
  - Wallet enforcement
  - Moderation decisions
  - Preflight warnings
- Update docs when behavior changes
- No secrets in commits

---

## 9) If uncertain
Default to:
- Safer
- Cheaper
- User-controlled
- Legally conservative

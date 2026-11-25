# AffectFusion Human Annotation Guidelines (Multimodal Emotion Intensity & Sarcasm)

**Project**: *AffectFusion: A Cross-Attention Transformer Framework for Explainable Multimodal Emotion Recognition from Text and Emoji Semantics*  
**Target File**: `AffectFusion_human_validation_sample.csv`  
**Annotator Roles**: Independent Dual Annotation (`human_annotator_1` and `human_annotator_2`) + Third-Party Adjudication for Disagreements

---

## 1. Fundamental Principles & Non-Modification Rules

1. **Annotate Original Content Directly**: Read the comment in its original language/script (`Bangla`, `Banglish`, `English`, or `Mixed`) together with its exact `emoji_stream`. Do **not** translate or rewrite the comment before judging its affective meaning.
2. **Independent Blind Annotation**: `human_annotator_1` and `human_annotator_2` must complete their respective columns independently without viewing each other's scores or the automated baseline labels.
3. **Redacted Illustrative Examples Only**: All examples inside this manual are **synthetic/redacted pedagogical illustrations** created exclusively to explain scoring rules without exposing raw production comments.

---

## 2. Continuous Emotion Intensity (`0.00–1.00`) vs. Probability

AffectFusion models emotions as **continuous psychological activation intensities** (`[0.00, 1.00]`), **NOT** mutually exclusive class probabilities.

| Concept | Continuous Emotion Intensity (`AffectFusion`) | Probability Distribution (`Softmax`) |
| :--- | :--- | :--- |
| **Range per dimension** | `0.00` (absent) to `1.00` (maximum activation) | `0.00` to `1.00` |
| **Sum across 9 dimensions** | **Does NOT need to sum to `1.00`** (e.g., `Love = 0.85` and `Joy = 0.70` sum to `1.55`) | Forced to sum to `1.00` |
| **Co-activation** | Captures genuine mixed emotions without diluting primary intensity | Artificially lowers scores when two emotions co-occur |

### Intensity Calibration Scale (`0.00–1.00`)
- **`0.00`**: Complete absence of the emotion.
- **`0.10 – 0.35` (Low / Background)**: Faint or secondary trace of emotion; below the threshold for a salient secondary label.
- **`0.40 – 0.65` (Moderate / Salient)**: Clear, unmistakable presence of the emotion (qualifies for `secondary_emotion` if non-primary and non-Neutral).
- **`0.70 – 0.85` (Strong)**: Dominant emotional expression supported by explicit lexical markers or strong emoji reinforcement.
- **`0.90 – 1.00` (Extreme / Peak)**: Intense affective outburst (multiple intensifiers, emphatic punctuation, repeated expressive emojis).

---

## 3. The 9 Emotion Intensity Dimensions

1. **`Joy`**: Happiness, amusement, laughter, celebration, satisfaction, delight.
2. **`Sadness`**: Grief, sorrow, heartbreak, crying, disappointment, hopelessness, mourning.
3. **`Anger`**: Rage, hostility, fury, indignation, aggressive condemnation, resentment.
4. **`Fear`**: Anxiety, terror, panic, worry, dread, perceived threat or danger.
5. **`Surprise`**: Shock, astonishment, disbelief, sudden unexpected realization.
6. **`Disgust`**: Revulsion, contempt, cringe, moral repugnance, distaste.
7. **`Love`**: Deep affection, adoration, devotion, warmth, heartfelt appreciation, fan admiration.
8. **`Anticipation`**: Genuine forward-looking emotional excitement, eager expectation, counting down to an upcoming event. *(Note: Polite requests, begging for gifts, or routine questions about schedules are **NOT** high Anticipation and must be scored `< 0.40`.)*
9. **`Neutral`**: Absence of emotional activation (`>= 0.70` only when the comment is purely factual, informational, or emotionally flat; **must be `0.00`** whenever any affective dimension is `>= 0.45`).

---

## 4. Primary & Secondary Emotion Rules

### 4.1 Primary Emotion (`human_primary_emotion`)
- Must equal the **strict numeric `argmax`** of your 9 assigned emotion intensity scores:
  $$\\text{primary\\_emotion} = \\arg\\max_{e \\in \\{\\text{Joy}, \\dots, \\text{Neutral}\\}} \\text{Score}(e)$$
- Never assign a categorical `primary_emotion` that has a lower numeric score than another dimension in the same row.

### 4.2 Secondary Emotion
- A comment has a salient secondary emotion **if and only if**:
  1. The emotion is **not** the `primary_emotion`,
  2. The emotion is **not** `Neutral`, and
  3. Its intensity score is **`>= 0.40`**.
- If no non-primary, non-Neutral emotion reaches `>= 0.40`, the secondary emotion is `NONE`.

---

## 5. Auxiliary Sarcasm Annotation (`human_Sarcasm`)

- **`human_Sarcasm = 1`**: The comment uses irony, mockery, or surface positivity/politeness (or positive emojis like `😇`, `😂`, `🙃`, `👏`) to convey underlying ridicule, contempt (`Disgust`), or hostility (`Anger`).
- **`human_Sarcasm = 0`**: Literal, non-ironic expression.
- **Crucial Rule**: When `human_Sarcasm = 1`, score the **true underlying emotional state** (e.g., `Disgust = 0.75, Anger = 0.50`) or the mixed surface-ironic blend when genuinely ambivalent, rather than blindly copying literal surface words.

---

## 6. Multimodal Text–Emoji Relation (`human_text_emoji_relation`)

Select **exactly one** of the 5 canonical relation labels:

1. **`text_only`**: No emojis are present in the comment (`has_emoji = 0`).
2. **`emoji_only`**: The comment consists solely of emojis (or punctuation + emojis) with no lexical words.
3. **`reinforcing`**: The emoji(s) amplify, match, or harmonize with the emotional polarity of the text (e.g., affectionate text + `❤️🥰`, or grieving text + `😭💔`).
4. **`contradictory`**: The emoji polarity directly opposes or subverts the literal text polarity (e.g., harsh insult paired with `😇💖`, or tragic statement paired with `😂🤣`).
5. **`ambiguous`**: The emoji semantics (`🗿`, `🌚`, `🙂`) or multiple conflicting emojis (`😂😭😡`) create genuine interpretive ambiguity with the text.

---

## 7. Multilingual & Code-Mixed Guidance (`Bangla`, `Banglish`, `English`, `Mixed`)

### 7.1 Native Bengali (`Bangla`)
- Pay close attention to Bengali idioms and particles (e.g., *"মনটা ভরে গেলো"*, *"অস্থির হইছে"*, *"ভন্ডামির সীমা আছে"*).
- *Redacted Example*: `"অসাধারণ অভিনয়, দেখে চোখে পানি চলে আসলো 😢❤️"`
  - Scores: `Love = 0.80, Sadness = 0.65, Joy = 0.45, Neutral = 0.00`
  - `primary_emotion`: `Love` | `text_emoji_relation`: `reinforcing` | `Sarcasm`: `0`

### 7.2 Transliterated Bengali (`Banglish`)
- Account for phonetic spelling variations (`valo` / `bhalo`, `kosto` / `koshto`, `osthir`, `joss`, `xoss`, `abal`, `bhondami`).
- *Redacted Example*: `"purai osthir ekta episode chilo bhai 🔥😍"`
  - Scores: `Joy = 0.88, Love = 0.60, Neutral = 0.00`
  - `primary_emotion`: `Joy` | `text_emoji_relation`: `reinforcing` | `Sarcasm`: `0`

### 7.3 Regional English & Code-Mixed (`English` / `Mixed`)
- Code-mixed comments combine Bengali/Banglish clauses with English phrases.
- *Redacted Example (Sarcasm with Positive Emojis)*: `"Wah ki darun বিচার, criminals roaming free as always 😇👏"`
  - Scores: `Disgust = 0.82, Anger = 0.68, Joy = 0.15, Neutral = 0.00`
  - `primary_emotion`: `Disgust` | `text_emoji_relation`: `contradictory` | `Sarcasm`: `1`

### 7.4 Emotionally Neutral Comments
- Routine timestamps, factual answers, or neutral inquiries without emotional charge.
- *Redacted Example*: `"Video ta kon camera diye shoot kora hoyeche?"`
  - Scores: `Neutral = 0.90` (all other emotions `0.00` or `<= 0.15`)
  - `primary_emotion`: `Neutral` | `text_emoji_relation`: `text_only` | `Sarcasm`: `0`

---

## 8. Handling Uncertainty & Confidence (`human_confidence` & `human_notes`)

- Assign `human_confidence` in `[0.00, 1.00]`:
  - **`0.85 – 1.00`**: Unambiguous comment with clear textual and/or emoji cues.
  - **`0.65 – 0.84`**: Moderately clear, minor context dependency.
  - **`< 0.65`**: Highly context-dependent, cryptic slang, or ambiguous irony.
- Always record a brief explanation in `human_notes` whenever `human_confidence < 0.70`, `human_Sarcasm = 1`, or `human_text_emoji_relation` is `contradictory` or `ambiguous`.

---

## 9. Consensus & Disagreement Adjudication Protocol (Phase 10)

Once both human annotators complete `AffectFusion_human_validation_sample.csv`:
1. **Categorical Consensus (`primary_emotion`, `Sarcasm`, `text_emoji_relation`)**:
   - If `human_annotator_1 == human_annotator_2`, that label becomes the consensus gold label in `AffectFusion_human_consensus_gold.csv`.
   - If `human_annotator_1 != human_annotator_2`, the row is **never silently overwritten**; it is exported to `AffectFusion_annotation_disagreements.csv` for third-annotator adjudication.
2. **Continuous Intensity Consensus (`Joy`..`Neutral`)**:
   - If the absolute difference $|\\text{Score}_1(e) - \\text{Score}_2(e)| \\le 0.25$ across all dimensions and primary emotions match, the consensus intensity is the arithmetic mean $\\frac{\\text{Score}_1(e) + \\text{Score}_2(e)}{2}$ rounded to 2 decimal places.
   - If any dimension differs by $> 0.25$ or changes the `argmax` primary emotion, the row is flagged in `AffectFusion_annotation_disagreements.csv` for explicit human adjudication.

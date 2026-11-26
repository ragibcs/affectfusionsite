# Datasheet for Datasets: AffectFusion Multilingual Text-and-Emoji Emotion Corpus (v4 Consensus Gold)

*Structured according to Gebru et al. (2021), "Datasheets for Datasets," Communications of the ACM, 64(12), 86–92.*

---

## 1. Motivation

- **For what purpose was the dataset created?**  
  AffectFusion was created to address the lack of open, realistic, multilingual multimodal benchmarks for studying how emojis reinforce, soften, or contradict textual emotions (particularly sarcasm and irony) across **English (`ENG`)**, **Native Bengali (`BN`)**, and **Romanized Banglish (`BNG`)**.
- **Who created the dataset and on behalf of which entity?**  
  Created by **MD. Ragib Hasan** (`232-15-775`) and **MD. Asadulla Hel Galib** (`232-15-270`), supervised by **Sharmin Akter** (Assistant Professor) and co-supervised by **Dewan Mamun Raza** (Assistant Professor), Department of Computer Science and Engineering, **Daffodil International University (DIU), Dhaka, Bangladesh**.
- **Who funded the creation of the dataset?**  
  Self-funded academic Final Year Design Project (FYDP) utilizing open-source software and free-tier compute (Google Colab Tesla T4).

---

## 2. Composition

- **What do the instances represent?**  
  Each row represents a single anonymized public social media post or comment containing text and optionally one or more Unicode emojis, classified into one of **9 canonical emotion classes**: `Joy (0)`, `Neutral (1)`, `Anger (2)`, `Sadness (3)`, `Surprise (4)`, `Sarcasm (5)`, `Fear (6)`, `Disgust (7)`, and `Anticipation (8)`.
- **How many instances are there in total?**  
  **30,000 instances** partitioned strictly 80/10/10 into `train_24k.parquet` (`24,000`), `val_3k` (`3,000`), and `test_3k` (`3,000`), accompanied by the **2-Round Blind-Swap Human-vs-Human Consensus Gold** audit (`5,000` double-annotated rows = `10,000` independent human judgments covering `100%` of `test_3k` and `66.7%` of `val_3k`).
- **Does the dataset contain all possible instances or a sample?**  
  A quota-stratified sample harvested from an initial pool of `60,000` raw multilingual comments (`55,399` retained after 5K-chunk preprocessing, `44,486` queued for priority labeling, `44,580` total labeled pool including `1,600` train-only external rows).
- **What data does each instance consist of?**  
  25 core structured columns separating `raw_text`, `text_stream`, `emoji_stream`, `demoji_text`, `baseline_input`, categorical labels, language tags, emoji/lexical counts, affective punctuation cues, and explicit provenance flags (`is_augmented`, `is_external_train_only`, `is_human_verified`), plus `is_double_adjudicated` on Consensus Gold `val_3k` and `test_3k`. Zero null values exist across required streams or labels.
- **Are there recommended data splits?**  
  Yes — the locked splits (`train_24k`, `val_3k`, `test_3k`) are strictly deduplicated by normalized text MD5 hash across splits so identical texts never leak across Train, Validation, or Test.
- **Does the dataset contain confidential or personally identifiable information (PII)?**  
  No private or login-gated content was collected. Automated regex preprocessing irreversibly masked URLs (`<URL>`), handles (`<USER>`), emails (`<EMAIL>`), and phone numbers (`<PHONE>`). Automated pre-release verification confirmed `0` email addresses, `0` raw URLs, and `0` personal phone numbers across the public evaluation splits.
- **Does the dataset contain content that might be offensive or sensitive?**  
  Because instances originate from real public social media comments (including `Anger`, `Disgust`, and `Sarcasm` classes), some comments contain informal slang, political commentary, or harsh criticism reflective of real online discourse.

---

## 3. Collection Process

- **How was the data acquired?**  
  Harvested via multi-platform public collection pipelines across YouTube (~96% via `yt-dlp`, `youtube-comment-downloader`, and YouTube Data API v3 covering 830 tracked video IDs spanning Bangladeshi news, comedy, drama, cricket, and global channels), Reddit (`Arctic Shift` / public JSON), Mastodon public hashtag timelines, Lemmy, and public news RSS feeds (`60,000` raw rows: `ENG 24,000`, `BN 18,000`, `BNG 18,000`; `70%` emoji / `30%` non-emoji). To prevent rare-class starvation in minority classes during training, `1,600` English rows from `dair-ai/emotion` (`Fear 1,100` + `Surprise 500`, Saravia et al., EMNLP 2018) were quarantined strictly to `train_24k` (flagged `is_external_train_only = 1`, zero rows in Val or Test).
- **Over what timeframe was the data collected?**  
  September–November 2026.
- **Were ethical review / terms-of-service safeguards followed?**  
  Only publicly accessible posts were harvested without bypassing authentication or paywalls; all user identifiers were discarded before storage.

---

## 4. Preprocessing, Cleaning, and Labeling

- **What preprocessing and cleaning was performed?**  
  Processed in 5,000-row streaming chunks, removing `4,601` (`7.67%`) invalid entries (non-target script `3,360`, Hindi/Hinglish `860`, too short `<12 chars / <3 words` or `>600 chars` `352`, duplicates `24`, spam/bots `5`) to retain `55,399` clean rows:
  1. Regex PII masking (`<URL>`, `<USER>`, `<EMAIL>`, `<PHONE>`).
  2. Bot, spam, non-target script, Hindi/Hinglish, and length filtering.
  3. Fitzpatrick skin-tone (`🏻–🏿`) and variation-selector (`U+FE0F`) stripping to canonical base emoji glyphs.
  4. Unicode range + curated lexicon language detection (`ENG`, `BN`, `BNG`).
  5. Exact & normalized MD5 text-hash deduplication.
- **How were labels assigned and validated?**  
  1. **Priority Queue & LLM Pseudo-Labeling:** `44,486` rows were prioritized (minority emotions first; Joy & Neutral capped at `6,500` each; `10,913` skipped). `Gemini 3.1/3.5 Flash-Lite` labeled `43,111` rows (batch 25, `100%` parse on 100-row pilot); `131` rows with `conf < 3` were dropped, leaving `42,980` scraped + `1,600` train-only `dair-ai/emotion` = `44,580` labeled rows.
  2. **2-Round Blind-Swap Human-vs-Human Gold Verification (`N = 5,000` Paired Rows = `10,000` Human Judgments):** Both researchers independently annotated all `5,000` real scraped evaluation rows (`3,000` Test + `2,000` Val) across Round 1 and a Round 2 blind swap without viewing each other's labels. Paired Human-vs-Human agreement reached **79.80% unanimous (`3,990 / 5,000`)**, **Cohen's κ = 0.7717**, and **Krippendorff's α = 0.7717** (`ENG`: `79.20%`, `κ = 0.7651`; `BN`: `82.94%`, `κ = 0.8052`; `BNG`: `76.94%`, `κ = 0.7377`; Test `κ = 0.7515`; Val `κ = 0.8019`). All `1,010` disagreements were jointly adjudicated (`526` Annotator 1, `482` Annotator 2, `2` third class), updating `472` Test labels and `264` Val labels.
  3. **Strict Train-Only Augmentation:** Inside `train_24k` only, `3,528` emoji-preserving paraphrases were generated via Gemini Flash across 143 calls (`Fear +1,384` incl. `1,116` cross-lingual ENG→BN/BNG, `Surprise +1,041`, `Anger +613`, `Disgust +396`, `Anticipation +94`) with zero hash overlap against Val or Test.

---

## 5. Uses

- **Intended Uses:** Academic research and benchmarking for multimodal text-emoji emotion recognition, cross-attention transformer fusion, multilingual (`ENG`/`BN`/`BNG`) NLP, sarcasm/contradiction detection, and post-hoc/intrinsic explainable AI (SHAP, LIME, attention maps).
- **Prohibited / Out-of-Scope Uses:** Clinical or medical diagnosis of mental health conditions, automated punitive profiling without human oversight, or re-identification attempts.

---

## 6. Distribution and Maintenance

- **Distribution:** Permanently archived on **Zenodo** (`#24543680`, `10.5281/zenodo.24543680`) and **Hugging Face Hub** (`ragibhasan/AffectFusion`, DOI `10.57967/hf/11874`) under **CC BY 4.0**, accompanied by reproducible code and Colab notebooks at [https://github.com/ragibcs/AffectFusion](https://github.com/ragibcs/AffectFusion).
- **Maintenance & Contact:** Maintained by **MD. Ragib Hasan** (`hasan2305101775@diu.edu.bd`) and **MD. Asadulla Hel Galib** (`galib2305101270@diu.edu.bd`).

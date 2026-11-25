# Datasheet for Datasets: AffectFusion Multilingual Text-and-Emoji Emotion Corpus (v1.0.0)

*Structured according to Gebru et al. (2021), "Datasheets for Datasets," Communications of the ACM, 64(12), 86–92.*

---

## 1. Motivation

- **For what purpose was the dataset created?**  
  AffectFusion v1.0.0 was created to address the lack of open, realistic, multilingual multimodal benchmarks for studying how emojis reinforce, soften, or contradict textual emotions (particularly sarcasm and irony) across **English (`ENG`)**, **Native Bengali (`BN`)**, and **Romanized Banglish (`BNG`)**.
- **Who created the dataset and on behalf of which entity?**  
  Created by **MD. Ragib Hasan** (`232-15-775`) and **MD. Asadulla Hel Galib** (`232-15-270`), supervised by **Sharmin Akter** (Assistant Professor) and co-supervised by **Dewan Mamun Raza** (Assistant Professor), Department of Computer Science and Engineering, **Daffodil International University (DIU), Dhaka, Bangladesh**.
- **Who funded the creation of the dataset?**  
  Self-funded academic Final Year Design Project (FYDP) utilizing open-source software and free-tier compute (Google Colab Tesla T4).

---

## 2. Composition

- **What do the instances represent?**  
  Each row represents a single anonymized public social media post or comment containing text and optionally one or more Unicode emojis, classified into one of **9 canonical emotion classes**: `Joy (0)`, `Neutral (1)`, `Anger (2)`, `Sadness (3)`, `Surprise (4)`, `Sarcasm (5)`, `Fear (6)`, `Disgust (7)`, and `Anticipation (8)`.
- **How many instances are there in total?**  
  **30,000 instances** partitioned strictly 80/10/10 into `train_24k.parquet` (`24,000`), `val_3k` (`3,000`), and `test_3k` (`3,000`), accompanied by `gold_5000_human_verified.csv` (`5,000` blinded human-vs-AI verification records covering `100%` of `test_3k` and `66.7%` of `val_3k`).
- **Does the dataset contain all possible instances or a sample?**  
  A quota-stratified sample harvested from an initial pool of `59,840` raw multilingual comments (`44,580` retained after cleaning and confidence filtering `conf ≥ 3`).
- **What data does each instance consist of?**  
  25 structured columns separating `raw_text`, `text_stream`, `emoji_stream`, `demoji_text`, `baseline_input`, categorical labels, language tags, emoji/lexical counts, affective punctuation cues, and explicit provenance flags (`is_augmented`, `is_external_train_only`, `is_human_verified`). Zero null values exist across required streams or labels.
- **Are there recommended data splits?**  
  Yes — the locked splits (`train_24k`, `val_3k`, `test_3k`) are strictly deduplicated by normalized text MD5 hash across splits so identical texts never leak across Train, Validation, or Test.
- **Does the dataset contain confidential or personally identifiable information (PII)?**  
  No private or login-gated content was collected. Automated regex preprocessing irreversibly masked URLs (`<URL>`), handles (`<USER>`), emails (`<EMAIL>`), and phone numbers (`<PHONE>`). Automated pre-release verification confirmed `0` email addresses, `0` raw URLs, and `0` personal phone numbers across the public evaluation splits.
- **Does the dataset contain content that might be offensive or sensitive?**  
  Because instances originate from real public social media comments (including `Anger`, `Disgust`, and `Sarcasm` classes), some comments contain informal slang, political commentary, or harsh criticism reflective of real online discourse.

---

## 3. Collection Process

- **How was the data acquired?**  
  Harvested via zero-API public collection pipelines across YouTube (`yt-dlp` / `youtube-comment-downloader` / YouTube public comments covering Bangladeshi news, comedy, drama, cricket, and global channels), Reddit (`Arctic Shift` / public JSON), Mastodon public hashtag timelines, Lemmy, and public Bangla/English RSS feeds. To prevent rare-class starvation in `Fear` during training, `1,600` English Fear rows from DAIR-AI/CARER (Saravia et al., EMNLP 2018) were quarantined strictly to `train_24k` (flagged `is_external_train_only = 1`, zero rows in Val or Test).
- **Over what timeframe was the data collected?**  
  September–November 2026.
- **Were ethical review / terms-of-service safeguards followed?**  
  Only publicly accessible posts were harvested without bypassing authentication or paywalls; all user identifiers were discarded before storage.

---

## 4. Preprocessing, Cleaning, and Labeling

- **What preprocessing and cleaning was performed?**  
  1. Regex PII masking (`<URL>`, `<USER>`, `<EMAIL>`, `<PHONE>`).
  2. Bot, spam, empty, and extreme-length noise filtering.
  3. Fitzpatrick skin-tone (`🏻–🏿`) and variation-selector (`U+FE0F`) stripping to canonical base emoji glyphs.
  4. Unicode range + curated lexicon language detection (`ENG`, `BN`, `BNG`).
  5. Exact & normalized MD5 text-hash deduplication.
- **How were labels assigned and validated?**  
  1. Initial 9-class annotation with structured JSON confidence scores (`1`–`5`) via `Gemini 3.1/3.5 Flash-Lite` (following a 4-bit NF4 `Qwen2.5-7B-Instruct` stability pilot), retaining `44,580` rows at `conf ≥ 3`.
  2. **Blinded Dual-Member Human Gold Verification:** `5,000` real scraped comments (`3,000` Test + `2,000` Val) were split evenly (`2,500` each) across both researchers in blinded Excel workbooks with dropdown rubric validation. Overall agreement reached **83.00%** (**Cohen's κ = 0.8087**; Test `κ = 0.7847` with `574` corrections; Val `κ = 0.8447` with `276` corrections).
  3. **Strict Train-Only Augmentation:** Inside `train_24k` only, `3,528` emoji-preserving paraphrases were generated via Gemini Flash across 5 deficit classes (`Fear +1,384`, `Surprise +1,041`, `Anger +613`, `Disgust +396`, `Anticipation +94`) with zero hash overlap against Val or Test.

---

## 5. Uses

- **Intended Uses:** Academic research and benchmarking for multimodal text-emoji emotion recognition, cross-attention transformer fusion, multilingual (`ENG`/`BN`/`BNG`) NLP, sarcasm/contradiction detection, and post-hoc/intrinsic explainable AI (SHAP, LIME, attention maps).
- **Prohibited / Out-of-Scope Uses:** Clinical or medical diagnosis of mental health conditions, automated punitive profiling without human oversight, or re-identification attempts.

---

## 6. Distribution and Maintenance

- **Distribution:** Permanently archived on **Zenodo** under **CC BY 4.0** with SHA-256 checksums (`SHA256SUMS.txt`), accompanied by reproducible code and Colab notebooks at [https://github.com/ragibcs/AffectFusion](https://github.com/ragibcs/AffectFusion).
- **Maintenance & Contact:** Maintained by **MD. Ragib Hasan** (`hasan2305101775@diu.edu.bd`) and **MD. Asadulla Hel Galib** (`galib2305101270@diu.edu.bd`). Versioned releases follow semantic versioning (`v1.0.0`).

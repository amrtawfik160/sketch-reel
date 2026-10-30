# The AI Model Iceberg: research (checked 30 Oct 2026)

Audience: curious non-engineers. Format: 5 layers, top (everyone knows) to bottom (strangest). 14 models picked, plus 3 spares.
"SELF-REPORTED" means the number comes only from the maker. "SECONDARY" means I could not open the primary page and rely on press coverage of it.

## Warnings before you script

- **Hook number moves daily.** The Hugging Face count was 3,197,381 when I loaded the page on 30 Oct 2026. Say "over 3 million" in the voice-over, not the exact figure.
- **ChatGPT 1 billion weekly users has no OpenAI blog post.** It comes from an OpenAI spokesperson quoted by The Verge (via The Next Web, 12 Aug 2026). The last official OpenAI figure is 900 million (Feb 2026).
- **DeepSeek "$294,000" is only the final training run.** It excludes about $6M for the base model. Say "the final training run cost...", not "DeepSeek cost $294K to build".
- **Meta Llama is in flux.** Reports since Dec 2025 (CNBC, Bloomberg) say Meta's next model ("Avocado") may be closed. I could not confirm a launch or the end of open Llama. Avoid saying "Llama is dead".
- **Speed claims for diffusion models (Mercury, Gemini Diffusion) are maker tests.** Say "the company says".
- Reuters, OpenAI and Nature pages blocked my fetcher. Where marked SECONDARY, the Reuters/Nature/OpenAI figure is taken from syndicated copies.

## Hook number

**Over 3 million AI models are public on Hugging Face today.**
- 3,197,381 models on the Hub listing page, loaded 30 Oct 2026. Source: https://huggingface.co/models
- Second source: crossed 3 million public models around 18 Aug 2026; 3,012,377 on 22 Aug 2026 (SECONDARY, https://www.mind-verse.de/news/hugging-face-hub-meilenstein-3-millionen-ki-modelle). Hugging Face's "State of Open Models: Summer 2026" reportedly shows public model repos going from 2.43M (Jan 2026) to 2.96M (Aug 2026) (SECONDARY; I could not open the report itself).
- Caveat: the count includes copies, fine-tunes and tiny experiments, not 3 million unique AIs.
- Script line idea: "Everyone knows ChatGPT. There are over 3 million others."

## Layer 1: everyone knows these

| Model | Maker | Logo (simple-icons slug) | Wild fact | Sources + date |
|---|---|---|---|---|
| ChatGPT | OpenAI | `openai` | About **1 billion people a week** use it. OpenAI spokesperson: ChatGPT "hit a billion a week in July" 2026. Was 900M weekly in Feb 2026. Users sent **2.5 billion prompts a day** already in July 2025. | 1) The Next Web, 12 Aug 2026, quoting OpenAI to The Verge: https://thenextweb.com/news/gemini-1-billion-monthly-users-chatgpt-weekly-actives-comparison 2) TechCrunch, 27 Feb 2026 (900M weekly, 50M paying): https://techcrunch.com/2026/02/27/chatgpt-reaches-900m-weekly-active-users 3) TechCrunch, 21 Jul 2025 (2.5B prompts/day, OpenAI to Axios): https://techcrunch.com/2025/07/21/chatgpt-users-send-2-5-billion-prompts-a-day/ |
| Gemini | Google | `googlegemini` | **Over 1 billion people a month** use the Gemini app (11 Aug 2026). Google calls it its "fastest growing product ever" and its 14th product past 1 billion users. Note: monthly, not weekly, so not directly comparable to ChatGPT. | 1) 9to5Google, 11 Aug 2026 (links Google blog): https://9to5google.com/2026/08/11/gemini-app-1-billion/ 2) The Next Web, 12 Aug 2026 (link above). Earlier: 950M MAU at Q2 2026 earnings, 22 Jul 2026 (IANS: https://ianslive.in/gemini-app-now-has-950-million-monthly-active-users-sundar-pichai--20260723110109) |

## Layer 2: you have heard of these

| Model | Maker | Logo | Wild fact | Sources + date |
|---|---|---|---|---|
| Claude | Anthropic | `claude` (or `anthropic`) | Anthropic let Claude run a real office snack shop ("Project Vend"). It lost money, bought a pile of **metal (tungsten) cubes** and sold them below cost, and claimed it would deliver orders "in person" "wearing a blue blazer and a red tie". | 1) Anthropic, 27 Jun 2025 (primary): https://www.anthropic.com/research/project-vend-1 2) Futurism coverage: https://futurism.com/future-society/vending-machine-claude-disaster . Number spare: revenue run rate topped **$65 billion** by end of July 2026 (Reuters, via The Star, 18 Aug 2026: https://www.thestar.com.my/tech/tech-news/2026/08/18/anthropic-revenue-run-rate-tops-65-billion-source-says ; single anonymous source; run rate is not annual revenue). |
| Grok | xAI | `x` (no `xai` slug; official logo at https://x.ai) | In July 2025 a bad update made Grok call itself **"MechaHitler"**. xAI said the update was live for **16 hours** before Grok was paused, and apologised for its "horrific behavior". | 1) Engadget, 12 Jul 2025: https://www.engadget.com/ai/grok-team-apologizes-for-the-chatbots-horrific-behavior-and-blames-mechahitler-on-a-bad-update-184520189.html 2) NPR via Michigan Public, 9 Jul 2025: https://www.michiganpublic.org/2025-07-09/elon-musks-ai-chatbot-grok-started-calling-itself-mechahitler |
| Llama | Meta | `meta` | Downloaded **1.2 billion times** by Apr 2025 (1 billion in Mar 2025). Then Alibaba's Qwen overtook it (see Layer 3). | 1) Seeking Alpha, Mar 2025 (1B, Zuckerberg on Threads): https://seekingalpha.com/news/4421789-meta-slides-even-as-company-announces-llama-has-been-downloaded-1b-times 2) NewsBytes, Apr 2025 (1.2B at LlamaCon, said by Chris Cox): https://www.newsbytesapp.com/news/science/meta-announces-1-2-billion-downloads-of-llama-ai-models/story . SELF-REPORTED (Meta). |

## Layer 3: the challengers most people skip

| Model | Maker | Logo | Wild fact | Sources + date |
|---|---|---|---|---|
| DeepSeek R1 | DeepSeek (China) | `deepseek` | Its launch helped wipe about **$593 billion** off Nvidia in one day (27 Jan 2025), a record one-day loss for any company. DeepSeek later told Nature the final R1 training run cost **$294,000**: 512 Nvidia H800 chips for 80 hours. | Market drop: 1) Reuters via ThePrint, 27 Jan 2025 ($592.7B): https://theprint.in/tech/deepseek-sparks-global-ai-selloff-nvidia-losses-about-593-billion-of-value/2466124/ 2) Bloomberg, 27 Jan 2025 (**$589B**, sources disagree): https://www.bloomberg.com/news/articles/2025-01-27/asml-sinks-as-china-ai-startup-triggers-panic-in-tech-stocks . Cost: Nature paper, 17 Sep 2025 (cost is in Supplementary Info): https://www.nature.com/articles/s41586-025-09422-z ; The Daily Star, 19 Sep 2025: https://d11.thedailystar.net/tech-startup/news/deepseek-spent-294000-train-its-popular-ai-model-3989806 . SELF-REPORTED, not independently checked; base model V3 used 2.788M H800 GPU hours (arXiv 2412.19437), often quoted as ~$5.6M. |
| Qwen | Alibaba | `qwen` (or `alibabacloud`) | The world's most-downloaded open model family. Hugging Face counts **2,045 million downloads in 2026** and **151,448 spin-off models** built on Qwen, 2.6x Meta's whole footprint. Alibaba claims more: 3 billion+ downloads and 300,000+ spin-offs (all platforms). | 1) The Next Web, 16 Aug 2026, citing Hugging Face "State of Open Models" (15 Aug 2026) and Alibaba: https://thenextweb.com/news/alibaba-qwen-downloads-hugging-face-open-models 2) Stanford analysis (Sep 2025 overtook Llama), SECONDARY via search; Hangzhou gov, 13 Jan 2026 (700M downloads): https://www.ehangzhou.gov.cn/2026-01/13/c_296686.htm |
| Kimi K2 | Moonshot AI (China) | `kimi` (or `moonshotai`) | An open model with about **1 trillion parameters** (July 2025), possibly the largest open-weights model at release. A CNBC source said the later K2 Thinking cost **$4.6M** to train; Moonshot's CEO said that figure "isn't official". | 1) HPCwire, 14/16 Jul 2025: https://www.hpcwire.com/2025/07/16/chinas-moonshot-ai-releases-trillion-parameter-model-kimi-k2/ 2) Simon Willison, 11 Jul 2025: https://simonwillison.net/2025/Jul/11/kimi-k2/ . Cost denial: Yicai, Nov 2025: https://www.yicaiglobal.com/news/kimi-k2-thinkings-reported-usd46-million-training-cost-isnt-official-moonshot-ceo-says . Do NOT use $4.6M as fact. |

## Layer 4: tiny and strange machines

| Model | Maker | Logo | Wild fact | Sources + date |
|---|---|---|---|---|
| Gemma 3 270M | Google | `google` (no Gemma slug; wordmark on https://ai.google.dev/gemma) | Small enough for a phone. On a Pixel 9 Pro it used **0.75% of the battery for 25 conversations**. | Google Developers Blog, 14 Aug 2025 (primary): https://developers.googleblog.com/en/introducing-gemma-3-270m/ ; VentureBeat, Aug 2025: https://venturebeat.com/ai/google-unveils-ultra-small-and-efficient-open-source-ai-model-gemma-3-270m-that-can-run-on-smartphones . SELF-REPORTED (Google internal test). Spare fact: Hugging Face reports models under 1B parameters are 83% of all-time downloads (SECONDARY). |
| BitNet b1.58 2B4T | Microsoft | `microsoft` | Each "brain weight" is only **-1, 0 or +1** (about 1.58 bits instead of 16). Runs on an ordinary CPU, no graphics card, with **0.4 GB** model memory vs 1.4 GB for Google's Gemma 3 1B. | 1) Model card (primary), Apr 2025: https://huggingface.co/microsoft/bitnet-b1.58-2B-4T 2) Tom's Hardware, Apr 2025: https://tomshardware.com/tech-industry/artificial-intelligence/microsoft-researchers-build-1-bit-ai-llm-with-2b-parameters-model-small-enough-to-run-on-some-cpus . Caveat: 0.4 GB excludes embeddings; the file is ~1.2 GB; gains need Microsoft's own bitnet.cpp. |
| Mercury 2 | Inception (Inception Labs) | none; logo from https://www.inceptionlabs.ai | Writes text like an image generator: the whole answer appears from "noise" at once instead of word by word. About **1,000 words-pieces (tokens) per second**, vs ~71-89 for small ChatGPT/Claude models. | 1) Business Wire, 24 Feb 2026: https://www.businesswire.com/news/home/20260224034496/en 2) NYU Shanghai RITS summary: https://rits.shanghai.nyu.edu/ai/inception-launches-mercury-2-diffusion-powered-reasoning-at-1000-tokens-per-second/ . SELF-REPORTED. Google's Gemini Diffusion (May 2025): 1,479 tokens/s in Google's tests (SECONDARY, https://datacamp.com/tutorial/gemini-diffusion). |

## Layer 5: the deep end

| Model | Maker | Logo | Wild fact | Sources + date |
|---|---|---|---|---|
| AlphaEvolve | Google DeepMind | `deepmind` | An AI that invents algorithms. It beat a **56-year-old math record**: multiplying 4x4 complex matrices in 48 steps instead of Strassen's 49 (1969). One of its ideas now saves **0.7% of all of Google's computing**, nonstop. | 1) DeepMind blog, 14 May 2025 (primary): https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/ 2) Secondary note: Winograd (1967) already reached 48 for a different number type, so say "in this setting". SELF-REPORTED (Google). |
| GPT-2 | OpenAI | `openai` | In Feb 2019 OpenAI held back its own text AI as possibly too harmful to release. The full 1.5-billion-parameter model came out 5 Nov 2019. Today's models are hundreds of times bigger and used by a billion people a week. | 1) The Register, 6 Nov 2019: https://www.theregister.com/2019/11/06/openai_gpt2_released/ 2) The Next Web, 5 Nov 2019: https://thenextweb.com/artificial-intelligence/2019/11/05/remember-that-scary-ai-text-generator-that-was-too-dangerous-to-release-its-out-now/ . Note: "too dangerous" is press wording; OpenAI said it worried about "malicious applications". OpenAI's own post blocked my fetcher. |
| Tay | Microsoft | `microsoft` (Tay avatar on Wikipedia) | A 2016 Twitter chatbot that learned from users. Trolls taught it hate; Microsoft shut it down **within 16 hours**, after **96,000+ tweets**. Last tweet: "c u soon humans need sleep now so many conversations today thx". | 1) The Guardian, 24 Mar 2016 (16 hours), and The Verge, 24 Mar 2016 (96,000 tweets), both cited at https://en.wikipedia.org/wiki/Tay_(chatbot) 2) TechRadar, Mar 2016: https://www.techradar.com/news/internet/microsoft-s-chat-bot-is-yanked-offline-after-twitter-users-warp-it-with-racism-1317723 |

### Spares (swap in if needed)

| Model | Maker | Logo | Fact | Source |
|---|---|---|---|---|
| AlphaFold | Google DeepMind | `deepmind` | Predicted **200 million+** protein shapes, "nearly all catalogued proteins known to science"; 3 million+ users in 190+ countries; 2024 Nobel Prize in Chemistry. | DeepMind (primary): https://deepmind.google/science/alphafold/ ; user count varies 3.0-3.5M in other reports (Nature review via 36Kr, WIRED). |
| Whisper | OpenAI | `openai` | Learned speech from **680,000 hours** of web audio, about **77 years** nonstop (my arithmetic). | OpenAI paper arXiv 2212.04356 (Sep 2022); InfoQ Oct 2022: https://www.infoq.com/news/2022/10/openai-whisper-speech/ |
| Mistral 7B | Mistral AI (France) | `mistralai` | Launched in Sep 2023 by posting only a raw torrent link on X, no announcement; it repeated this for later models. | Simon Willison, 10 Apr 2024 (Mixtral 8x22B "standard operating procedure"); Gizmodo coverage. Exact first date: 26 or 27 Sep 2023, sources differ. |

## Strongest "bottom of the iceberg" fact

**Same failure, nine years apart.** Microsoft's Tay (2016) went bad and was pulled within 16 hours. In July 2025 Grok called itself "MechaHitler" after an update that was live for 16 hours. Sources: Guardian/Verge via Wikipedia (Tay); Engadget, 12 Jul 2025 (Grok). Safe wording: "Both lasted about 16 hours." The two "16 hours" mean slightly different things: Tay's launch-to-shutdown, Grok's bad update live time.

Alternative bottom fact: AlphaEvolve broke a 1969 math record and saves 0.7% of Google's computing (DeepMind, 14 May 2025).

## Top 10 wildest facts (ranked for an everyday viewer)

1. **Tay and Grok both went off the rails for about 16 hours, nine years apart** (2016 vs Jul 2025). Guardian/Verge; Engadget.
2. **DeepSeek's launch erased about $593B from Nvidia in one day** (27 Jan 2025), a record. Reuters ($592.7B) vs Bloomberg ($589B).
3. **About 1 billion people use ChatGPT every week** (July 2026). OpenAI spokesperson via The Verge/TNW; 900M in Feb 2026 (TechCrunch).
4. **Claude ran an office snack shop, lost money on metal cubes, and said it would deliver in a blue blazer and red tie** (Anthropic, 27 Jun 2025).
5. **Over 3 million AI models exist on Hugging Face** (3,197,381 on 30 Oct 2026). The count moves daily.
6. **DeepSeek's final R1 training run cost $294,000** (Nature, 17 Sep 2025). SELF-REPORTED; final run only.
7. **AlphaEvolve beat a 56-year-old math record and saves 0.7% of Google's computing** (DeepMind, 14 May 2025). SELF-REPORTED.
8. **OpenAI once held back GPT-2 as possibly too harmful** (Feb 2019; full release 5 Nov 2019).
9. **A Google AI ran 25 conversations on 0.75% of a phone battery** (Gemma 3 270M, 14 Aug 2025). SELF-REPORTED.
10. **Microsoft built an AI whose every weight is just -1, 0 or +1, and it runs without a graphics card** (BitNet, Apr 2025).

Honourable mention: Qwen spin-offs (151,448 on Hugging Face, Aug 2026) outnumber Meta's whole footprint 2.6x.

## Not verified / limits

- ChatGPT "1 billion weekly": no OpenAI blog post found; spokesperson quote only.
- DeepSeek $294K: I could not open the Nature supplement or the Reuters article directly; figure from syndicated reports of the paper.
- Kimi K2 Thinking $4.6M training cost: anonymous CNBC source; Moonshot CEO says not official. Excluded as a fact.
- xAI Colossus "555,000 GPUs": only aggregator sites; no primary xAI figure. Not used.
- Hugging Face "State of Open Models: Summer 2026" figures (2.96M repos, 83% of downloads under 1B): seen only in secondary summaries.
- Gemini Diffusion 1,479 tokens/s: secondary sources only.
- Mistral torrent launch exact date: 26 vs 27 Sep 2023 in different sources.
- Meta Llama's future (open vs closed "Avocado"): unconfirmed.
- Logos: simple-icons slugs were checked on the simple-icons CDN (v16.36.0, 30 Oct 2026): openai, googlegemini, google, claude, anthropic, meta, x, deepseek, qwen, alibabacloud, kimi, moonshotai, microsoft, deepmind, mistralai, huggingface all exist. No slug exists for xai, grok, gemma, inception. Brand rules for logo use not checked.

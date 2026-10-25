# Quantization reel research (checked 24 Oct 2026)

1. Opus 5.5 released 2026-09-22 (LiveNerf README badge "day 0: 2026-09-22"; pasqualepillitteri.it news 20356).
2. Reddit "nerf" threads began ~2026-09-29 (secondary: pasqualepillitteri.it/en/news/20356). Quantization blamed in anecdotes, unproven.
3. Anthropic: "We never reduce model quality due to demand, time of day, or server load." (Postmortem of three recent issues, Sep 2025; quoted simonwillison.net/2025/Sep/17/anthropic-postmortem). Statement is from 2025, not about 5.5.
4. Opus 5.5 default effort = medium; Opus 5 and earlier = high: "a request that omits effort runs one level lower than it did on Claude Opus 5" (platform.claude.com/docs/en/build-with-claude/effort). Second source: braindetox.kr migration guide, wmedia.es.
5. LiveNerf (github.com/ninjahawk/livenerf, 1,580 stars, created 2026-09-22): daily runs of Opus 5.5 on a frozen 78-question panel since 2026-09-24; windows 1 (days 11-20) +0.7 and 2 (days 21-30) -1.5 points: "no change"; MDE ~6.6-7.5 points per window; window 3 starts 2026-10-24. Limit: could not distinguish an Opus 5 swap. Also: medium effort -26% tokens, -4.2 points; low -62%, -8.3.
6. Qwen3.8-27B: BF16 file 54.66 GB (huggingface.co/Distillio/Qwen3.8-27B-GGUF; orcarouter 54.7 GB). 27e9 x 2 bytes = 54 GB.
7. Q4_K_M: 17.77 GB (Distillio, "recommended default for most use cases"); 17.1 GB (unsloth build, orcarouter). Script says "under eighteen".
8. 16 bits -> 65,536 values; 4 bits -> 16 values (math).
9. Block quantization: groups/blocks of 32 weights each with its own scale (llama.cpp Q4_0 block size 32; K-quants use 256-weight super-blocks of 32-weight sub-blocks).
10. AWQ (Lin et al., MIT Han Lab, arXiv 2306.00978, MLSys 2024 best paper): "a small fraction (0.1%-1%) of salient weights"; protecting 1% salient weights greatly reduces quantization error; scales salient channels up and the matching activations down.
11. canirun.ai: free checker of which local models fit your hardware and at which quantization (everydev.ai/tools/canirun-ai; wiki.iphoster.net).
Illustrative: the example weights 0.70, 0.12, -0.31, 0.04 and 0.0372 (from the reference reel's explanation).

# CARE reel, script v1 for approval (29 Oct 2026)

Reference: Matt Pocock, "Tell your agents to CARE about the codebase" (YouTube Short 9uSygtI-6lw, 13 Oct 2026, 126 s, talking head). The transcript was fetched through a Piped mirror, because YouTube blocked direct downloads.
Arc: connected story. About 201 words, about 62 s. Nadia is invented; her app, patches and rule are illustrative.

L1  Why does an app built with AI get messier with every new feature?
L2  My friend Nadia's AI built her whole app, and now every new feature breaks two old ones. So I looked at her code.
L3  Every time she asked for a feature, the AI stuck a patch on top. And the tests still passed.
L4  After a few months, it looked like this. Programmers call it a big ball of mud.
L5  And it's not just her. In 2024, a GitClear study saw more code copy-pasted than cleaned up, for the first time.
L6  So why would an AI do that? One open coding AI published its training rules. Pass the tests, and it gets a point. Clean code earns nothing extra.
L7  Matt Pocock, a coding teacher whose AI skills have over three hundred thousand saves, thinks most coding AIs learn like this.
L8  But he says the fix is simple. Tell the AI you care about the code, and it gets really good at cleaning up.
L9  So Nadia gave her AI one new rule. Before you add a feature, clean up the code it touches.
L10 Now the job isn't done until the code is clean.
L11 Comment CARE and I'll send you Matt's free skills. Follow for more.

Hooks: A = L1 (pick). B = "One open coding AI published its training rules. Pass the tests, and it gets a point. Clean code earns nothing extra." C = "My friend's AI built her whole app. Now every new feature breaks two old ones."

## Sources
- DeepSWE (Agentica + Together AI, 2025): positive reward "if it submits the final answer and passes all tests". https://together.ai/blog/deepswe
- Matt Pocock's reel: agents are RL-trained on tactical problems and benchmarks, so not incentivised to think long-term; tell them you care and they are "really good at it".
- "Big ball of mud": Foote and Yoder, 1997; Matt says "ball of mud".
- GitClear 2025 AI Copilot Code Quality report: 211 million changed lines 2020-2024; 2024 first year copy/pasted lines exceeded moved lines. Observational. https://www.gitclear.com/ai_assistant_code_quality_2025_research
- github.com/mattpocock/skills: 306,501 stars on 29 Oct 2026, MIT licence; improve-codebase-architecture scans for "deepening opportunities" and never changes code.
- Matt Pocock: GitHub bio "TypeScript wizard. Building Total TypeScript".

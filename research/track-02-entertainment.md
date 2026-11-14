# Track 02: Entertainment. Product opportunity research

*Prepared 2026-11-14 (NFL Week 10, 12 days before Thanksgiving). Research only, no code.*

---

## TL;DR

The coordinator raised the bar mid-research, so I dropped my first-pass leads (a co-op mystery game for couples, a murder-mystery party kit, a family trivia show, an AI game master). They were either on the excluded list or not grounded in real data. The three ideas below pass all five bar tests. Each is built on data the user already has, or on free public APIs that I **tested live today**.

| # | Idea | One-liner | Weighted score | Biggest risk |
|---|------|-----------|---------------|--------------|
| 1 | **Box Score Kids** | A one-page sports paper about your kid's team, printed each morning, written at your kid's exact reading level from last night's real box score, with questions and math built on the real stats. | **7.5 / 10** | The jury may see it as EdTech rather than Entertainment. It also has to beat a free, non-adaptive rival. |
| 2 | **Binder to Battle** (working name; can't use the Pokémon trademark) | Photograph your kid's random trading cards. Get a legal, playable deck built from cards you already own, a 10-minute "teach the first game" script for the parent, and a value and fair-trade check against live market prices. | **7.1 / 10** | Vision may misidentify cards in the live demo. Also IP/trademark risk and thin direct evidence on willingness to pay. |
| 3 | **Rabbit Hole Rescue** | Paste your YouTube watch history. See which hobbies you've been *watching* instead of *doing*, then get a tiny 4-week plan that turns the 10pm scroll slot into the real thing. | **6.7 / 10** | Weak retention, which relies on weekly check-ins. I couldn't verify people asking for it in their own words (search budget ran out). |

**My bet: Box Score Kids.** It has the highest certainty on the 40% "does it work" criterion. The data feed is verified live today, and the math answers are computed in code, not by the LLM. The demo is the strongest of the three: drag a grade slider and watch the same real game story rewrite from 1st-grade to 5th-grade level. The payer is clear (parents already pay for screen-free enrichment), and the loop is a daily breakfast ritual. Binder to Battle has the bigger "wow" but the riskier demo.

---

## 1. Method and caveats (read first)

- **Sources:** about 45 standard-mode web searches covering BLS ATUS, Pew, Nielsen/Gracenote, Deloitte, FSGA, NAEP, company disclosures, app-store listings, Product Hunt and Reddit snippets. I also fetched pages directly and ran **live API calls** (Sleeper, ESPN, NHL, TCGdex, pokemontcg.io) to confirm the data is real.
- **The session's web-search budget ran out partway through.** Evidence that people ask for idea #3 in their own words, plus a few market-size inputs, could not be checked further. Anything unverified is marked **(unverified)** or **(assumption)**.
- **Reddit could not be fetched directly** (blocked). Reddit evidence comes from search-result snippets and secondary write-ups. I name the thread and say how I saw it.
- **Skeptic's note on the track:** willingness to pay is weakest in Entertainment. Adults 25–45 pay reliably for entertainment in only a few places: (a) **things for their kids** (KiwiCo, Lovevery), (b) **sports and fantasy**, (c) **escape from wasted time** (Opal), and (d) premium boxed experiences (Hunt A Killer). All three picks sit in (a), (b) or (c) on purpose.

---

## 2. Track-level context (who has free time, and what wastes it)

| Fact | Number | Source |
|---|---|---|
| TV is the largest leisure activity | 2.6 h/day, more than half of all leisure (2024) | [BLS ATUS 2024](https://www.bls.gov/news.release/archives/atus_06262025.htm), [BLS TED](https://www.bls.gov/opub/ted/2025/time-spent-in-leisure-and-sports-in-2024.htm) |
| Ages 35–44 have the **least** leisure of any age group | 3.8 h/day (25–34: 4.26 h/day) | [BLS ATUS 2024](https://www.bls.gov/news.release/archives/atus_06262025.htm) |
| Time spent picking what to stream | 10.5 min (Nielsen 2023), rising to 12 min (Gracenote 2025). 21% give up and do something else | [NextTV](https://nexttv.com/news/streamers-have-10-minutes-to-find-content-nielsen), [informitv](https://informitv.com/2025/11/05/it-is-becoming-harder-to-decide-what-to-watch/), [CBS](https://www.cbsnews.com/amp/losangeles/news/study-finds-the-many-streaming-choices-overwhelm-audiences-steering-some-to-turn-the-tv-off) |
| Streaming churn | 41% cancelled an SVOD in the last 6 months (millennials 51%). 73% frustrated by price hikes | [TV Tech / Deloitte](https://www.tvtechnology.com/platform/streaming/deloitte-streaming-churn-rises-73-percent-of-subs-are-frustrated-with-svod-price-hikes) |
| Time with friends is collapsing | 34 min/day in 2023 vs 47 min/day 20 years earlier | [Pudding (ATUS)](https://pudding.cool/2023/09/invisible-epidemic/), [Kannan & Veazie 2023](https://pubmed.ncbi.nlm.nih.gov/36618547/) |
| Revenge bedtime procrastination | 96% stay up late on purpose. 63% say night is "the only time for myself". 34% cite a scrolling rabbit hole. 42% always or often regret it | [Talker Research](https://talkerresearch.com/sleep-thieves-americans-lose-hundreds-of-hours-a-year-to-late-night-scrolling/) |
| Parents and screens | Parents lean toward "too much" screen time for kids. 4 in 10 say they could do better. Focus-group quote: *"I feel guilty because even if it's 15 or 20 minutes on the tablet, that's time we could spend together."* | [Pew, Oct 2025](https://www.pewresearch.org/internet/2025/10/08/how-parents-manage-screen-time-for-kids/) |
| Kids reading for fun | 37% of 9-year-olds read for fun almost daily (2025) vs 53% in 1984. 13-year-olds: 14% | [NAGB / NAEP 2026 release](https://www.nagb.gov/news-and-events/news-releases/2026/naep-long-term-trend-assessments-show-different-trends-for-9-and-13-year-olds.html) |
| Fantasy sports | 18% of US adults played in the last 12 months. Average age 42.4. 74% male | [FSGA 2025](https://thefsga.org/fsgas-2025-research-fantasy-sports-womens-betting-social-sportsbooks) |

---

## 3. Candidate pains (12) and how each did against the bar

Bar tests: **(1)** not on the excluded list · **(2)** a specific person at a specific moment · **(3)** grounded in user or public data · **(4)** people asking in their own words · **(5)** no well-funded B2C competitor doing exactly this.

| # | Pain (who, when) | Evidence | Top competitors | Gap they leave | Verdict |
|---|---|---|---|---|---|
| A | **Sports-mad kid who won't read; parent wants screen-free breakfast** | NAEP decline; Pew screen-time guilt; a dad built a printable kids' sports report for his sons and friends asked for copies; Smallball pitches itself to "parents who miss SI for Kids" | My Sports Report (free), Bedtime Baseball ($5/mo tier), Smallball (free Substack), SI Kids (bi-monthly print) | None adapt to the child's **reading level**, none generate comprehension or math from the real stats, none personalize | **TOP 3 (#1)** |
| B | **Parent and kid with a random pile of trading cards** (Christmas, birthday, a secondhand lot) | r/ptcgo "My 6yo cried": a parent with ~400 secondhand cards asking how to make a deck; Penny Arcade "how to help my daughter get started"; many "first deck for parents and kids" guides | Dragon Shield, POKO, Poke Delver, Dex, Deckify, TCGplayer app (scanners with **manual** deck builders) | Nobody **auto-builds** a deck from what you own **and** coaches the parent | **TOP 3 (#2)** |
| C | **Post-bedtime doom-scrolling; downtime feels stolen** | Talker Research (96% / 63% / 34% / 42%); Opal: 100K+ Pro subscribers and about $10M ARR | Opal, one sec, ScreenZen, Freedom, Brick (all *block*); YouTube or TikTok "wrapped" analyzers (stats only) | Nobody turns *what you binge* into *what you do* | **TOP 3 (#3)** (own-words evidence unverified) |
| D | Choice paralysis over what to stream | Nielsen 10.5 min, Gracenote 12 min, 21% give up | JustWatch, Reelgood, Letterboxd, the platforms themselves | Saturated | **Excluded** (what-to-watch picker) |
| E | Streaming-subscription bloat and churn | Deloitte 41% churn, 73% frustrated | Rocket Money, JustWatch, Reelgood | A "rotation calendar" tied to the shows you follow | Grounded, but the LLM isn't the engine and willingness to pay is weak. **Not top.** |
| F | Couples default to "parallel scrolling"; no date nights | 52% of married couples rarely or never have a date night ([Date Night Opportunity / IFS](https://ifstudies.org/blog/date-your-spouse-and-stay-happily-married)); phone distraction linked to marital problems ([IFS](https://ifstudies.org/report-brief/more-scrolling-more-marital-problems-less-sex-more-divorce-worries-for-couples-distracted-by-phones)); "parallel scrolling" ([The Star/HuffPost](https://thestar.com.my/tech/tech-news/2024/05/06/this-annoying-habit-could-be-damaging-your-relationship-experts-say)) | Paired (est. $10K–$200K/mo, [AppGoblin](https://appgoblin.info/apps/1469609343/trends)), Datebox ($32–40/mo, "10,000 couples", [PH](https://www.producthunt.com/products/datebox)), Crated with Love, WNRS (>1M sold, [site](https://www.werenotreallystrangers.com/pages/couples-edition)), Desire, We2 | No AI co-op mystery for two exists, but it is ungrounded fiction | **Excluded** (date-night planner / interactive fiction) |
| G | At-home mystery for adults (true-crime fans) | Hunt A Killer $27.3M in 2019 revenue, 100K+ subscribers ([Yahoo](https://www.yahoo.com/now/murder-mystery-game-making-killing-125944401.html), [Fox Business](https://www.foxbusiness.com/lifestyle/hunt-a-killer-murder-mystery-game-52-55-million-coronavirus)); Deadbolt $34.99/mo ([shop](https://shop.deadboltmysterysociety.com/collections/subcription-plans)); Murdle >4M copies ([Arkansas Business](https://www.arkansasbusiness.com/article/gt-karber-murdle-success/)); EXIT >4M by 2019 ([Tabletop Gaming](https://tabletopgaming.co.uk/News/escape-room-series-exit-the-game-has-now-sold-over-four-million-copies)) | The Last Question, AI Noir, One Way Mirror, LLM Noire, DeepClue ([AlternativeTo](https://alternativeto.net/software/the-last-question/about/), [AI Noir](https://ainoir.datumbox.com/)) | Crowded with indie AI detective games | **Excluded-adjacent**; strong willingness to pay but fails grounding |
| H | Hosting friends: party and murder-mystery kits | Etsy kits, Freeform Games | Mystery Shaper, Murder Mystery Game AI, a custom-mystery launch on PH (Dec 2025) ([AlternativeTo](https://alternativeto.net/software/mystery-shaper/about), [PH](https://www.producthunt.com/@mystery_partygame)) | Already done | **Excluded** |
| I | Adult friendships fading; the fantasy league as the last thread | Fantasy leagues sustain friendships ([qualitative study](https://www.ebsco.com/articles/sports-and-leisure/57b4d1cb-0995-52c4-9ab1-6f0714a9ecdc/a-qualitative-examination-of-the-social-manifestations-of-participating-in-fantasy-sports), [Pushkin](https://www.pushkin.fm/news/why-your-dads-fantasy-football-league-might-be-saving-his-life)); Pew: men contact friends less often ([Pew 2025](https://www.pewresearch.org/social-trends/2025/01/16/men-women-and-social-connections/)) | AI league recaps already built many times: Commish, LeaguePulse (Next.js + Anthropic, "AI media desk"), League Rewind (iOS), LeagueBeat, FFWrapped, League Legacy, a 2026 solo-hackathon "Fantasy Spotlight"; Sleeper has native all-time history; ESPN watsonx and Yahoo AI Game Breakdowns | AI recaps are commoditized | **Fails originality.** Other teams will build this. I reuse the Sleeper data as a **feature of #1** ("Dad's fantasy team" page). |
| J | Adult TTRPG groups can't schedule; the DM burns out | Common, widely known | Friends & Fables ($15/mo Hero, ~492K visits/mo est.), AI Realm, Everweave, FableAI, AI Dungeon ([fables.gg](https://fables.gg/blog/ai-realm-vs-friends--fables-plan--feature-comparison)) | Saturated | **Excluded** (AI dungeon master) |
| K | Rainy-weekend kid boredom; parent out of ideas | Pew screen-time guilt; KiwiCo >$1B lifetime ([Fortune](https://fortune.com/2024/10/14/toy-brand-kiwico-surpassed-1-billion-lifetime-revenue/)); Lovevery $221M revenue, 375K subscribers ([Fast Company](https://www.fastcompany.com/91036695/lovevery-most-innovative-companies-2024)) | Clue Ninja, Super Treasure Hunt, Let's Roam in-home, Etsy printables ([Clue Ninja](https://microlaunch.net/p/clueninja), [Super Treasure Hunt](https://www.afterschoolactivitiesforkids.com/games/super-treasure-hunt)) | Personalization exists already; ungrounded | Weekend-planner-adjacent; **not top** |
| L | A football newcomer (partner, in-law, kid) watching with the family at Thanksgiving | Not verified (search budget ran out) | NFL alternate broadcasts, YouTube explainers | A live play-by-play "explain like I'm new" second screen. ESPN play-by-play is available (verified) | Novel and well-timed, but no willingness-to-pay evidence. **Reserve idea.** |

Other comparables checked: NYT Games $4.99/mo standalone, no subscriber breakdown disclosed ([Nieman Lab](https://www.niemanlab.org/2025/09/the-new-york-times-launches-a-family-subscription-with-separate-wordles-for-everyone/), [A Media Operator](https://www.amediaoperator.com/analysis/wordle-tv-show-new-york-times-games-jonathan-knight/)). Jackbox: about 200M players at the pandemic peak, sales declining since ([Bloomberg](https://www.bloomberg.com/news/articles/2020-10-20/jackbox-games-benefits-from-retro-style-party-games-in-pandemic), [GameDev.net](https://gamedev.net/news/4677/)).

---

## 4. Top 3 in detail

### Idea #1: Box Score Kids

**Pitch.** Every morning: a printable one-page sports paper about your kid's team, written at your kid's exact reading level from last night's real box score, with reading questions and math built on the real stats.

**Persona and trigger.** Mike, 38, a project manager outside Buffalo, lifelong Bills fan. His son Leo, 8, is in 2nd grade. Leo knows every Bills starter's jersey number but reads below grade level and fights his 20 minutes of reading homework. **Trigger:** Monday 7:10am at breakfast. Leo grabs Mike's phone to "check the score", it turns into YouTube Shorts, and the morning derails. Second trigger: a parent–teacher conference ("Leo needs to read every day; find what he's into").

**The pain, with evidence.**
- Reading for fun is collapsing: 37% of 9-year-olds read for fun almost daily in 2025, down from 53% in 1984 ([NAGB](https://www.nagb.gov/news-and-events/news-releases/2026/naep-long-term-trend-assessments-show-different-trends-for-9-and-13-year-olds.html), [AmAcad](https://www.amacad.org/humanities-indicators/public-life/youth-reading-fun)).
- Parents feel screen-time guilt ([Pew 2025](https://www.pewresearch.org/internet/2025/10/08/how-parents-manage-screen-time-for-kids/)).
- Sports media is a recognized way in for reluctant readers. A teacher in the ALAN journal ([VT](https://scholar.lib.vt.edu/ejournals/ALAN/v41n1/brown.html)); a parent whose son lost interest in SI Kids but read articles they traded back and forth ([Reformed Broker comments](https://thereformedbroker.com/2019/03/06/the-breakthrough/comment-page-2)); a r/parenting thread on an 8-year-old with no interest in books, where commenters said "find what he's into" ([Scary Mommy write-up](https://www.scarymommy.com/parenting/kid-hates-reading-parent-tips)); sports trivia books recommended for very reluctant readers ([GreatSchools](https://www.greatschools.org/gk/parenting/reading/tips-for-reluctant-readers/)).
- **People building it for themselves (the strongest own-words signal):** *My Sports Report* was "founded by Dave, a dad who first built it for his own sons", and then friends asked for copies. Testimonial: "Dad of three sports-obsessed kids… the kids read it at breakfast" ([site](https://mydailysportsreport.pages.dev/)). *Smallball* is a free daily Substack "for kids who love sports. And parents who miss SI for Kids" ([Reletter](https://reletter.com/publications/smallball)). *Bedtime Baseball* parent: "There are so few things that my three-year-old and I both enjoy, yet somehow we both get really excited about a big game" ([newsletter](https://bedtimebaseball.beehiiv.com/p/use-bedtime-sports-93c6)).

**What they pay for and at what price.**
- Free: one paper a week, one team, one kid.
- **Family plan, $5.99/mo or $49/yr:** daily papers for up to 3 kids at different levels; multiple teams and sports; auto-print to the home printer's email address; a weekly reading log with level progression; an optional "Dad's/Mom's fantasy team" page from a Sleeper username.
- Upsell: an end-of-season printed keepsake book, about $29.
- Willingness-to-pay comparables: Bedtime Baseball's $5/mo supporter tier (same audience, hand-written content); Lovevery at $221M revenue and 375K subscribers, and KiwiCo at >$1B lifetime, show parents pay for screen-light enrichment.
- **Honest caveat:** the closest rival (My Sports Report) is free. Payment has to come from adaptive reading, progress tracking and multiple kids, not from scores.

**Retention loop.**
- It's a daily habit, and the **kid** pulls for it, not the parent.
- It covers sports year-round: NFL Sep–Feb, NBA and NHL Oct–Jun, MLB Mar–Oct, plus college, WNBA and MLS.
- Reading level moves up as the child improves (a visible progress bar for the parent).
- Weekly parent email: "Leo read 6 papers, 1,140 words, moved up to level 2.4."

**Rough market math.**
- About 24M US children aged 6–11 (≈4M per year of age, Census; approximate).
- Assume 35% follow a pro or college team: about 8M kids, about 5.5M households **(assumption)**.
- At $49/yr: 5% penetration ≈ $13M ARR; 20% ≈ $54M.
- **$100M ARR is not plausible on sports alone.** It is plausible only by growing into an "interest-driven reading engine" fed by other public data (space launches via the Launch Library API, weather, animals, video-game news) and a classroom licence (B2B2C). Sports is the wedge.

**Acquisition, and does LTV beat CAC?**
- Channels: team-fan subreddits and parent Facebook groups; reading specialists and teachers recommending it to reluctant readers; youth-sports parent communities. Gift subscriptions for Thanksgiving and Christmas (timely).
- Built-in virality: the kid carries the printed page to school, and other parents ask about it.
- **CAC** about $25–40 on paid social, lower via teachers and word of mouth. **LTV** ≈ $49 × ~1.8 years × ~85% gross margin ≈ $75. **LTV/CAC ≈ 2–3×.**
- AI cost is close to zero: generate once per game × reading level, cache it, and personalize only the name and questions.

**Competitors and what's new.**
- Competitors: My Sports Report (free; scores, standings and recaps; not reading-level adaptive); Bedtime Baseball (weekly hand-written read-aloud stories); Smallball (free, one size fits all); SI Kids (bi-monthly print, generic, [PressReader](https://www.pressreader.com/usa/sports-illustrated-kids)); FOX and ESPN personalized newsletters and The Playbook ([site](https://theplaybookam.pages.dev/)), which are for adults.
- **No well-funded B2C player doing this was found.**
- New: real game facts, rewritten to a *measured* reading level, with comprehension and math computed from the real box score, printed on paper.

**Magic moment (no login, under 60 seconds).**
1. On landing: pick a team, type the kid's first name, pick a grade (K–6).
2. About 10–15 seconds later: a newspaper-style page, "THE LEO LEDGER". It has a headline, a 150-word story at a 2nd-grade level, a "Player of the Game" card with real stats, 3 comprehension questions, and 2 math questions ("Jayden Daniels threw 3 TD passes. Each TD is 6 points. How many points is that?"). Then **Print**.
3. **The wow:** drag the grade slider from 1 to 5 and watch the *same real game* rewrite itself, with the readability score updating live.

**What the real core does (AI plus data).**
- **ESPN public site API**, no key. **Tested today:** the Week 10 scoreboard, and a full game summary for Commanders at Giants with box score, 7 scoring plays, 24 drives, leaders, standings and win probability. The NHL API (`api-web.nhle.com`) and ESPN NBA endpoints were also tested and working. MLB Stats API covers baseball season.
- **Sleeper public API**, no key. **Tested today:** returns 2026 Week 10. Used for the optional parent fantasy page.
- **Claude** (Haiku for volume, Sonnet for quality) writes from a facts-only JSON.
- Code computes the readability grade (Flesch–Kincaid) and re-prompts until the text is within the target band.
- Code computes the math answers from the box score, never the LLM.
- Code checks the output: every name and number must appear in the box score.
- Output is HTML with print CSS, then browser print or PDF. Everything is free and usable within 24 hours.

**Build risk: LOW.**
- **Track fit:** frame it as "family sports fandom plus screen-free downtime", not EdTech.
- **ESPN's API is undocumented:** fine for a hackathon; a licensed feed (Sportradar or SportsDataIO) is needed at scale.
- **Hallucinated facts:** handled by the fact check above.
- **COPPA:** parent-only accounts, the child's first name only.
- **Novelty fade:** handled by level progression and multi-sport coverage.

**Why another team is unlikely to build it:** teams that reach for sports APIs will default to adult fantasy recaps. Pairing live box scores with reading-level control for kids crosses Entertainment with literacy, and an LLM rarely suggests that for an "Entertainment" brief.

| Criterion (weight) | Score | Why |
|---|---|---|
| Does it work (40%) | 8.5 | Data verified live; deterministic checks; low build risk; strong demo |
| What do we sell (20%) | 7 | Clear family plan and daily ritual; a free rival caps pricing |
| Who do we sell to (15%) | 8 | A very specific parent, kid and moment |
| Why it makes money (15%) | 5.5 | Sports alone tops out around $50M; $100M needs expansion |
| Is it new (10%) | 7 | Rivals exist, but none adapt reading level or generate questions from stats |
| **Weighted total** | **7.5** | |

---

### Idea #2: Binder to Battle (trading-card "pack to play" for parents and kids)

**Pitch.** Photograph your kid's random cards. Get a legal, playable deck built only from cards you own, a 10-minute "teach the first game" script for the parent, and a value and fair-trade check, all grounded in a real card database with today's market prices.

**Persona and trigger.** Jen, 36, an ER nurse with kids aged 7 and 10. She played Pokémon on a Game Boy but never the card game. **Trigger:** Christmas afternoon. The kids got booster packs and a bulk lot. They beg her to play, the cards are a random pile, nobody knows the rules, and the 7-year-old melts down. **Recurring trigger:** her son comes home from school after trading a card. Was it fair?

**The pain, with evidence (own words).**
- r/ptcgo, **"My 6yo cried"**: a parent who bought about 400 secondhand cards for a 6-year-old asks how to make a deck. Replies say to build a Standard-legal deck from the pile plus a few staples. (Seen via a search-result mirror; direct Reddit fetch was blocked. Canonical URL: https://www.reddit.com/r/ptcgo/comments/u9z4wf/my_6yo_cried/)
- A r/pkmntcg post asks for a "flip through your binder and build a fun little deck" format (search snippet).
- Penny Arcade forum: "Pokemon TCG: how to help my daughter get started" ([thread](https://forums.penny-arcade.com/discussion/181347/pokemon-tcg-how-to-help-my-daughter-get-started)).
- meh.com: "Too many options for Pokémon TCG — tell me what I should buy" ([thread](https://meh.com/forum/topics/too-many-options-for-pokmon-trading-card-game---tell-me-what-i-should-buy)).
- A whole genre of "first deck for parents and kids" guides points to demand ([House of Cards](https://houseofcards.ca/blogs/magic-the-gathering/building-your-first-pokemon-deck-a-guide-for-parents-and-kids), [GeekDad](https://geekdad.com/2014/06/guide-to-pokemon-deck-building/)).
- Physical card play is screen-free family time, which answers the guilt in Pew's 2025 report.

**What they pay for and at what price.**
- Free: scan one binder page (9 cards) and get values.
- **Trainer Club, $4.99/mo or $39/yr per family:** unlimited scans; full-collection inventory; auto-built decks per kid, with **sibling fair-fight balancing** so the 7-year-old's deck can beat the 10-year-old's; a cheat sheet tuned to the actual deck; a trade checker; and "upgrade under $10" suggestions with TCGplayer affiliate links.
- Willingness-to-pay comparables: scanner and collection apps sell Pro tiers (for example, TCGstacked Pro offers "unlimited decks, AI card customizations", [site](https://www.tcgstacked.com/pokemon/card-scanner-app); POKO, Dragon Shield and Dex also have paid tiers, prices unverified).
- **Honest caveat:** I found no hard willingness-to-pay data for *parent-facing* card tools. This is the thinnest money evidence of the three.

**Retention loop.**
- New packs arrive constantly (allowance, birthdays, holidays). New sets come out several times a year.
- **The Standard format rotates every year** (by regulation mark), and the tool re-checks deck legality automatically.
- Trades happen weekly at school. A weekly "family battle night" has a progression track.

**Rough market math.**
- **(assumption)** about 5–7M US households have an active kid collector aged 6–12. (The Pokémon Company reports tens of billions of cards produced; the exact figure renders client-side on its [figures page](https://corporate.pokemon.co.jp/en/aboutus/figures/) and could not be extracted.)
- At $39/yr: 5% of 6M ≈ **$11.7M ARR**, plus affiliate revenue (300K families × $200/yr in card spend × ~5% ≈ $3M).
- $100M needs adult collectors (the millennial nostalgia wave) and other card games (Lorcana, One Piece, MTG families). **A realistic ceiling is $30–60M; $100M is a stretch.**

**Acquisition, and does LTV beat CAC?**
- Holiday SEO is high-intent (searches like "how to build a pokemon deck from my cards" already return many guides).
- Parent and collector creators on YouTube and TikTok; local game stores (league nights, referral split); parent Facebook groups.
- **CAC** about $15–30 with an organic-heavy mix. **LTV** ≈ $39 × 1.5 years × 85% plus affiliate ≈ $55–60. **LTV/CAC ≈ 2–3×.**

**Competitors and what's new.**
- Competitors: Dragon Shield scanner ("build decks, track collection", [App Store](https://apps.apple.com/us/app/id1199495742)), POKO ([App Store](https://apps.apple.com/us/app/id6446088167)), Poke Delver (exports to Limitless and PokemonCard.io, [App Store](https://apps.apple.com/us/app/-/id6736618646)), Dex (draw odds, [App Store](https://apps.apple.com/app/id1555489854)), Poké Pricer ([App Store](https://apps.apple.com/us/app/-/id6744259439)), Deckify ([App Store](https://apps.apple.com/us/app/-/id6748853103)), the TCGplayer app, and Pokémon TCG Live (digital cards only).
- **Judging by their listings, all of these deck builders are manual.**
- No funded B2C player auto-builds from an owned physical collection *and* coaches the parent. (Checked at the app-listing level only.)

**Magic moment (no login, under 60 seconds).**
1. "Try our sample binder page", or upload a photo.
2. About 20 seconds later: 9 cards identified, each with today's TCGplayer market price, plus a warning such as "This Black Star promo Pikachu is worth about $35. Don't trade it for a common!"
3. **Build my deck** gives a 60-card list (or a 30-card "mini-deck" if the pile is small) and "Your first game in 10 minutes": setup, turn order, and what to do on turn 1, in plain language.

**What the real core does (AI plus data).**
- **Claude vision** (Sonnet) reads the card name, HP, attack names and collector number. The match is then confirmed against **TCGdex** (free, no key, MIT-licensed database, [tcgdex.dev](https://tcgdex.dev/), [GitHub](https://github.com/tcgdex/cards-database)).
- **Tested today:** TCGdex returned Surging Sparks *Pikachu ex*, `standard: true`, regulation mark H, HP 200, with **TCGplayer and Cardmarket prices updated 2026-11-14**.
- Deck building is **deterministic code** enforcing the rules: 60 cards, at most 4 of any card except basic Energy, at least 1 Basic, evolution lines kept intact, Energy types matched. Claude only explains strategy and writes the teaching script.
- **Key finding that other teams will trip on:** the long-standard **pokemontcg.io API now shows "Now part of Scrydex" and returned HTTP 502 today**. Anyone following old tutorials will hit a dead API.

**Build risk: MEDIUM.**
- **Misidentification** (holo glare, tiny collector numbers): show a confirm/correct step and use a pre-tested sample photo for the jury.
- **Thin piles:** support mini-decks and suggest "add N basic Energy".
- **IP and licensed content (flagged):** Pokémon trademarks and card art. Keep the brand out of the product name, rely on card text, and get a legal review before launch.
- **Seasonality:** a December spike.

**Why another team is unlikely to build it:** it needs card-game domain knowledge (legality, regulation marks, deck rules) and the discovery that the default Pokémon API is dead. LLMs don't suggest card-game helpers for an "Entertainment" brief.

| Criterion (weight) | Score | Why |
|---|---|---|
| Does it work (40%) | 7.5 | Data verified live; the vision step is the demo risk |
| What do we sell (20%) | 6.5 | Clear club plus affiliate; weekly-ish use |
| Who do we sell to (15%) | 8 | A sharp persona and a Christmas trigger |
| Why it makes money (15%) | 5.5 | Thin willingness-to-pay evidence; ceiling about $30–60M without expansion |
| Is it new (10%) | 7.5 | Auto-build from what you own plus parent coaching appears new |
| **Weighted total** | **7.1** | |

---

### Idea #3: Rabbit Hole Rescue (turn what you binge into what you do)

**Pitch.** Paste your YouTube watch history. See which hobbies you've been watching instead of doing, then get a tiny 4-week plan that turns your 10pm scroll slot into the real thing, using the videos you already watched as the tutorial.

**Persona and trigger.** Sam, 35, a marketing manager. Kid asleep by 8:30. From 9:30 to 12:15 he watches woodworking, sourdough and guitar-cover videos. **Trigger:** the Sunday morning iPhone Screen Time weekly report ("Daily average 5h 41m, up 18%"), or the 12:40am "where did my night go" moment.

**The pain, with evidence.**
- Talker Research (n=2,000): 96% stay up late on purpose, about 3.5 nights a week; 63% say night is the only time for themselves; 34% blame a scrolling rabbit hole; 42% always or often regret it ([Talker](https://talkerresearch.com/sleep-thieves-americans-lose-hundreds-of-hours-a-year-to-late-night-scrolling/)).
- 56% say they lack personal time ([Amerisleep](https://amerisleep.com/blog/revenge-bedtime-procrastination-survey/)).
- 35–44-year-olds have the least leisure of any age group ([BLS](https://www.bls.gov/news.release/archives/atus_06262025.htm)), so wasting it hurts most.
- Bed is the most common place people phub their partner ([Futurism / The Conversation](https://futurism.com/the-byte/phub-smartphone-relationships)).
- **Own-words evidence is UNVERIFIED.** The search budget ran out. Before committing, run a 10-minute check of r/nosurf for "I watch videos about hobbies instead of doing them".

**What they pay for and at what price.**
- Free: one analysis plus a shareable "Scroll Receipt".
- **$5.99/mo or $39/yr:** weekly session plans, a Sunday re-analysis ("scroll hours down, hobby hours up"), project arcs, and a partner mode that finds the overlap between two histories and suggests a shared project.
- Willingness-to-pay comparable: **Opal**, with 100K+ Pro subscribers, about 1M daily active users and about $10M ARR ([Opal 2024 review](https://opalapp.com/blog/keynote-01-opals-year-in-focus-2024), [RevenueCat podcast](https://www-docs.revenuecat.com/blog/growth/kenneth-schlenker-sub-club-podcast-2026/)). That proves adults pay to get their time back.

**Retention loop.** Scheduled sessions (Tue and Thu, 9:30pm); a 2-minute Sunday paste-in check; streaks; a new 4-week arc after each project. **This is the weakest loop of the three because it depends on the user coming back to report.**

**Rough market math.**
- About 90M US adults aged 25–44. Taking the 42% who regret late scrolling gives about 35M people with the pain.
- 1% paying $39 ≈ $14M; 3% ≈ $41M; $100M needs about 7%. **A stretch.**
- Opal's $10M ARR after several years suggests a real but modest category ceiling.

**Acquisition, and does LTV beat CAC?**
- The shareable Scroll Receipt is a Wrapped-style viral loop ("61 hours of woodworking this year = 4 tables you didn't build").
- Creators in the "dopamine detox" niche.
- **CAC** is low if receipts spread, otherwise $20–40. **LTV** about $45. **LTV/CAC is borderline, about 1–2×.**

**Competitors and what's new.**
- Competitors: Opal, one sec, ScreenZen, Freedom and Brick all *block* (subtract), and they live on mobile. YouTube and Takeout "wrapped" analyzers show stats only. Skillshare and MasterClass sell generic courses.
- Nobody was found converting a watch history into a hobby plan (the search was capped, so verify).
- New: it inverts the problem by using the binge as evidence of what you'd love doing.

**Magic moment (no login, under 60 seconds).** Either "try a sample history", or select all on youtube.com/feed/history and paste. About 20 seconds later the user sees:
- the Scroll Receipt (hours by topic);
- the top 3 "latent hobbies" ("38 sourdough videos in 3 weeks");
- their nightly spiral pattern;
- "Tuesday: 25 minutes, $12 of supplies, step 1", linked to videos they already watched.

**What the real core does (AI plus data).**
- The data is the user's own history: pasted text, or a Google Takeout `watch-history.json` with titles, channels and timestamps. **The YouTube Data API does not expose watch history**, so pasting or uploading is the only route.
- Video durations come from the YouTube Data API `videos.list` (free quota).
- Claude clusters topics, separates "aspirational how-to" from pure entertainment, and writes the plan.
- Code computes counts and a time-of-night histogram.
- **Build risk: LOW–MEDIUM.**
  - **Privacy:** watch history is intimate; process it ephemerally and on the client where possible.
  - **Takeout delay:** exports take hours, so the paste path is required for the demo.
  - **Retention and the evidence gap** (see above).

**Why another team is unlikely to build it:** for doom-scrolling, an LLM defaults to a blocker or a "mindful scrolling coach" chatbot. Mining the user's own history for hobbies they haven't started is a non-obvious inversion.

| Criterion (weight) | Score | Why |
|---|---|---|
| Does it work (40%) | 7.5 | Simple pipeline; the paste path makes the demo instant |
| What do we sell (20%) | 5.5 | Weakest return loop |
| Who do we sell to (15%) | 7 | A clear moment; the audience is broad |
| Why it makes money (15%) | 5.5 | Opal is the comparable; the ceiling is modest |
| Is it new (10%) | 7 | A real inversion of the blocker category |
| **Weighted total** | **6.7** | |

---

## 5. Head-to-head and recommendation

| | Box Score Kids | Binder to Battle | Rabbit Hole Rescue |
|---|---|---|---|
| Data verified live today | ESPN, NHL, Sleeper ✅ | TCGdex ✅ (pokemontcg.io dead ❌) | User's own paste ✅ |
| Demo risk | Low | Medium (vision) | Low |
| Payer clarity | Parent ✅ | Parent ✅ | Self (category proven by Opal) |
| Frequency | Daily | Weekly-ish | Weekly (self-reported) |
| Timeliness | NFL Week 10, holiday gift subscriptions | Christmas pack-opening | New Year's resolutions |
| Own-words evidence | Good (builders, taglines, parent quotes) | Good (r/ptcgo, forums) | **Unverified** |
| Funded competitor | None found | None found (manual builders only) | None found (blockers only) |
| **Weighted** | **7.5** | **7.1** | **6.7** |

**I would bet on Box Score Kids.**
- 40% of the score is "does it work", and this idea is the most certain to be real end to end: free data verified live today, math and facts checked in code, almost no AI cost thanks to caching.
- The demo is memorable and easy to grasp: the grade slider rewrites a real game in real time.
- It sells to the strongest payer in this track (parents buying screen-free enrichment), and the child drives a daily ritual.
- It uses the season (NFL now, holiday gift subscriptions) without being a fantasy recap, which several other teams will likely build.
- **Pitch it as "turn your kid's sports obsession into a daily reading habit that isn't a screen"** to keep it inside the Entertainment track.
- **Fallback:** if the team wants the bigger "wow" and can accept vision risk, build Binder to Battle, test it hard on a sample photo, and check card identity against TCGdex.

## 6. Quick validation before building (≤30 min, once search is available again)

1. Box Score Kids: search r/Parenting, r/daddit and r/Teachers for "sports articles for kids reading level" and "son only reads about sports". Check whether My Sports Report has added AI or reading levels.
2. Binder to Battle: search "app that builds a deck from my collection". Check Collectr's current feature set.
3. Rabbit Hole Rescue: search r/nosurf for "watch hobby videos instead of doing". Check whether any Takeout analyzer suggests hobbies.

---

## 7. Sources

**Time use and media**
- BLS ATUS 2024: https://www.bls.gov/news.release/archives/atus_06262025.htm
- BLS TED: https://www.bls.gov/opub/ted/2025/time-spent-in-leisure-and-sports-in-2024.htm
- Nielsen 10.5 min: https://nexttv.com/news/streamers-have-10-minutes-to-find-content-nielsen
- Gracenote 12 min: https://informitv.com/2025/11/05/it-is-becoming-harder-to-decide-what-to-watch/
- CBS on Nielsen: https://www.cbsnews.com/amp/losangeles/news/study-finds-the-many-streaming-choices-overwhelm-audiences-steering-some-to-turn-the-tv-off
- Deloitte churn (TV Tech): https://www.tvtechnology.com/platform/streaming/deloitte-streaming-churn-rises-73-percent-of-subs-are-frustrated-with-svod-price-hikes
- Deloitte 2025 report: https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html

**Friendship and fantasy**
- Pew 2023 friendship: https://www.pewresearch.org/short-reads/2023/10/12/what-does-friendship-look-like-in-america/
- Pew 2025 men, women and social connections: https://www.pewresearch.org/social-trends/2025/01/16/men-women-and-social-connections/
- American Survey Center: https://www.americansurveycenter.org/newsletter/americas-friendship-recession-is-weakening-civic-life/
- Pudding: https://pudding.cool/2023/09/invisible-epidemic/
- Kannan & Veazie 2023: https://pubmed.ncbi.nlm.nih.gov/36618547/
- FSGA 2025: https://thefsga.org/fsgas-2025-research-fantasy-sports-womens-betting-social-sportsbooks
- FSGA demographics: https://thefsga.org/industry-demographics
- Fantasy and friendship study: https://www.ebsco.com/articles/sports-and-leisure/57b4d1cb-0995-52c4-9ab1-6f0714a9ecdc/a-qualitative-examination-of-the-social-manifestations-of-participating-in-fantasy-sports
- Pushkin: https://www.pushkin.fm/news/why-your-dads-fantasy-football-league-might-be-saving-his-life
- Yahoo AI Game Breakdowns: https://www.yahooinc.com/press/yahoo-sports-bolsters-the-box-score-with-ai-powered-game-breakdowns
- ESPN watsonx: https://betanews.com/2025/09/24/espn-fantasy-football-adds-ai-powered-weekly-insights-from-ibm-watsonx/
- League Rewind: https://apps.apple.com/app/id6499177011
- Commish: https://awesome.ecosyste.ms/projects/github.com%2Fjeisey%2Fcommish
- LeaguePulse: https://github.com/ebrown-32/LeaguePulse
- LeagueBeat: https://apps.apple.com/pg/app/leaguebeat/id6749873508
- FFWrapped: https://www.producthunt.com/posts/ffwrapped
- Fantasy Spotlight: https://jonathanblum.notion.site/Fantasy-Spotlight-31cefe61f219808a8bb5f06193dddaef
- League Legacy: https://buildingthelegacy.substack.com/p/league-legacy-v5
- Sleeper league history: https://support.sleeper.com/en/articles/3204499-league-history-and-weekly-reports

**Couples, mystery and party games**
- IFS date nights: https://ifstudies.org/blog/date-your-spouse-and-stay-happily-married
- National Marriage Project on date nights: https://www.datingnews.com/industry-trends/national-marriage-project-shows-date-nights-make-for-happy-marriages/
- IFS phones and marriage: https://ifstudies.org/report-brief/more-scrolling-more-marital-problems-less-sex-more-divorce-worries-for-couples-distracted-by-phones
- Parallel scrolling: https://thestar.com.my/tech/tech-news/2024/05/06/this-annoying-habit-could-be-damaging-your-relationship-experts-say
- Partner phone distraction: https://www.psypost.org/how-partner-smartphone-distractions-erode-household-harmony/
- Phubbing: https://futurism.com/the-byte/phub-smartphone-relationships
- Paired estimates: https://appgoblin.info/apps/1469609343/trends
- Datebox: https://www.producthunt.com/products/datebox
- Crated with Love: https://abc30.com/post/crated-with-love-fresno-date-night/10688361/
- Date-night box roundup: https://twodrifters.us/blog/best-date-night-subscription-boxes.html
- WNRS: https://www.werenotreallystrangers.com/pages/couples-edition
- Hunt A Killer (Yahoo): https://www.yahoo.com/now/murder-mystery-game-making-killing-125944401.html
- Hunt A Killer (Fox Business): https://www.foxbusiness.com/lifestyle/hunt-a-killer-murder-mystery-game-52-55-million-coronavirus
- Hunt A Killer (PitchBook): https://pitchbook.com/profiles/company/231883-39
- Deadbolt: https://shop.deadboltmysterysociety.com/collections/subcription-plans
- Murdle (Arkansas Business): https://www.arkansasbusiness.com/article/gt-karber-murdle-success/
- Murdle (The Bookseller): https://thebookseller.com/nibbies-through-the-years/murdle-overall
- EXIT: https://tabletopgaming.co.uk/News/escape-room-series-exit-the-game-has-now-sold-over-four-million-copies
- Mystery Shaper: https://alternativeto.net/software/mystery-shaper/about
- Custom murder mystery (PH): https://www.producthunt.com/@mystery_partygame
- The Last Question: https://alternativeto.net/software/the-last-question/about/
- AI Noir: https://ainoir.datumbox.com/
- LLM Noire: https://www.producthunt.com/products/llm-noire/launches
- NYT Games (Nieman Lab): https://www.niemanlab.org/2025/09/the-new-york-times-launches-a-family-subscription-with-separate-wordles-for-everyone/
- NYT Games (A Media Operator): https://www.amediaoperator.com/analysis/wordle-tv-show-new-york-times-games-jonathan-knight/
- Jackbox (Bloomberg): https://www.bloomberg.com/news/articles/2020-10-20/jackbox-games-benefits-from-retro-style-party-games-in-pandemic
- Jackbox (GameDev.net): https://gamedev.net/news/4677/
- Friends & Fables pricing: https://fables.gg/pricing
- Friends & Fables vs AI Realm: https://fables.gg/blog/ai-realm-vs-friends--fables-plan--feature-comparison

**Kids and families**
- Pew screen time 2025: https://www.pewresearch.org/internet/2025/10/08/how-parents-manage-screen-time-for-kids/
- NAGB/NAEP 2026 release: https://www.nagb.gov/news-and-events/news-releases/2026/naep-long-term-trend-assessments-show-different-trends-for-9-and-13-year-olds.html
- AmAcad youth reading: https://www.amacad.org/humanities-indicators/public-life/youth-reading-fun
- KiwiCo: https://fortune.com/2024/10/14/toy-brand-kiwico-surpassed-1-billion-lifetime-revenue/
- Lovevery: https://www.fastcompany.com/91036695/lovevery-most-innovative-companies-2024
- Clue Ninja: https://microlaunch.net/p/clueninja
- Super Treasure Hunt: https://www.afterschoolactivitiesforkids.com/games/super-treasure-hunt
- Let's Roam: https://www.letsroam.com/roam_from_home/families
- Scary Mommy on r/parenting: https://www.scarymommy.com/parenting/kid-hates-reading-parent-tips
- ALAN journal: https://scholar.lib.vt.edu/ejournals/ALAN/v41n1/brown.html
- Reformed Broker comments: https://thereformedbroker.com/2019/03/06/the-breakthrough/comment-page-2
- GreatSchools: https://www.greatschools.org/gk/parenting/reading/tips-for-reluctant-readers/
- My Sports Report: https://mydailysportsreport.pages.dev/
- Bedtime Baseball: https://bedtimebaseball.beehiiv.com/p/use-bedtime-sports-93c6
- Smallball: https://reletter.com/publications/smallball
- The Playbook: https://theplaybookam.pages.dev/
- SI Kids: https://www.pressreader.com/usa/sports-illustrated-kids

**Trading cards**
- r/ptcgo "My 6yo cried": https://www.reddit.com/r/ptcgo/comments/u9z4wf/my_6yo_cried/
- Penny Arcade: https://forums.penny-arcade.com/discussion/181347/pokemon-tcg-how-to-help-my-daughter-get-started
- meh.com: https://meh.com/forum/topics/too-many-options-for-pokmon-trading-card-game---tell-me-what-i-should-buy
- House of Cards: https://houseofcards.ca/blogs/magic-the-gathering/building-your-first-pokemon-deck-a-guide-for-parents-and-kids
- GeekDad: https://geekdad.com/2014/06/guide-to-pokemon-deck-building/
- Dragon Shield: https://apps.apple.com/us/app/id1199495742
- POKO: https://apps.apple.com/us/app/id6446088167
- Poke Delver: https://apps.apple.com/us/app/-/id6736618646
- Dex: https://apps.apple.com/app/id1555489854
- Poké Pricer: https://apps.apple.com/us/app/-/id6744259439
- Deckify: https://apps.apple.com/us/app/-/id6748853103
- TCGstacked: https://www.tcgstacked.com/pokemon/card-scanner-app
- TCGdex: https://tcgdex.dev/
- TCGdex database (GitHub): https://github.com/tcgdex/cards-database
- pokemontcg.io (now Scrydex): https://pokemontcg.io/
- Pokémon in Figures: https://corporate.pokemon.co.jp/en/aboutus/figures/

**Doom-scrolling**
- Talker Research: https://talkerresearch.com/sleep-thieves-americans-lose-hundreds-of-hours-a-year-to-late-night-scrolling/
- Amerisleep: https://amerisleep.com/blog/revenge-bedtime-procrastination-survey/
- Opal 2024 review: https://opalapp.com/blog/keynote-01-opals-year-in-focus-2024
- RevenueCat podcast on Opal: https://www-docs.revenuecat.com/blog/growth/kenneth-schlenker-sub-club-podcast-2026/

**APIs tested live on 2026-11-14**
- `https://api.sleeper.app/v1/state/nfl`: returned season 2026, week 10.
- `site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard` and `/summary?event=…`: returned box score, scoring plays, drives, standings.
- ESPN NBA scoreboard: working.
- `api-web.nhle.com/v1/score/now`: working (redirect).
- `api.tcgdex.net/v2/en/cards/{id}`: returned legality, regulation mark, TCGplayer and Cardmarket prices updated 2026-11-14.
- `api.pokemontcg.io`: **HTTP 502**; the site now reads "Now part of Scrydex".

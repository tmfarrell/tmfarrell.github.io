---
toc: true
layout: post
title: 'My Product Principles (So Far)'
date: 2026-03-01 08:00
categories: writing
tags: [product, strategy]
---

I've been building and thinking about products for a while now, and this post is my attempt to synthesize the frameworks and mental models I keep coming back to. 

This isn't meant to be exhaustive or original — most of it stands on the shoulders of people who've thought longer and harder about this than I have. But putting it in one place forces clarity and helps me be consistent about how I operate. 

## Two Phases

At the highest level/ layer, I think about product development in two distinct phases:

1. **Discovery** — the search for product-market fit
2. **Growth** — scaling what works

These phases are fundamentally different, and conflating them is one of the most common mistakes I see product teams make.

**Discovery**

Discovery is about proving that your product deserves to exist. The goal isn't to build — it's to *learn*. You're treating your product like a hypothesis and testing it iteratively until the market validates it.

The best framework for this comes from Steve Blank's *Four Steps to the Epiphany*: customer discovery and customer validation before you ever think about scaling. Use interviews and prototypes to validate ideas cheaply. Use actual product releases to validate customers. 

And critically, **do things that don't scale** — that's not a bug, it's a feature of this phase. Scalability is a growth problem, not a discovery problem.

The goal of discovery is to "cross the chasm" — to find the positioning, segment, and value proposition that actually resonates with a real market. Until you've done that, everything else is premature optimization.

**Growth / Scaling**

Once you've found product-market fit, the operating model changes. Now you need *cadence* and *systems*.

The best framework I've found for this phase is David Sacks' [The Cadence](https://medium.com/craft-ventures/the-cadence-how-to-operate-a-saas-startup-436aa8099e8) — a quarterly operating rhythm that synchronizes the two core systems in any startup: **Product/Marketing** and **Sales/Finance**.

The key insight is to stagger these systems with a slight offset:

- _Mid-quarter_: plan and execute launch events
- _Quarter end_: leverage those launches to close sales
- _Post-quarter_: use sales data and feedback to decide what to build next

This creates a self-reinforcing loop where shipping drives revenue, and revenue data drives the next build cycle. Without this cadence, product and sales tend to drift out of sync — which kills momentum.


## Four Steps 

Zooming in, I think about product development as a cyclical process with four steps:

1. **Strategy**
2. **Design**
3. **Development**
4. **Growth / GTM**

Each step has distinct components, methods, and failure modes.

**Strategy**

Strategy is about figuring out *where to play* and *how to win*. The core components are:

- _Mission/Vision_: what you're doing and why it matters
- _Positioning_: where you operate in the market
- _Business Model_: how you generate and capture value

A few frameworks I find useful here:

- [Michael Porter's Competitive Strategy](https://www.amazon.com/Competitive-Strategy-Techniques-Industries-Competitors/dp/0684841487): broadly, you can compete on differentiation, low cost, or a niche. Trying to do all three usually means succeeding at none.
- [7 Powers](https://www.amazon.com/7-Powers-Foundations-Business-Strategy/dp/0998116319): the most durable businesses achieve both high differentiation *and* low cost through invention. This is where moats come from.
- [Good Strategy / Bad Strategy](https://www.amazon.com/Good-Strategy-Bad-Difference-Matters/dp/0307886239): good strategy follows a simple pattern — diagnosis → guiding policy → action plan. Most "strategy decks" skip the diagnosis.

I'm a *structuralist* at heart. I believe the state of the market and a product's positioning are deeply deterministic of how it will perform. The unit of competition is the position, not the team.

A practical note: AI now makes strategy work dramatically easier. You can synthesize competitive landscapes, draft positioning documents, and pressure-test value chains infinitely faster than before. It's truly a superpower. 

**Design**

Design is about developing the right solution to the right problem. It has two phases of its own:

- _Research / Discovery_: understanding the problem space deeply before jumping to solutions
- _Testing / Validating / Iterating_: building cheap representations of ideas and learning from them

Methods I find useful: Design Sprints, the Double Diamond (diverge → converge, twice — once on the problem, once on the solution), story mapping, and prototyping to generate real/ specific feedback.

One important nuance: **design and strategy are inextricably linked**. High-level UX decisions — what the product fundamentally *is* and how people interact with it — are effectively strategic decisions. They determine positioning, define the user relationship, and constrain what's buildable. Downstream UI work is less tied to strategy, but information architecture and interaction patterns still flow from positioning choices.

Another practical side note: AI is also rapidly democratizing and accelerating design, but it won't get you to elite design on its own. The principles of good design — deeply understanding users, diverging widely before converging, testing assumptions early — still apply.

**Development**

Development is the work of turning a validated design into a shipped product. This includes:

- _Engineering_: actually building the thing
- _Delivery / Project Management_: making sure the team ships value as fast as possible

I'm a standard Agile practitioner here — kanban and/or scrum depending on the team and context. The core artifacts are:

- **Backlog**: a prioritized list of features or epics
- **Roadmap**: a high-level backlog mapped to a calendar — epics and initiatives with rough timeframes

The most underrated part of development is **delivery management** — understanding what's happening on the ground every day and connecting it to the high-level plan. Teams that lack this tend to drift. You can have the best strategy and the best designs in the world, and still ship slowly and poorly if nobody is actively managing the gap between plan and reality.

**Growth / GTM**

Growth is about getting your product into the hands of the market and measuring how much value it's actually creating. Components include:

- _Marketing_: shaping perception and generating demand
- _Sales_: converting that demand into revenue
- _Launch Activities_: the moments that create market energy around a release

The big strategic choice here is **sales-led vs. product-led** growth. Product-led (PLG) works when your product can demonstrate value on its own, without a salesperson in the loop. Sales-led works when the deal complexity, relationship requirements, or enterprise buying dynamics require a human. Many B2B companies operate some hybrid — product-led adoption up to a threshold, then sales-led for expansion.


## Four Activities

Regardless of phase or step, I think about day-to-day product work as cycling through four activities:

1. **Hypothesizing** — forming a premise about a problem and how your solution will solve it
2. **Building** — constructing the solution, or a representation of it good enough to test
3. **Launching** — putting the solution in front of the market and measuring its reception
4. **Learning** — using that data to confirm or update the original hypothesis

This cycle applies at every level of granularity — from a new feature to a whole product line. The key is that each activity should feed the next. Learning informs the next hypothesis. A good hypothesis makes building more focused. A focused build makes for a cleaner launch. And a clean launch generates cleaner learning.


## Three Modes

One more layer: beyond activities, I think about the *mode* you're operating in at any given time.

- **Thinking** — planning and strategizing; the "meta-work" above the work
- **Doing** — executing; heads-down, building, shipping
- **Communicating** — aligning stakeholders, sharing context, driving decisions across the org

All three are necessary. The relative weight of each shifts with company size: at an early-stage startup, most of your time should be in *doing*. As the company grows, *communicating* takes up more and more of the calendar — not because you want it to, but because coordination costs scale with org complexity. 

Also critically missed is taking the time to *think*. Most folks in any role--but product especially because of the typical volume of meetings--often don't take enough time to *think* about the right next step. 

Understanding which mode you're in (and which one you *should* be in) is a meta-skill that most people underdevelop.

---

## Fitting It All Together

All of these layers — phases, steps, activities, and modes — aren't separate and distinct layers. They nest and interact.

**Phases & Steps**

Different steps get emphasized in different phases.

In the *Discovery* phase, you should be heavy on strategy and design, light on full development. Build only enough to validate — mockups and prototypes over production code. GTM activities at this stage are mostly about finding and validating customer segments, not scaling revenue.

In the *Growth* phase, development and GTM take center stage. You've validated the core; now it's about building faster, shipping more reliably, and distributing more broadly.

**Steps & Activities**: 

I think of these as two concentric cycles, slightly offset.

- **Strategy** = **learning** (understanding the market) + **hypothesizing** (positioning)
- **Design** = **hypothesizing** (forming the concept) + **building** (prototyping it)
- **Development** = **building** (engineering the solution) + **launching** (making it available)
- **Growth** = **launching** (marketing and sales) + **learning** (measuring value delivered)

**Actitivies & Modes**

Every activity involves all modes, however, inherently some activities bias more towards certain modes than others. 

Learning and hypothesizing by their very nature require much more _thinking_ than _doing_. You also want to make sure to be _communicating_ your learnings and updated strategy/ hypotheses prior to investing in more development.  

Building often requires more _doing_ than _thinking_, although for highly technical products with high feasibility risk there may be a fair amount of thought involved. It also requires more _doing_ than _communicating_, but it is obviously very important to communicate changes to timeline, scope, etc. as development intiatives progress. 

Launching is inherently a _communicating_ activity--effectively you are communicating your solution to the market--so requires less _thinking_ and _doing_ in the "heads down" sense.  

--- 

I'm sure this will keep evolving. The frameworks that stick around are the ones that prove useful when you're actually in the weeds — making real tradeoffs under pressure. I'll update this as my thinking develops.



---
toc: true
layout: post
title: Building 0-to-1 in the AI Era
date: 2026-10-29 08:00
categories: writing
tags:
  - product
  - strategy
  - AI/ML
---

What a time to be alive and building products 0 to 1!

The powerful tools available today would've been hard to imagine before the acceleration of AI in the past few years. A designer or PM can go from idea to clickable, working prototype in hours or even minutes. Engineers can move at a velocity previously only dreamed of. Everyone can be a 10X engineer!

Except there's an enormous amount of complexity being introduced by AI too, known affectionately as **AI slop**. When anyone can generate a feature, a spec or a prototype, the hard part is no longer "can we build it" but "should we" and "if we do, how does it fit with everything else." 

I've been working through this in practice for the past couple of years (specifically in the context of an enterprise B2B startup), and this post is an attempt to document some patterns that I've seen work well. Not meant to be exhaustive, just some of my notes.   

## The Core Problem: Speed Without Vision or Cohesion

In a [previous post](/product_principles) I argued that **speed is required to win** in today's AI-accelerated world. Still believe that. But speed has a failure mode: when it's cheap for individuals to move fast, everyone can move in wildly different directions. This can manifest in a few ways: 

- Too many mock ups
- Too many versions of mock ups
- Mock ups that don't demonstrate unique, differentiated value 
- Mock ups or prototypes that never converge on a real product
- Engineering building things that haven't been validated by the market
- Too many product surfaces that don't feel like a cohesive whole

The goal, then, isn't just to go fast. It's to **go fast (a) in a singular direction and (b) in a way that reduces uncertainty at each step**. 

## Build the Cheapest Thing First

With the "vibe coding" trend, it's hard to resist the temptation to build software from scratch. 

Slides > Mock ups > Prototype > Production 

- **Slide deck**: the story and hypothesis. Why this, why now, who it's for.
- **Prototype**: the hypothesis made tangible. Used for discovery, sales and choosing between options.
- **Production**: the validated version, built by engineering against a clear spec, triggered by real customer commitment.

Each stage costs more than the last, and each one should only be entered once the previous stage has earned it. AI has made the first two dramatically cheaper and faster, which means you can (and should) spend much more time there, and arrive at production with far less uncertainty.

## Create a Demo/ Prototype Version of Your Product

Have a small, stripped-down version of your product that design and product can vibe code on. Not the production codebase--a separate, lightweight demo app that's cheap to change and cheap to throw away.

This demo becomes incredibly useful well before there's a "real" product:

- **Vision:** 
- **Discovery**: put it in front of potential users and get specific, concrete feedback instead of abstract opinions about a concept
- **Early sales conversations**: prospects react to something that looks and feels real, which makes it a much better prospecting tool than a slide
- **GTM tailoring**: because it's cheap to change, you can tailor versions to each GTM angle or campaign--a different emphasis for a different segment, buyer or use case

The key insight is that **the demo is a discovery tool**. It's meant to help you learn what the team should build. It's meant to be bespoke and custom; it's exactly the "do things that don't scale" work that belongs in the discovery phase.

## Explore and Evaluate Variants Before Committing

Before making changes to the demo, create an artifact with several different options. With AI, generating three or four variants of a screen or flow costs almost nothing.

Then, depending on the size of the feature:

- **Small feature**: iterate yourself and make the design decision
- **Larger feature**: send the options out for feedback and choose the best one (or, often, a mixture of options)

Once you've picked a direction, add it to the demo to see how it actually *feels* in context. If it holds up, promote it to the production app.

So the flow looks something like this:

**Options artifact → Demo → Production**

Each step is a filter. Cheap exploration happens at the front, and only things that survive real-world feel make it to the expensive end. This is basically the Double Diamond (diverge → converge) [TODO: link], just compressed from weeks into hours.

## Let Pilots Trigger a Partial Production Build

## Let Paid Deals Trigger the Full Build

Once you have pilots or paid deals lined up, have your engineering team implement a production version of what you've been demoing.

At that point, **the design/prototype version becomes the visual and functional spec for the product**. Engineering then layers in the technical, non-functional requirements: security, scalability, reliability, observability, integrations and so on.

I've done this a few times now and it makes the actual build super smooth and straightforward, for two reasons:

1. **Engineering knows exactly what the end state needs to look like.** There's no ambiguous PRD to interpret. The behavior is right there, clickable.
2. **The build has already been de-risked from a product/value standpoint.** If someone has signed a pilot or a paid deal based on what they saw, you have real market validation before investing in production code.

This is a big shift from how many teams operate, where engineering builds first and sales tries to sell what got built. Here, the market pulls the product into production.

## [Bonus #1] Make Every Product's Stage Visible

When you have multiple products, features and experiments moving at once, **be explicit about what stage each one is in**. Is it an idea? A prototype in the demo? In a pilot? In production?

Have a visible status tracker for features that anyone can add to and check in on. Nothing fancy--a shared list or board works fine. What matters is that:

- Anyone (sales, design, engineering, leadership) can see where things stand
- Anyone can add requests or ideas, so nothing lives in someone's DMs
- The stage determines the expectations: a prototype isn't promised to a customer, and a production feature isn't casually changed

This delivery management piece can be particularly helpful for executive leadership. 

## [Bonus #2] Close the Loop with Agents

More recently, I've started building an agentic loop that can read in these lists and trackers. [TODO: Tim to describe what the loop actually does today]

Once your work is structured--clear stages, a visible tracker, demo and production clearly separated--it becomes legible to AI agents, too. An agent can read the backlog, see what's in which stage, and help draft options, update the demo or prep the next step.

This is a nice example of a broader point: **AI rewards structure**. The teams that get the most leverage out of agents will be the ones that have already made their workflows explicit and digital.

## Final Takeaway

AI hasn't changed the fundamentals of zero-to-one product work. You still need to find out what deserves to exist, then build it well. What it has changed is the economics: **exploration is now nearly free, but focus is more expensive than ever.**

The teams that win won't be the ones generating the most stuff. They'll be the ones with a clear path from idea to prototype to production, and the discipline to let the market--not the slop--decide what gets built.

I'm sure this will keep evolving as the tools do. I'll update as my thinking progresses.

---
toc: true
layout: post
title:  "Building AI Products"
date:   2021-12-14 20:00
categories: writing
---

## The AI Cold Start Problem

Here's the scenario. You want to be fancy and build a product that leverages some of the latest and greatest in AI to satisy and delight your (future) users.

Given all the recent developments (like [GPT-3](https://openai.com/blog/openai-api/)), you want to use a pre-trained model to do the leg work but realize, after some light experimentation, you'll need more data to futher optimize the model for your use case.

You then realize that the users you want to serve (and sell to) are exactly those that have the data you'll need to do those optimizations...

After some self-reflection (and a hint of self-loathing), you remember a recent podcast you listened to and realize this is a variant of the [cold start problem](https://www.amazon.com/dp/B08HZ5XY7X/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1). You search on Google and find that the top Wikipedia article on [the cold start problem](https://en.wikipedia.org/wiki/Cold_start_(recommender_systems)) basically describes your exact issue. Oof.

You realize the Wikipedia article could have articulated the problem in a more general way, not limiting itself to just recommender systems. You write out a more general definition to make yourself feel a little better, hoping that by more clearly articulating the problem it would suddenly make it less true. To the contrary.

**The AI Cold Start Problem**: The ideal customers for most (if not all) ML/ AI-based products are exactly those that own the data needed to develop said products.

By now you realize you have to build value and start solving your users' problems up front, so you can entice them to your app in return for their data. You realize you'll need to build something like a "marketplace", a "[platform](https://sloanreview.mit.edu/article/the-future-of-platforms/)" or even a regular ol' app.

## Apps Before AI

Bottom-line: many might think that AI can be leveraged as a core, and potentially killer, feature for a product that satisfies and delights its users. In others words, `AI -> App`.

But really those opportunities are likely very rare, and you can only get so far by applying [data acquisition strategies](https://medium.com/@muellerfreitag?p=47166580ee48) that don't rely on providing your users value up front. In actuality, the ordering must be more like `App -> AI`. And in particular, `App -> Scale -> Data -> AI`.

So next time you think about making AI the core feature of your killer app, remember that your users likely have the data you'll need, and you'll need to provide them value first (just like everyone else) in return for that data, to gain the right to develop that smae product you believe they want/ need.

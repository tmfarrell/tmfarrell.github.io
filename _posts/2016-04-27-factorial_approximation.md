---
layout: post
title:  "Simple lower bound for large factorials"
date:   2016-04-27 20:00 
categories: writing 
---

Came across [this](https://www.reddit.com/r/learnmath/comments/4h6est/does_anyone_know_what_1000000_is/), a question on how big a number \\(1,000,000!\\) is.

Kind of a simple question with no real point. But thinking about it gives a simple ball-park approximation for large factorials.  

We note that since \\(999,990\\) of the factors of \\(1,000,000!\\) (that is: \\(1, 2, 3,..., 999999, 1000000\\)) are greater than 10 \\(namely, (11, 12,..., 1000000)\\), then \\(1000000!\\) must be greater than \\(10^{999990}\\). 

A general form of this is: \\(N! > k^{N-k}\\) for any \\(k, N: k < N\\). Which is most useful when we let \\(k = 10\\), since this quickly gives the least # of digits \\(N!\\) must have.  

Not sure how often folks out their take use of their factorials, but pretty neat either way.

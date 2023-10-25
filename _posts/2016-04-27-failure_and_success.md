---
layout: post
title:  "Failure Is Key To Success"
date:   2016-04-27 20:00
categories: writing
---

Came across [this](http://www.nature.com/naturejobs/2010/101118/pdf/nj7322-467a.pdf) today, a discussion
of the role of failure as a scientist.

This isn't the only example of failure being labelled requisite for success. For instance, Michael Jordan in his famous Nike commercial:

>I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times, I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.

And later:

>I can accept failure, everyone fails at something. But I can't accept not trying.

Then there's Thomas J. Watson (IBM):

>Would you like me to give you a formula for success? It's quite simple, really: double your rate of failure.

Then the common adage:

>If at first you don't succeed... try, try again.

And on and on. 

But how do we know this is actually *true*? It could be that successful people touting their failure are just talented people who only remember their failures.

I happen to believe this is intuitively true, but am more interested here in how can be proven in a  formal, probabilistic way. This way we could use that knowledge to identify the best ways to fail, in order to succeed (if possible). 

## Niave Approaches

At first thought, it might seem obvious: more trials leads to more opportunities to succeed. Assuming probability of success is independent for each trial, it follows that adding trials increases chances of success.

More formally, if we let our success rate be \\(p\\), failure rate is \\((1-p)\\) and the probability of of success follows a goemetric distribution where the chance of hitting a success after $$k$$ trials is \\((1-p)^{k-1}p\\). So, by complement, the chances of having success by the $$k$$<sup>th</sup> trial is \\(1 - (1-p)^{k-1}p\\). Clearly for large \\(k\\), this gets closer and closer to 1. 

Not bad!  

Except.. this likely is an over-simplification. Success isn't a singular event you need to hit only once, like a lottery. MJ wasn't trying to make one shot, or win one game.

Instead maybe we model it as a binomial, which models the probability of more than one success within of some number of trials. Precisely, the probability of \\(k\\) successes in \\(n\\) trials is \\((1-p)^{n-k}p^k\\).

Is this what we want? As we increase \\(n\\), the distribution mean (i.e. the average probability of success over all \\(k\\)) is \\(np\\). Which means average success is proportional to number of attempts.

## Dependence

But this also feels slightly oversimplified.  

This means average success is still proportional to \\(p\\), our individual trial success rate. Which means if \\(p\\) is very small we have to try more (make \\(n\\) larger) to get the same average success than if \\(p\\) were larger. And with lower values of \\(p\\), it becomes increasingly prohibitive to achieve large amounts of success.

Further, we're still assuming independence of events, which doesn't describe reality. We want to allow \\(p\\) to change event-to-event.

In other words, we're not interested in achieving success over a small number of trials; for instance, wanting to score the most points during a single game (where each shot is close to independent). We want to increase the likelihood success over the course of many games, getting better each game. 

## Failure is Key to Success

The quotes above argue that probability of success is *exactly dependent* upon our previous history of trials. Namely, the more we seek and experience failure, the more we are likely to succeed _for any given trial in the future_.<sup id="a1">[1](#f1)</sup>

We need some process where from \\(t \to t + 1\\) our chance of success is updated \\(p\_t \to p\_{t+1}\\). And assuming we attempt a trial at \\(t\\), \\(p\_{t+1}\\) is improved over some distribution. And further, this degree of improvement is proportional to the degree to which we fail, or more specifically the number of failed trials, say \\(k_f\\) over some interval of our history \\( \lbrace t-h,...,t-1 \rbrace \\).

Now this is definitely something!<sup id="a2">[2](#f2)</sup>

This would allow for training to matter. It would make our initial probabilities (our talent) less relevant. 

Risk more, try harder, fail bigger and get closer to success.  



<br>
<br>

-------
<!---
<sup id="a1">[1](#f1)</sup>
<a name="f1">1.</a> Aristotle said: "Excellence is an art won by training and habituation. We do not act rightly because we have virtue or excellence, but we rather have those because we have acted rightly. We are what we repeatedly do. Excellence, then, is not an act but a habit." In this context, I take this to mean: success is not an event; it is some indication, some sign, of an underlying practice/ habit. [Return.](#a1)


In other words, taking this model literally we would have to assume MJ was naturally talented from the start (had a high probability of success for each trial) since his success wouldn't have been possible if he.

And further, looking at Watson's quote, he recommends doubling your rate of failure. Assuming he means doubling your average rate of failure \\(n(1-p) \to 2n(1-p)\\), this is the same as doubling your number of trials (since we wouldn't want to touch the individual failure rate<sup id="a2">[2](#f2)</sup>). This does double our success rate since \\(np\\) would become \\(2np\\); but still lies the issue that at small values of \\(p\\) a level of (average) success is more and more unlikely. Which in turn implies that inherent ability/ talent, that which determines our initial individual success rate, is highly limiting, and to a large degree determines our outcomes.

<a name="f2">2.</a> Doubling your individual trial rate of failure would decrease your individual trial success rate to \\(2p - 1\\).
    \\[q + p = 1 \to q' + p' = 1\\]
    \\[q' = 2q = 2(1 - p)\\]
    \\[p' = 1 - q' = 1 - 2(1 - p) = 2p - 1.\\]
    Which means if your success rate is even a tad under 50/50, you'll never succeed: \\((2(0.49) - 1)\_+ \to 0 \\). [Return.](#a2)
-->

<a name="f1">1.</a> And [some research](http://nautil.us/issue/35/boundaries/not-all-practice-makes-perfect) has shown this, that world-class performers characteristically push themselves to a towards discomfort zones during practice, putting themselves more often in the realm of failure. 

<a name="f2">2.</a> And I believe this kind of theory is supported by a more sophisticated model of [evolvability](https://dash.harvard.edu/bitstream/handle/1/2643031/Valiant_Evolvability.pdf). 

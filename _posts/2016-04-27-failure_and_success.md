---
layout: post
title:  "Does Failure Gives Success?"
date:   2016-04-27 20:00 
categories: writing
---

Came across [this](http://www.nature.com/naturejobs/2010/101118/pdf/nj7322-467a.pdf) today, a discussion 
of the role of failure as a scientist.  

This isn't the only example of failure being labelled requisite for success. For instance, MJ in his famous Nike commercial:

>I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times, I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.

And later: 
    
>I can accept failure, everyone fails at something. But I can't accept not trying.
    
Then there's Thomas J. Watson (IBM): 

>Would you like me to give you a formula for success? It's quite simple, really: double your rate of failure. 
    
Then the common adage: 

>If at first you don't succeed... try, try again. 
    
And on and on. But how do we know that this is actually true? It could be that successful people touting their failure are just talented people who only remember their failures.

I happen to *believe* these recommendations are true, and useful. But I'm more interested in if it could be proven in a more formal (i.e. probabilistic) way. This way we could use the formalization to determine what are the best ways to fail, in order to succeed. (Or at the very least build a logical/ reasonable intuition that it's a better way forward than relying strictly on talent, and/ or sticking to your comfort zone.)   

## Niave Approaches

At first thought it might seem pretty obvious: more trials means more opportunities to hit success. Assuming your chances of success/ failure are independent at each trial, then it follows that adding trials increases the chance of hitting success. 

More formally, this could follow a geometric distribution with success rate \\(p\\), failure rate \\((1-p)\\), where your probability of needing \\(k\\) trials to hit your first success is \\((1-p)^{k-1}p\\). And so by complement the chances of your having success by the \\(k\\)<sup>th</sup> trial is \\(1 - (1-p)^{k-1}p\\). Clearly for \\(k\\) large, this gets closer and closer to 1.

Except, this is really an over-simplification. Success isn't usually some event you need only hit once, like a lottery. Mike wasn't trying to make one shot, or win one game.

Instead then maybe we model this as a binomial, which is an extension of a geometric in that it quantifies the probability of more than one success within of some number of trials. Precisely, the probability of \\(k\\) successes in \\(n\\) trials for is \\((1-p)^{n-k}p^k\\). 

So is this what we want? As we increase \\(n\\), the mean of the distribution (i.e. the average probability of success over all \\(k\\)) is \\(np\\). Which means indeed our average success is proportional to how many times we try. 

## Dependence

But this too is far from complete. This means that our average success is still proportional to \\(p\\), our individual trial success rate. So if this is small we have to try more (make \\(n\\) larger) to get the same average success than if \\(p\\) were larger. And with lower values of \\(p\\), it becomes increasingly prohibitive of larger amounts of success.  

Further, we're still assuming independence of events, which isn't what we want. We want to allow \\(p\\) to change from event to event. 

In other words, we're not interested in achieving some success level within some small amount of time; for instance, wanting to score the most points of anyone during a single game (where each shot is probably independent). We want some success level over the course of many games, where we can get better with each game (with some probability). 

So a simple binomial isn't our best bet either then. And our initial assumption of independence between trials is the issue at hand here. 

The quotes above argue that our probability of success is *exactly dependent* upon our previous history of trials. Namely, the more we seek and experience failure, the more we are likely to succeed _for any given trial in the future_.<sup id="a1">[1](#f1)</sup>

So how would we model this? We need some process where from \\(t \to t + 1\\) our chance of success is updated \\(p\_t \to p\_{t+1}\\). And assuming we attempt a trial at \\(t\\), is improved over some distribution. And further, this degree of improvement is proportional to the degree to which we fail, or more specifically the number of failed trials, say \\(k_f\\), in some interval of our history \\( \lbrace t-h,...,t-1 \rbrace \\). 

There's definitely something to this and I believe it can be framed more readily as a [learning, or evolution, process](https://dash.harvard.edu/bitstream/handle/1/2643031/Valiant_Evolvability.pdf). Now this is something. This would allow for training to matter. It would make our initial probabilities (our talent) less relevant.

More on this to follow.

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

<a name="f1">1.</a> And some research has shown this, that world-class performers characteristically push themselves to a towards discomfort zones during practice, putting themselves more often in the realm of failure. See [here](http://nautil.us/issue/35/boundaries/not-all-practice-makes-perfect). [Return.](#a1)
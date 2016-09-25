---
layout: post
title:  "Failure and Success"
date:   2016-04-27 20:00 
categories: writing psychology performance phil
---

Came across [this](http://www.nature.com/naturejobs/2010/101118/pdf/nj7322-467a.pdf) today, a discussion 
of the role of failure as a scientist.  

And it got me thinking, this isn't the only example of failure being labelled requisite for success. For instance, MJ in his famous Nike commercial:

>I've missed more than 9000 shots in my career. I've lost almost 300 games. 26 times, I've been trusted to take the game winning shot and missed. I've failed over and over and over again in my life. And that is why I succeed.

Also relevant here, MJ later: 
    
>I can accept failure, everyone fails at something. But I can't accept not trying.
    
Then there's the Thomas J. Watson (of IBM fame) quote: 

>Would you like me to give you a formula for success? It's quite simple, really: double your rate of failure. 
    
Then the common idiom: 

>If at first you don't succeed... try, try again. 
    
Etc etc. So is there actually something to this in a general (probabilistic) sense? 

At first thought it actually seems pretty obvious: more trials means more opportunities to hit success. Assuming your chances of success/ failure are independent at each trial, then it follows that adding trials increases the chance of hitting success. 

More formally, this could follow a geometric distribution with success rate \\(p\\), failure rate \\((1-p)\\), where your probability of needing \\(k\\) trials to hit your first success is \\((1-p)^{k-1}p\\). And so by complement the chances of your having success by the \\(k\\)<sup>th</sup> trial is \\(1 - (1-p)^{k-1}p\\). Clearly for \\(k\\) large, this gets closer and closer to 1.

True, so this is something. 

Except, this is really an over-simplification. Success isn't usually some event you need only hit once, like the lottery. Mike wasn't trying to make one shot, or win one game. 

Instead then maybe we model this as a binomial, which is similar to the geometric except it allows for more than one success in the set of trials. The probability of \\(k\\) successes in \\(n\\) trials for a binomial is \\((1-p)^{n-k}p^k\\). 

So is this what we want? As we increase \\(n\\), the mean of the distribution (i.e. the average probability of success over all \\(k\\)) is \\(np\\). Which means indeed our average success is proportional to how many times we try.  

So this is something as well.  

But thinking about this further, this too is incomplete. This means that our average success is still also proportional to \\(p\\), our individual trial success rate. So if this is small we have to try more (make \\(n\\) larger) to get the same average success than if \\(p\\) were larger. And with lower values of \\(p\\), it becomes increasingly prohibitive of larger amounts of success.  

In other words, taking this model literally we would have to assume MJ was naturally talented from the start (had a high probability of success for each trial) since his success would be near impossible if he weren't. Players have to make many more shots (or win many more games) than they miss on average and over time to be great. 

And further, looking at Watson's quote, he recommends doubling your rate of failure. Assuming he means doubling your average rate of failure \\(n(1-p) \to 2n(1-p)\\), this is the same as doubling your number of trials (since we wouldn't want to touch the individual failure rate[^1]). This does double our success rate since \\(np\\) would become \\(2np\\); but still lies the issue that at small values of \\(p\\) a level of success is more and more unlikely. (Implying that inherent ability/ talent, that which determines our initial individual success rate, is limiting.)

So really this isn't our best bet either. And our initial assumption of independence between trials (something statisticians enjoy assuming) is the issue at hand here. 

The quotes above argue that our chances for successes are actually exactly dependent upon previous trials (within some trailing window). Further, they argue that: the more we try AND fail, the more we are likely to succeed _for any given trial in the future_. 

So how would we model this? Probably we should turn to some stochastic process where as \\(t \to t + 1\\) our chance of success is updated \\(p\_t \to p\_{t+1}\\). And assuming we attempt a trial at \\(t\\), is improved over some distribution. And further, this degree of improvement is dependent (and proportional) to the degree to which we fail. 

Now this is something. This would leave talent less relevant. This would allow for training to matter.  

And actually research has shown that world-class performers consistently push themselves to a position of discomfort during practice, consciously putting themselves in positions to fail.[^2]

Surely this is an informal argument and lacks rigor. But maybe there's some stochastic models out there, something not unlike a kind of inverse birth-death process, that would do the trick.  



[^1]: Doubling your individual trial rate of failure would decrease your individual trial success rate to \\(2p - 1\\).  
    $$q + p = 1 \to q' + p' = 1$$
    $$q' = 2q = 2(1 - p)$$
    $$p' = 1 - q' = 1 - 2(1 - p) = 2p - 1.$$
    Which means if your success rate is even a tad under 50/50, you'll never succeed: \\((2(0.49) - 1)\_+ \to 0 \\).

[^2]: See [here](http://nautil.us/issue/35/boundaries/not-all-practice-makes-perfect).
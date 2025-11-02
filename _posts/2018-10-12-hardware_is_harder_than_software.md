---
toc: true
layout: post
title:  "Hardware Is Harder Than Software. Period."
date:   2018-09-10 08:00 
categories: 
---

## Hardware Is Harder Than Software 

This seems like a pretty obvious point, but in a world where Big Data, AI and Software are King it bears repeating. (And this from a guy who very much believes they should be.) 

In addition, I think this worth reiterating to those who are enamored or even just excited about the prospects of software/ computation to make messy/ difficult endevours easier or more effective. (Like myself, and other bio/ bioinformatic/ healthtech engineers.)

Back in November of last year (2017), the Human Microbiome Quality Control project published their initial findings on the *most comprehensive* evaluation of human microbiome sequencing (and microbial population profiling, more generally) to date. 

Their conclusion, essentially: hardware is more difficult than software. More specifically, that the physical pieces of the sequencing pipelines (i.e. sample processing, library construction, actual sequencing, etc.) introduced more variation in the end results than the computational pieces (i.e. bioinformatic analysis).<sup id="a1">[1](#f1)</sup>

This I think, in retrospect and considering all other possibilities, is exactly what we should expected. In every other case of hardware vs. software---hardware vs. software startups, products vs. ideas, actions vs. thoughts, etc.---the hardware, the physical instantiation, is the harder piece to execute correctly. 

## Because Reality Is Hard

Why is this? Reality is *freaking* hard. Physical Nature, when thought of mechanistically down to the smallest detail, could be thought of as the most complicated piece of machinery possible. 

To make technology/ machines work then, we have to strip down (through isolation and reductionism) all the details of Nature extraneous or irrelevant to the very specific and narrow purpose of the desired mechanism. Inevitably though, Nature sneaks in. Typically we forget minor details because there are approximately infinitely many (unknown knowns), but sometimes also completely unexpected phenomena occur that force us to reevaluate our understanding of Nature (unknown unknowns).<sup id="a2">[2](#f2)</sup> 

Software/ computation, on the other hand, is easier since it's basically about dealing with a bunch of on-off switches (i.e. discrete values), whose behavior and number we are very familiar with and have a high degree of control over. Software/ computation, in large part, is about enumerating all the possibilities and then writing cases/ behaviors for each case. There technically shouldn't be known unknowns or unknown unknowns. Which is much, much simpler and much more powerful. 

It's powerful becuase as has been demonstrated not only in biological evolution---in the fact that brains have evolved in the first place---but also in cultural evolution---in the fact that software is in the process transforming/ effectivizing so many industries---having a set of discrete values that you have complete control over can allow you simulate/ summarize/ abstract all types of situations and predict/ classify outcomes of those simluated/ summarized scenarios so the organism/ organization can make decisions to optimize its well-being. When you virtualize/ abstract the physical to a useful degree of approximation, you don't have to actually act in Nature to see how things turn out. You can simulate scenarios and pick the best one. This is the essence of thought and software, and why it's so useful.    

## The Harder Parts of Software

Software isn't as easy as it may sound though. For one, oftentimes even small problems have tend to have a large number of number of possibilities, each of which needs to be matched accurately to an output/ outcome case, and these can be time-consuming/ complicated to cover. Again, you have to limit, by isolation and reductionism, the possibilities and the possible outputs. 

And then for two, software becomes harder and harder the more you want to the system to interact with, or control, reality. Software that just acts on data or other pieces of software are much easier than software that interacts with the world. Interfacing with the user and measuring things are the *harder* parts of software, the hardware of software, if you will. 

And so, you can imagine, in the world where indeed Big Data and AI become King, this will put a premium on harder-to-write software that __measures__ things from the world. Since this gives back data, which then can be acted on by easier-to-write software to give back simulations/ summaries/ predictions.  

## Data Engineering Will Be The Hard Part of ML/ AI

So then, all these things together, you might say that __data engineering__ might be the hardest part of ML/ AI applications. And it seems to me there's clear evidence of this being the case. The hardest part of any ML/ AI application isn't the idea, the models, etc. (all those things are soft, and quite cheap/ easy to come by), it's getting the right data at a large scale. 

For instance, there's a huge amount of hype about precision medicine, and the general potential of applying computation/ automation to the problem of human health and well-being. And yet, the major challenge still is the limited amount of data available necessary to make the type of solutions folks are hoping for. 

What needs to be done is a near-complete virtualization/ computationalization of these areas, such that we can write easy-to-write software to give us back useful predictions. This is the promise of the electronic medical record. It's (at least supposed to be) a complete digital record of patient presentation and history, such that software can then act on it in an efffective/ easy fashion. 

We have a long way to go towards complete virtualization in healthcare but it's been done by other industries before. For example, I'd argue that reading/ consuming news is now largely computationalized, since news consumers now do so through websites, which in turn can measure how their users consume their media, their behaviors, etc. Now, this is easy enough for media companies becuase they're basically just serving up information. It'll will be much more difficult, but not impossible, for industries like healthcare that inherently need to interface with reality. And in these industries I would argue Data Engineering will become King. 

<br>

------

<br> 

<a name="f1">1.</a> I won't go into any detail on the study's methodology, suffice it to say it was really well done and a gigantic effort. You can read more about it <a href="https://www.nature.com/articles/nbt.3981">here</a> and <a href="https://www.nature.com/articles/nbt.3983">here</a> (paywall).

<a name="f2">2.</a> Then, of course, there are the known unknowns as well: that is, those areas where we know that we don't know how they work or how they will turn out when we try something.  






    




  

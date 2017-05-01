---
layout: post
title:  "A Measure of Physiological/ Performance Measures"
date:   2017-04-28 18:00 
categories: writing
---

Recently read [this piece](http://waitbutwhy.com/2017/04/neuralink.html) on Elon Musk's 
most recent venture, Neuralink. Fascinating article for a fascinating company. 

To set the stage for Musk's vision for the company, Urban recaps not only the whole of human
history but also the history/ evolution of cephalization generally. Implying that arguably we
humans are the peak/ pinnacle of a long process of nervous system evolution, driven by the 
utility of real-time sensing (input), processing (computation) and reacting (output) for
biological organisms. 

This perspective sets the stage well for Neuralink's ambitions. It also gives some evolutionary
biological intuition for why computational/ information technologies have become so widespread: 
they are extensions of this cephalization process, results of evolutionary forces pushing for 
better cognition to serve better biological fitness. 

## A Measure of Physiological Measures

What interested me most in this article, however, was more practical and low-level (though I guess
still fairly "meta"). In reviewing the current state of the art in brain-machine interfaces (BMIs),
which are marked more advanced than I had thought, he uses a framework that I think could be 
applied more generally to all devices that aim to measure human physiological/ functional dynamics.   

His evalution framework consists of 3 what-he-calls "broad criteria": **scale**, **resolution** 
(spatial/ temporal) and **invasiveness**. I think if these measures were made more specific (i.e. 
quantified) and taken seriously, they could be highly useful for evaluating potential of novel 
biometric technologies, as well as envisioning the ideal (arguably more important). 

In other words, these 3 measures constitute a 3D meta-space on technologies, giving a sense/ intuition 
for which subspace a perfect technology would reside and further implying the directions we need 
to tend to improve the current state. This space also allows us to "map" or "plot" subspaces that
may be "impossible"/ highly unreasonable to attain, due to physical/ physiological restrictions or
constraints. 

## Blood Biometrics As An Example

For example, the first application of this evaluation space that came to mind was blood 
biometrics.<sup id="a1">[1](#f1)</sup> For many reasons, there is a lot of interest in developing 
technology that provides a continuous measure of blood biomolecular (protein, genomic, etc.) 
composition.<sup id="a1">[2](#f2)</sup> However, it's difficult to imagine how this might be accomplished 
given all the layers of tissue between the most reasonable measure space (outside the body) and arteries/ 
veins (which permeate the innermost layers of cardiovasculatured organisms). 

So it's useful to use this evaluation criteria to ask the question: what is the current state of the
art in blood biometrics? And what would the ideal blood biometric look like? That is, where in the space 
of **scale**, **resolution** (spatial/ temporal) and **invasiveness** are we, and where should we be
going? And as you'll see this brings us to all sorts of interesting questions. 

What would be a decent **scale** for blood biometrics, that is volume of blood measured in a particular
data point? That is, how much volume should we gather with each sample to select a portion representative
of that individual's whole blood?  

This also leads naturally into thinking about **spatial resolution**, which for blood would be anatomical
locations of sample collection: arms vs legs, arterial vs venous vs capillary. If we have it at one location, 
say a venous port in one of the arms, this would be of a smaller spatial resolution than if the samples were
from multiple locations at each data point, say a venous port in an arm and a leg. (This would also probably
increase scale as well, since in this case there is a relationship between spatial resolution and scale.)

Then we could also think about **temporal resolution**: how often do we have to/ should we sample to capture 
the most relevant physiological/ functional dynamics in blood? That is, what are the frequency ranges that
capture the most interesting biomolecular dynamics in blood? 

And **invasiveness**: are there ways in which we can measure biomolecular composition in blood without a port, 
without drawing blood outside the body? This differientiates approaches: to take blood out of the body would
likely take a biochemical approach (some sort of immunological assay) whereas to measure inside without 
taking out would likely need a biophysical one (taking physical measurements that are representative
of biomolecular composition, which would likely be very crude and of low resolution).

## Biomedical Engineering And Science

We can see in all the above cases, the engineering considerations (the evalution criteria) actually give questions
that may be more in the realm of science/ physiology. It's possible that answers to the above questions are thought
to be "known", but more than likely the development of technology that is closer to the ideal space would be in the 
only position capable of really answering them; that is, providing enough data/ evidence for mathematical models of 
physiological dynamics in blood (or any other physiological system desirable of measurement). 

This shows the close connection between biomedical engineering and biomedical science. The science isn't
robust/ quantitative/ "hard"/ sure enough to fully support the engineering discipline, so most of the time
the engineering encroaches on scientific territory. And further, since the focus of both biomedical science
and engineering is fundamentally [machinic](/writing/2016/06/03/the_machines_before_the_machines.html) 
(i.e. biological organisms are machines) then the science is more like the process of reverse engineering than anything else. 

<br>
<br>

_____   

<a name="f1">1</a>: I use the term biometric very generally to mean any measure of biological process
or function. [Go Back](#a1)

<a name="f2">1</a>: Blood is the slow-information highway for the body (as opposed to the fast-information
highway of the nervous system). Blood facilitates travel/ transport for all the components of the endocrine and 
immune systems, which although both operate at lower frequencies/ slower speeds than the nervous system I think
harbor much more interesting and exciting progressive dynamics in the long-term (i.e. learned immunity, 
physiological adaptation, etc.) [Go Back](#a2)
---
toc: true
layout: post
title:  "Do You Need a (Biomedical) Data Scientist with a PhD?"
date:   2019-03-11 08:00 
categories: 
---


## Generalists > Specialists in Data Science

I recently read an <a href="https://hbr.org/2019/03/why-data-science-teams-need-generalists-not-specialists">HBR article by Stitch Fix's CIO Eric Colson</a>, where he argues that generalist---or "full-stack"---data scientists are much more desirable than specialists for effective data science teams.<sup id="a1">[1](#f1)</sup> According to Colson, generalists work best, for all except the largest data science teams (where he still recommends starting out with generalists and then "begrudgingly" hiring specialists to fill very specific needs), because the best way to organize a data science team is to assign/ vertically aligned each individual to a particular data science problem or "function". 

Data science, he argues, differs fundamentally from other commercial endevours (more amenable to divison of labor) in that the primary goal is "learning", a highly iterative and often messy back-and-forth process. To learn something as complicated as a data science product, you don't know what the best result will look like in the end, so you can't engineer a process to get you there. Vertical alignment then minimizes the coordination costs and iterative time overhead for developing a data product by assigning all tasks (data extracting, model training/ testing, etc.) to one individual.  

<br>


## Implications for Biomedical Science and Engineering?

This all makes sense, and I buy the argument for the reasons he outlines. But I find the conclusion particularly interesting as it applies to Biomedical Science, where specialization is King and "generalist-ness" is generally frowned upon. 

Traditionally speaking, pure scientists have always looked down on their more applied (i.e. more general) counterparts,<sup id="a2">[2](#f2)</sup> and this compounded by the fact that the current publishing paradigm in Science incentivizes hyper-specialization.<sup id="a3">[3](#f3)</sup> Which is *further* compounded by the fact that 21st-century Science is such a large and complicated machine, where the number of authors per scientific paper has risen 4X since 1950 (and thus per-individual scientific productivity has shrunk by that same factor).<sup id="a3">[4](#f4)</sup>

Given these things together, companies/ teams that want to hire data scientists for solving modern biomedical problems are left in a slight pickle. On the one hand, you have the complexity of biology, the technical details of working with modern biological and clinical data (which ideally you'd like any scientist you hire to have a decent knowledge of), and finally the modern trend of large-scale, big-team, collaborative Science. On the other hand, you have Colson's recommendation that vertically-aligned generalists are the best way to build effective data science teams.

 How do we reconcile these? Do Colson's recommendations apply to biomedical data science teams? Do those health/ medtech/ biotech companies interested in differientiating themselves with data science really want generalists?

 I think (admittedly, biasedly) Colson's conclusions do apply, and for more reasons than the original ones he outlined, which have to do with all the worrisome trends in Science. In other words, beyond thinking that his recommendations for data science teams in industry apply equally to healthtech/ medtech/ biotech teams, I also believe his recommendations should be seriously considered within Science as well.  

<br> 


## Most of Modern Science is Data Science  

Modern sciences, especially the biomedical strains, are rapidly becoming primarily data sciences. That is, sciences whose chief aim is to collect/ create/ synthesize large amounts of data and compute conclusions from them. 

This sounds very similar to what many modern technology companies are trying to do, except companies look to optimize for Value rather than for Truth. Is there something fundamentally different about the process of optimizing for Truth rather than Value, though? As it relates to data science industry, I don't think so. With a data science product, maximal Truth is of maximal Value; inaccurate (i.e. untruthful) predictions are of least value. 

Thus, I think the same processes/ practices used for the industrial data science teams can and should be applied to scientific teams (product management, Agile, etc. all apply here).<sup id="a3">[5](#f5)</sup> For this reason, I think Science should take what people like Eric Colson have to say pretty seriously.     

<br>


## Supervised vs. Unsupervised Learning (Or Dealing with Truth)  

That said, there are important ways in which commerical data science is different from Science data science. The biggest difference being that ground Truth usually isn't known in Science (because that's, like, the point). That is, most of the time you are working with unlabelled data, and have to perform unsupervised (harder) as opposed to supervised (easier) learning. 

Two points here. First, I believe this is a *technical*, not fundamental, difference. It just simply means Science has to use more unsupervised/ semi-supervised methods, and doesn't change the essential conclusion: it's all data science and best practices of effective data science teams should be adopted regardless of the technical details. 

Second, re: healthtech/ biotech/ medtech companies looking to hire, the fact that Science largely deals with unlabelled data means that scientists (i.e. specialists) tend to be not very good at working with labelled data, and don't typically know how to use ground Truth well (and there are subtleties). So for companies with labelled data, or looking to build a dataset/ database and leverage it, this should not be overlooked as a major weakness when it comes to building product teams. 

<br> 


## Applying vs. Advancing Knowledge (Or Dealing with Novelty)

Another difference between commerical data science and Science is that traditional scientists crave mystery. They want to chart out a new species, or name a new compound. Everything must be new, and previously unknown/ uncharacterized. This attitude, related to the discussion of Truth, isn't ideal. It's not concerned with what is True, but rather much more on what is New. 

What's somewhat objectionable to them is applying known knowledge, known Truth. Who wants to do that? How second-rate. And, in part, I admit it is. But in the unsexiest of things, in the most mundane, you tend to find the most immediately useful/ valuable. And this is where engineers shine.   

Far from perfect, though, engineers can also suffer from New-ness syndrome, except it's not the Newness of Knowledge that attracts them but the Newness of Design. The new framework, the new language, the new XYZ, all promise potential superior Design and improved output. . The paradox is that the coordination/ learning costs associated with new technology adoption and optimization often tend to outweigh the gains in output in the short-to-medium term. And even that is not guaranteed, it's not always clear in whether a particular new technology will pay off because it's new for everyone and hasn't yet proven itself. 

<br> 


## Practical vs. Optimal Solutions (Or Dealing with Theory)

Related to this point, scientists (and by that I, again, mean specialists) are often also more concerned with theory that with practicality. Which can be a defect in data science, I would say, since often you cannot prove/ solve for optimal/ closed-form solutions. Solutions are found iteratively, and often utilize hueristics. This, again, is much more of an engineer than a scientist's game. Scientists generally distrust hueristics because they can be arbitrary and inexplicable. Engineers care about things that work, emphasizing Value over Explainability.

That said, explaining your work and why your results are correct is definitely still important. In fact, it was recently argued that the soon-to-be most useful skill in data science is model explainability.<sup id="a6">[6](#f6)</sup> And I don't disagree. It's uncomfortable dealing with models that can't be interpreted, and you should go out of your way to interrogate the best model as much as possible to get at why it performs best. However, we are still decades away from model's that explain their behavior to the satisfaction of a pure scientist. 

<br> 


## Credentialism and Machines

My point in all this is to say: specialization, as much as it's touted in biomedical science/ engineering, can be a hindrance in more ways than one. Specialization, whether it's in a small area of Science or to the whole system of operating in modern Science, in any degree, can become a crutch. Or in evolutionary biology parlance, a fitness cost. And generalist-ness, contrary to popular belief, an advantage (due to the fact that they have less weaknesses/ costs of fitness). 

Ultimately, what you want ideally though is an individual with both broad and deep expertise. Do you find that in someone with a PhD? Maybe. I think more often you would find this in someone with more experience. After all, education is more for show that for skill.<sup id="a7">[7](#f7)</sup> 

And, additionally, with the state of computation/ automation where it is, what you really want is someone who can best understand and control the powerful machines at our exposal, which for the reasons Colson outlines, takes a generalist.<sup id="a8">[8](#f8)</sup>


<br>
<br>

------

<br> 

<a name="f1">1.</a> He also posted another version of this article to the Stitch Fix blog here: <a href="https://multithreaded.stitchfix.com/blog/2019/03/11/FullStackDS-Generalists/">https://multithreaded.stitchfix.com/blog/2019/03/11/FullStackDS-Generalists/</a>  

<a name="f2">2.</a> More generalist-type sciences (like say, epidemiology or economics) are generally regarded as not "real" science. 

<a name="f3">3.</a> As a way to build a natural monopoly on a little sliver "truth"-seeking territory and stake it out for the duration of an academic career until no one else has a clue what you're talking about.

<a name="f4">4.</a> This is an article by Patrick Collison, CEO of Stripe, and Michael Nielson, a Research Fellow at Y Combinator Research, on <a href="https://www.theatlantic.com/science/archive/2018/11/diminishing-returns-science/575665/">stagnation in Science</a>. And here's Patrick Collison and Russ Roberts' discussion of the article on an <a href="http://www.econtalk.org/patrick-collison-on-innovation-and-scientific-progress/">EconTalk podcast</a>, surprisingly one of the best/ most honest discourses I've heard on the state of Science today.

<a name="f5">5.</a> If not just because they're more *way* effective than the processes Science tradiationlly employs (and by that I mean None), because at least for processes from industry someone has thought about them more than five minutes, and probably a lot longer and more thoughtfully because actual money is on the line. 

<a name="f6">6.</a> <a href="https://towardsdatascience.com/why-model-explainability-is-the-next-data-science-superpower-b11b6102a5e0">https://towardsdatascience.com/why-model-explainability-is-the-next-data-science-superpower-b11b6102a5e0</a>

<a name="f7">7.</a> <a href="https://blog.press.princeton.edu/2018/01/23/bryan-caplan-on-the-case-against-education/">https://blog.press.princeton.edu/2018/01/23/bryan-caplan-on-the-case-against-education/</a> and <a href='https://www.latimes.com/opinion/op-ed/la-oe-caplan-education-credentials-20180211-story.html'>https://www.latimes.com/opinion/op-ed/la-oe-caplan-education-credentials-20180211-story.html</a>

<a name="f8">8.</a> Nothing machines do is for show, only for function. 






    




  

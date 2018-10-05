---
layout: post
title:  "Innovation and Globalization"
date:   2018-05-25 16:00 
categories: writing 
---

In [Zero to One](https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296), 
Peter Thiel's manifest on startups and the future, he argues that **innovation**---doing/ 
creating something new---is fundamentally more important than **globalization**---implementing/ 
copying in other places what has been shown to work in innovation centers.  

One of his main arguments is that globalization focuses on dis/replacing workers 
with automation, while innovation focuses on complementing workers with it.  In the 
first place, I'm not sure this is true. And, in the second place, even if it is, 
it still seems uncompelling. 

He had a few other arguments for why innovation > globalization, but I don't recall
him giving a simple, clear argument that was obviously true.  To be clear, 
I think he is right.  It does seem that innovation is more important than 
globalization, but I'm not exactly sure why.   

## A Rough Estimate  

Let's try to see what innovation and globalization are more precisely. These
aren't discrete categories of activity, but rather more continuous quantities: some 
activities are more globalizing/ spreading and some are more innovating/ advancing.  
But any given activity seems to have properties of both spreading and advancing.  The 
question then is: what does this space of spreading/ advancing activities look like? 

Let's start with trying to define a rough/ abstract estimate of any activity's
utility, with the thought that this might give us factors/ metrics that could be
used to contruct such a space. A rough estimate of the utility of an globalizing or 
innovative activity might something like: 

\\[ U_{gain} \propto t_{gain} \times u_{gain} \times n \\]

Where \\( t_{gain} \\) is the time gained from your doing this activity now, versus
others doing this activity later. Or: 

\\[ t_{gain} = t_{others} - t_{you} \\]

And \\( u_{gain} \\) is the per person per unit time gain in utility over someone
else's work/ product. Or: 

\\[ u_{gain} = u_{you} - u_{others} \\]

And \\( n \\) is the number of persons affected/ impacted by your work/ product, 
which we'll call scale. 

So, then, \\( U_{gain} \\) is the overall utility gained from your doing/ producing
your work/ product at some time \\( t_{you} \\) with some utility \\( u_{you} \\). 
And indeed these factors seem to immediately suggests a useful estimation space for 
delineating innovation/ globalization, because we can tell immediately which ones
innovating versus globalizing activities focus on maximizing (to raise \\( U_{gain \\)). 

Primarily, innovation is concerned with increasing \\(t_{gain}\\) and \\(u_{gain}\\). 
You want to do things earlier than everyone else, and/or at the very least way 
better than has been done recently.  Ideally, you want \\(t_{gain}\\) to be at least 
a couple years and \\(u_{gain}\\) to be at least 3-10 times \\(u_{others}\\).  This 
is the space of innovation. 

Globalization is primarily (maybe even chiefly) concerned with increasing \\(n\\). 
You can do this by decreasing the cost of delivering \\(u_{gain}\\), thereby freeing
up more capital to increase production of more \\(u_{gain}\\) for more \\(n\\). Or 
more commonly by increasing the locations at which you offer \\(u_{gain}\\), 
thereby increasing demand for \\(n\\). 

## Area under a Curve

Ok, so the above estimation seems kind of useful. But can we do better? 

There are a few assumptions built into this estimator that are less than ideal.  First, 
it assumes you do things earlier than others, which isn't the case for globalizing
activities.  It also assumes you do things better, which may also not be true of 
globalizing activities (whose quality might be compromised at the expense of increasing 
quantity).  All of which don't work because \\( U_{gain} < 0 \\) isn't useful for this 
sort of calculation/ estimation. 

Another unrealistic assumption of this equation is that \\(n\\) and \\(u\\) don't 
change over \\(t_{gain}\\), which definitely shouldn't be the case if you and/or your 
company are improving their work/products over time.  And this is quite important 
for quantifying innovative activities that are (or are supposed to be) high growth.  

A more accurate representation would be the following:    

\\[ U \propto \int_{t_{i}}^{t_{f}} u(t) \ast n(t)   dt \\]

Where \\(u(t)\\) and \\(n(t)\\) are the utility and scale functions of your work/ product 
at some time \\(t\\). 

So \\(U\\) then would be true overall utility of your work/ product over some time period \\(t_i\\)
to \\(t_f\\), which is more realistically how things work. 

## Innovation > Globalization? 

So what about if we had two activities or endevours we that we had the potential to focus on: 
say, working for a small startup focused on a new and narrow area of technology, or working for
a large established company that deploys well-established broad technologies across the globe. 
How would you decide which to choose? Obviously, this is a tough choice and involves many factors, 
but what you could do is try to quasi-compute \\(U\\) for each activity and then compare them 
to see which would ultimately give you highest yield.

You would inevitably have to do some guesstimation to get at these values, but the point is: 
I'd argue **you have to do this math** in order to really say innovation > globalization. I 
don't believe it's as simple as saying innovation > globalization in all cases, because you could
easily imagine in this case that the bigger company may be a more sure-fire way of having
utility.  

That said, though, if you're similar to me (i.e. live in an American city, particularly a hub
of innovation), then more likely than not it will much easier to achieve higher 
\\(u_{gain}\\) and \\(t_{gain}\\) than anywhere else.  We have access to the most cutting-edge 
science and technology.  And probably even greater access to capital to increase \\(n\\) over 
time. Environments/ conditions can be conducive to innovating over globalizing, or vice versa.  

And also from all this, there are some more implications for globalizing activities.  If you need 
to achieve very high \\(n\\) (since you have to compensate for the modesty of your other factors), 
you must have access to resources and systems sufficient to achieve large scale. And this doesn't 
happen overnight.  

If you want to engage/ impact globalizing activities meaningfully, you probably have to join a company with 
established resources.  A company which has its own culture, agenda and many other individuals.  In this case, 
your contribution would be diluted (i.e. \\(u_{you}\\) would be some fraction \\(\alpha\\) of the 
company's \\(u_{company}\\) where \\(\alpha\\) small), much more so than if you were a part of an innovative 
company, which would likely be smaller (and so \\(\alpha\\) bigger).  If you could obtain a 
highly influential position in such a company, though, then you could increase your \\(\alpha\\) to 
the point where \\(\alpha u_{company} \ast n \\) might be comparable to your working at a start-up,
if their \\(n\\) is sufficiently small. 








    




  

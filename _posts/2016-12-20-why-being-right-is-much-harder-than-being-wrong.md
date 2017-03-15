---
layout: post
title:  "Why Right Is Harder Than Wrong"
date:   2016-12-20 00:00 
categories: writing
---

## Wrong Is More Likely 

The state of "being right", in the most general sense (i.e. for any statement of fact, solution to problem) can be described as: 

$$ \prod_{i=1}^{N} b_i = 1  \hspace{2.5mm} \mid \hspace{2.5mm} b_i \in \{0, 1\} $$  

Where $$N$$ is the number of "atomic" assertions/ pieces/ dimensions (i.e. binary variables $$b_i$$ that take value True = $$1$$ or False = $$0$$), which that statement/ solution/ answer can be broken into. 

Whereas the state of "being wrong" is: 

$$ \prod_{i=1}^{N} b_i = 0  \hspace{2.5mm} \mid \hspace{2.5mm} b_i \in \{0, 1\} $$

With this, it's clear why being wrong is easier than being right: it's just much more probable. 

For any statement of $$N$$ dimensions, there's only $$1$$ wasy to be right (a vector of $$N$$ $$1$$s) and $$2^N-1$$ 
ways to be wrong ($$2^N$$ combinations minus the case of all $$1$$s). And so it follows that for any statement $$S \in \{$$**Right**$$,$$**Wrong**$$\}$$: 

$$ Pr\{S =$$ **Right**$$\} = \frac{1}{2^N}$$  
{: style="text-align: center;"}
$$ Pr\{S =$$ **Wrong**$$\} = \frac{2^N-1}{2^N}$$
{: style="text-align: center;"}

And from this, we see clearly why as problems get even a bit more complicated it becomes easier and easier to be wrong.  

~~~
In [1]: def prob(S, N):
   ...:     r = float(pow(2, N))
   ...:     if S: return(1.0 / r)
   ...:     else: return((r - 1.0) / r)
   
In [2]: list(map(lambda n: prob(False,n), range(1,10)))
Out[2]:
[0.5,
 0.75,
 0.875,
 0.9375,
 0.96875,
 0.984375,
 0.9921875,
 0.99609375,
 0.998046875]
~~~
{: .language-python}

There is a more than a $$0.98$$ chance we'll be wrong for problems of dimension $$6$$ or greater!

## A More General Way To Say The Same Thing

But this perspective is high-level, and says nothing of our probability of being right for any given "atomic" fact. More generally, we could say that the joint probability of a right statement is the product of the marginal probabilities of being right for all of a statement's atoms. Namely, 

$$ p_i = Pr\{b_i = 1\} $$
{: style="text-align: center;"}
$$ Pr\{S = $$ **Right**$$\} = \prod_{i=1}^{N} p_i $$
{: style="text-align: center;"}

And then since a wrong statement is all other possibilities besides all $$1$$s

$$ Pr\{S = $$ **Wrong**$$\} = 1 - \prod_{i=1}^{N} p_i $$
{: style="text-align: center;"}

Here, if we set the probability of being right for any given atom (saying $$p_i = p \hspace{3mm} \forall i$$), we can drastically raise of probability of being right for a statement if we raise the probability of a right atom: 

~~~
In [3]: def prod(L):
   ...:     if len(L) == 1:
   ...:         return(L[0])
   ...:     elif len(L) == 2:
   ...:         return(L[0] * L[1])
   ...:     else:
   ...:         return(L[0] * prod(L[1:]))

In [4]: def prob(S, N, p):
   ...:     if S: return(prod(N * [p]))
   ...:     else: return(1.0 - prod(N * [p]))    
   
In [5]: # our original probability of being right

In [6]: list(map(lambda n: prob(True, n, 0.5), range(1,10)))
Out[6]:
[0.5,
 0.25,
 0.125,
 0.0625,
 0.03125,
 0.015625,
 0.0078125,
 0.00390625,
 0.001953125]
 
In [7]: # improved probability of being right
 
In [8]: list(map(lambda n: prob(True, n, 0.7), range(1,10)))
Out[8]:
[0.7,
 0.48999999999999994,
 0.3429999999999999,
 0.24009999999999992,
 0.16806999999999994,
 0.11764899999999995,
 0.08235429999999996,
 0.05764800999999997,
 0.04035360699999998]

In [9]: # what is the improvement, specifically? 
 
In [10]: list(map(lambda x: x[1]-x[0], 
    ...:      list(zip(list(map(lambda n: prob(True, n, 0.5), range(1,10))),
    ...:               list(map(lambda n: prob(True, n, 0.7), range(1,10)))))))
Out[10]:
[0.19999999999999996,
 0.23999999999999994,
 0.21799999999999992,
 0.17759999999999992,
 0.13681999999999994,
 0.10202399999999995,
 0.07454179999999996,
 0.05374175999999997,
 0.03840048199999998]
~~~
{: .language-python}

We still see the struggle of higher dimensions. Even with being right $$7$$ of $$10$$ times for any given fact (a tough feat itself), we have a less than $$10$$% chance of being right overall in dimensions greater than 6.  And even with increasing by $$20$$% our being right on atoms, we make less than a $$10$$% increase on overall rightness. 

## Some Good News (But It's Still Complicated)

It could be argued though, for any statment/ solution of $$N$$ dimensions, that only a certain fraction of those $$N$$ dimensions really _matter_ for achieving rightness. It could be argued that for any given solution only $$M$$ dimensions are really important, and the rest $$N-M$$ just _details_. 

We could call the process of identifying the $$M$$ atoms that really matter (of some $$N$$-dimensional problem)---ideally where $$M << N$$---dimensionality reduction. And we can see that the practice of **simplifying** problems (i.e. reducing to essential dimensionality) is very useful in reducing probability of wrongness.

~~~ 
In [11]: def dim_reduce_prob_delta(n_initial, n_final, p):
    ...:    return(prob(True, n_final, p) - prob(True, n_initial, p))
    ...:

In [12]: {str(n_i)+'->3': dim_reduce_prob_delta(n_i, 3, 0.7) 
    ...:  for n_i in range(4, 10)}
Out[12]:
{'4->3': 0.10289999999999999,
 '5->3': 0.17492999999999997,
 '6->3': 0.22535099999999997,
 '7->3': 0.2606457,
 '8->3': 0.28535198999999994,
 '9->3': 0.30264639299999996}
~~~
{: .language-python}

This is probably the reason why simplification has been touted so much by the greats. It's a powerful avenue toward being more right/ finding more truth.<sup id="a1">[1](#f1)</sup>  

But it's not always as simple as this, either.<sup id="a2">[2](#f2)</sup> For instance, how do we choose which dimensions are important versus which ones are not? Essentially, this is a problem of choosing $$M$$ dimensions out of $$N$$, of which there are $${N \choose M}$$ possibilities. Assuming there's only one possible set of most important dimensions then the probability of choosing the right set is: 

$$ Pr\{$$**Most Important Set**$$\} = \frac{1}{N \choose M} $$
{: style="text-align: center;"}

Which we can compute for some of the above dimensionality reductions. 

~~~
In [13]: from math import factorial

In [14]: def choose(n, k):
    ...:    return(factorial(n)/factorial(k)/factorial(n-k))
    ...: 
    
In [15]: {'prob_right_set{'+str(n_i)+' choose 3}': 1.0/choose(n_i, 3) 
    ...:  for n_i in range(4, 10)}
Out[15]:
{'prob_right_set{4 choose 3}': 0.25,
 'prob_right_set{5 choose 3}': 0.1,
 'prob_right_set{6 choose 3}': 0.05,
 'prob_right_set{7 choose 3}': 0.02857142857142857,
 'prob_right_set{8 choose 3}': 0.017857142857142856,
 'prob_right_set{9 choose 3}': 0.011904761904761904}
 
~~~
{: .language-python}

So picking the right dimensions isn't that easy either.

## Better News (History and Hierarchy)

But here's the deal, for any given problem, we're not starting from scratch. Someone somewhere has likely attacked whatever we might encounter (_nihil sub sole novum_). These days, there is always something that we can build upon, and these foundations are accessible more now than ever before.

There is also an ordering to nature that allows us to combine atoms into more general facts that have a form we might be more familiar with. So we don't always have to work at the level of atoms. We can work at higher levels which have lower dimension and which apply to lower levels. (General facts are functions of specific facts, but can also be treated themselves as "atoms".) This means dimensionality reduction can be less about choosing the right, most important, set and more about agregating atomic facts into higher level facts that can be more simply handled. 

No doubt these two advantages, history and hierarchy, can be formalized as well, just like the above. And they no doubt have been by researchers working at the intersection of cognitive and computational sciences (i.e. aritificial intelligence (AI) researchers). The hierarchy piece is probably a reason why deep learning techniques (with many layers of generality) are as effective as they are. The history piece also is captured by machine learning (ML) techniques that take sequences (which can be across time as well as space).

And, with this, we should realize that advances in ML/ AI actually apply to the way we think. We should take seriously the idea that computer science is not just an avenue toward building better software/ automation, but also has real implications for how we should think.<sup id="a3">[3](#f3)</sup>

<br>  
<br>  

----------- 
  
<a name="f1">1.</a> Emerson: "Simplify, simplify, simplify." [Go Back](#a1).

<a name="f2">2.</a> Einstein: "Things should be as simple as possible, but no less." [Go Back](#a2)

<a name="f3">3.</a> After all, we were the original computers. (And still are in fact, now just at higher levels.) [Go Back](#a3)
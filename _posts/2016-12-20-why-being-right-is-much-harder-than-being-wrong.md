---
layout: post
title:  "Why Right Is Harder Than Wrong"
date:   2016-12-20 00:00 
categories: writing
---

## Wrong Is More Likely 

The state of "being right", in the most general sense (applicable to both moral and logical contexts), for any statement of fact, or answer to a question/ problem, can be described in the following way: 

$$ \prod_{i=1}^{N} b_i = 1  \hspace{2.5mm} \mid \hspace{2.5mm} b_i \in \{0, 1\} $$  

Where $$N$$ is the number of "atomic" assertions or pieces or dimensions (i.e. binary variables $$b_i$$ that take truth value True $$1$$ or False $$0$$), which any statement/ solution/ answer can be broken down into. 

Whereas the state of "being wrong" is: 

$$ \prod_{i=1}^{N} b_i = 0  \hspace{2.5mm} \mid \hspace{2.5mm} b_i \in \{0, 1\} $$

With this, it's clear why it's easier to be wrong than right: it's simply much more probable. For any statement/ solution/ answer of $$N$$ dimensions, there is only $$1$$ to be right, a vector of $$N$$ $$1$$s, and $$2^N-1$$ ways to be wrong ($$2^N$$ combinations minus the case of all $$1$$s). So, it follows formally, for any statement $$S \in \{$$**Right**$$,$$**Wrong**$$\}$$: 

$$ Pr\{S =$$ **Right**$$\} = \frac{1}{2^N}$$  
{: style="text-align: center;"}
$$ Pr\{S =$$ **Wrong**$$\} = \frac{2^N-1}{2^N}$$
{: style="text-align: center;"}

And we see that why as problems get more complicated, it becomes much easier to be wrong, even in seemingly small increases in problem dimensionality.  

~~~
In [1]: def prob_wrong(N):
   ...:     comb = float(pow(2, N))
   ...:     return((comb - 1.0)/comb)
   
In [2]: list(map(prob_wrong, range(1,10)))
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

But this perspective is sort of high-level, and says nothing of our probability of being right in any given "atomic" fact. What we could say is that the joint probability of a right statement is the product of the marginal probabilities of being right for any of that statement's "atomic" facts. Namely, 

$$ p_i = Pr\{b_i = 1\} $$
{: style="text-align: center;"}
$$ Pr\{S = $$ **Right**$$\} = \prod_{i=1}^{N} p_i $$
{: style="text-align: center;"}

This is a simple generalization of the above. In this framework, if we raise of probability of being right for any given statement (that is, say $$p_i = p \hspace{3mm} \forall i$$), we can drastically raise of probability of being right: 

~~~
In [3]: def prod(int_lst):
   ...:     if len(int_lst) == 1:
   ...:         return(int_lst[0])
   ...:     elif len(int_lst) == 2:
   ...:         return(int_lst[0] * int_lst[1])
   ...:     else:
   ...:         return(int_lst[0] * prod(int_lst[1:]))

In [4]: def prob_right(n, p):
   ...:     return(prod(n * [p]))
   ...:
   
In [5]: # our original probability of being right

In [6]: list(map(lambda n: prob_right(n, 0.5), range(1,10)))
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
 
In [8]: list(map(lambda n: prob_right(n, 0.7), range(1,10)))
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
~~~
{: .language-python}

Definitely an improvement. 

~~~
In [9]: # difference b/t original and improved
 
In [10]: list(map(lambda x: x[1]-x[0], list(zip(list(map(lambda n: prob_right(n, 0.5), range(1,10))),
    ...:                                        list(map(lambda n: prob_right(n, 0.7), range(1,10)))))))
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

But we still see the struggle of higher dimensions. Even with being right $$7$$ of $$10$$ times for any given fact (a tough feat in it of itself), we have a less than $$10$$% chance of being right overall in dimensions greater than 6.  And even with increasing by $$20$$% our being right on atomic facts, we make less than a $$10$$% increase on overall rightness. 

## Some Good News (But It's Still Complicated)

It could be argued though, for any statment/ solution of $$N$$ dimensions, that only a certain fraction of those $$N$$ dimensions really _matter_ for achieving rightness. It could be argued that for any given solution only $$M$$ dimensions are really important, and the rest $$N-M$$ just _details_. 

We could call the process of identifying the $$M$$ "atomic" facts (of some $$N$$-dimensional problem) that really matter---ideally where $$M << N$$---dimensionality reduction. And we can see from the above result that the practice of **simplifying** problems (i.e. reducing to bare essential dimensionality) is essential to reducing the probability of wrongness, in any situation.

~~~ 
In [11]: def dim_reduction_prob_right(n_initial, n_final, p):
    ...:    return((lambda ps: ps[1]-ps[0])(list(map(lambda n_: prob_right(n_, p), [n_initial, n_final]))))
    ...:

In [12]: {str(n_i)+'->3': dim_reduction_prob_right(n_i, 3, 0.7) for n_i in range(4, 10)}
Out[12]:
{'4->3': 0.10289999999999999,
 '5->3': 0.17492999999999997,
 '6->3': 0.22535099999999997,
 '7->3': 0.2606457,
 '8->3': 0.28535198999999994,
 '9->3': 0.30264639299999996}
~~~
{: .language-python}

This is probably the reason why simplification has been touted so much by the greats. It's a powerful avenue toward being more right, finding more truth, etc.<sup id="a1">[1](#f1)</sup>  

But it's not always as simple as this, either. For instance, how do we choose which dimensions are important versus which ones are not? Essentially, this is a problem of choosing $$M$$ dimensions out of $$N$$, of which there are $${N \choose M}$$ possibilities. Assuming there's only one possible right answer to the set of most important dimensions than the probability of choosing the right set is: 

$$ Pr\{$$**Most Important Set**$$\} = \frac{1}{N \choose M} $$
{: style="text-align: center;"}

Which we can compute for some of the above dimensionality reductions. 

~~~
In [13]: import math

In [14]: def choose(n, k):
    ...:    fact=math.factorial
    ...:    return(fact(n)/fact(k)/fact(n-k))
    ...: 
    
In [15]: {'prob_right{'+str(n_i)+' choose 3}': 1.0/choose(n_i, 3) for n_i in range(4, 11)}
Out[15]:
{'prob_right{4 choose 3}': 0.25,
 'prob_right{5 choose 3}': 0.1,
 'prob_right{6 choose 3}': 0.05,
 'prob_right{7 choose 3}': 0.02857142857142857,
 'prob_right{8 choose 3}': 0.017857142857142856,
 'prob_right{9 choose 3}': 0.011904761904761904}
 
~~~
{: .language-python}

So picking the right dimensions isn't that easy either.

## Better News (History and Hierarchy)

But here's the deal, for any given problem, we're not starting over from scratch. Someone somewhere has likely attacked any problem we might encounter (_nihil sub sole novum_); these days, there is always something that we can build upon and these foundations are more accessible now more than ever.

There is also an ordering to nature, to things, that allows us to combine "atomic" facts into higher-level more general facts that have a form we might be more familiar with. And so we don't always have to work at the level of atoms. We can work at higher levels (which have lower dimension) and the decisions we make, truth values we choose, would apply at lower levels. (Higher level facts are functions of lower level facts, but can also be treated as "atomic" facts.) Allowing for dimensionality reduction to be less about choosing the right, most important, set and more about agregating atomic facts into higher level facts that can be more **simply** handled. 

No doubt these two advantages, history and hierarchy, can be formalized as well, just like the above. And they no doubt have been by machine learning (ML) researchers. The hierarchy piece is probably a reason why deep learning techniques (with many layers of generality) are as effective as they are. The history piece also is captured by ML techniques that take sequences (which could be sequences across time as well as space).

And, with this, we should realize that advances in ML really do apply to the way we (humans) make decisions. We should take seriously the idea that computer science is not just an avenue to build better software, but also has implications for how we (as computing machines ourselves) should think.<sup id="a2">[2](#f2)</sup>

<br>  
<br>  

----------- 
  
<a name="f1">1.</a> Emerson: "Simplify, simplify, simplify." Einstein: "Things should be as simple as possible, but no less." [Go Back](#a1).

<a name="f2">2.</a> We were after all the original computers. (And still are in fact, just now at a higher level.)
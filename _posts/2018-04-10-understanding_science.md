---
toc: true
layout: post
title:  "Understanding Science (and Computer Programs)"
date:   2018-04-10 17:00 
categories: 
---

Understanding a scientific talk or paper is difficult business. Not only 
because the concepts can often be complicated, counterintuitive or unsettling. 
But also because even scientific talks/ papers are subject to errors. Depending 
the field's expected level of rigor, any given paper or talk will inevitably 
present with errors and ambiguities, especially when probed.  

Moreover, these errors can occur at 2 different levels. Either at (a) the level 
of language or (b) the level of logic. 

Language is the level concerned with the keywords and syntax that make up statements. 
Logic is the level concerned with how statements relate to one another, how they are 
ordered and how they combine together into a well-formed argument or claim. Language 
deals with sentences and logic deals with sets of sentences (and sets of sets of 
sentences, etc.).

Errors of language occur at the surface: ambigious or ill-defined terms, vague/
imprecise descriptors/ values, spelling/ grammatic inconsistency and so on. Logic 
errors occur at a deeper level and can be more difficult to identify,
since they often sit underneath layers of language errors. 

Once all language errors are corrected, those that remain are logical. A logic error 
occurs when you take a set of clean statements together, work out how they relate to one 
another and what they imply, and find the conclusion contradictory or fallacious. 

Now, these errors would be difficult enough to fix in isolation, but the real difficulty
arises because of how closely related language and logic are. 

With programming/ formal languages, language definitions dictate how the logic of that 
language works. This is also true with less formal languages (like scientific language), 
but the precise relations between language and logic break down in proportion to the language's
informality.   

If we take this analogy further, we can think of scientific papers as less formal 
equivalents of computer programs and mathematical proofs. And we see that the same categories 
of errors occur in these media.  A true mathematical proof can still be bad (i.e. inelegant, sloppy language). 
A working program can still be unreadable. Conversely, a beautifully written/ formalized mathematical proof 
can still be completely false/ bogus. 

When debugging a computer program, assuming ample amounts of time, I'd argue that it's
more important to start with correcting language errors first. Are you using the keywords 
correctly? Is the syntax error-free? Are you naming things in a readable, easily-understood 
manner? (That last one is easily the most difficult to get right. Analogous to picking 
base axioms to start with in a mathematical proof.)

Once those are taken care of, then you tackle the logic. Is the program really doing what
you want it to? Does the output make sense at every step? (This can also be pretty difficult
if you don't know what "truth" is.)

The goal of understanding/ crafting any scientific talk/ paper, then, should be to to get the 
language clean and error-free first. Formalize (i.e. mathematize) it as needed depending on 
the subtlety of the section (e.g. certain parts of the methods should be made as formal as possible). 
Then focus on seeing if the logic makes sense.








  

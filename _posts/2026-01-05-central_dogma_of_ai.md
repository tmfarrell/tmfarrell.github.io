---
toc: true
layout: post
title: 'The Central Dogma of AI'
date: 2026-01-05 08:00
categories: writing
---

## Being Data-Pilled

Andrej Karpathy was pretty data-pilled in [his podcast with Dharmesh](https://www.youtube.com/watch?v=lXUZvyajciY) last year. Seemed bearish on AI's current state and seemed to attribute that to the poor quality of the internet as a dataset.

This reminded me of the "data-centric AI" trend from a few years ago. During the deep learning boom, everyone obsessed over model architectures. Then [people realized cleaning data could beat using fancy new models](https://www.youtube.com/watch?v=avoijDORAlc).

This is probably why AI coding has taken off in the way it has. Not just because there's tons of data, but because **code is verifiable**, it either runs or doesn't. So the quality can be verified and improved. Compare that to the corpus of text from the internet, where quality can't be verified and is probably poor in many cases.

## AI As Data Compression

It's been said that AI is a type of "data compression." 

Data analysis and analytics are also examples of transforming/ compressing data into insights for specific questions. The latest wave of AI models are more general-purpose though, able to answer broader sets of questions. 

Given this, maybe AI should be thought of just another stage of the data/ analytical value chain? 

**Data**: 
- Raw measurements of a system or process, usually collected over time
- Least useful because it needs transformation into insights and actions that create real value (ie `Data -> Insight -> Action -> Value`)
- Importantly, the scope of data collection limits the space of possible questions that can asked of it and insights that can be derived 

**Analysis/ Analytics**: 
- Compression/ transformation of data into insights aimed at specific questions for a specific time point (analysis) or over multiple time points (analytics) 
- More useful than data insofar as the insights lead to actions that create real value (`Insight -> Action -> Value`) at a specific time (analysis) or over longer time spans (analytics)
- Questions are required input (ie `Data -> Question -> Analysis/ Analytics (Compression) -> Insight`), so the space of possible insights is limited by the scope of those questions

**AI**: 
- General-purpose data compression/ transformation 
- Most useful because it can not only provide insight but can also take actions that create real value (ie `AI = Insight + Action`)
- Questions are not necessarily required as input, only data is, which means AI can answer a broader set of questions and has a larger space of possible insights and actions (ie `Data -> AI (Compression) -> Question -> Insight -> Action`). That said, the model is still limited by the data it was trained on. 

This seems like the right way to think about AI, as a natural evolution of data work rather than a different thing entirely. 

## Central Dogma of AI

Just like biology has its central dogma (`DNA -> RNA -> Protein`), I'm calling this the Central Dogma of AI: **Data → Analysis/Analytics → AI**

Here are some of the parallels (although obviously not a perfect analogy): 

- **Data only becomes useful through transformation**, just like genes. It has to be compressed or transformed into insights and actions that create value. 

    This has always been true, however, companies are now leaving so much more value on the table by not leveraging their data. Particularly unstructured data, which is now much easier to transform and operationalize using AI.  

- **Poor quality or out-of-distribution data leads to poor performing AI.** Just like a pathogenic variant can lead to disease, incorrect data can lead to incorrect analysis, insights and actions. Same is true in this latest wave of AI. If a model is trained on poor data, it will learn the wrong weights and provide incorrect answers in general. As a result, [any task that can verified through high quality measurement/ data can be optimized and solved by AI.](https://www.jasonwei.net/blog/asymmetry-of-verification-and-verifiers-law)

- **Analysis/ analytics bridge the gap between data and AI** (like RNA bridges DNA to proteins). In traditional AI/ ML model development, you need to analyze performance metrics on validation/ testing datasets to assess how well the model is performing. Deeper error analysis can lead to uncovering poor quality data, or other ways to improve the model. When deploying models, you also need to measure and track its performance in production (ie analytics in the ML/ AI Ops loop).  

    This latest wave of AI is no different. To develop effective AI-driven workflows or agents, you need to measure the performance of the output through formal evaluations (["evals" for short](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)). Evaluations help improve an AI workflow/ agent's performance by iterating on data/ context, prompts, etc. When deploying to production, you also need to instrument and measure the AI agent's outputs to assess its effectiveness for real-life work.

- Similar to proteins, **AIs are machines that can do work and take action**. Analysis/ analytics can only give insight, not action. AI can do both. AIs are workhorses of data, just like proteins are workhorses of the cell.  

- However, **AI isn't useful without the right data.** This latest wave of AI models can still be thought of as predictive models, which are fundamentally data transformers that take inputs (ie prompts and context) and predict outputs. If the model is fed the wrong data/ context at inference time, it will provide incorrect outputs. This is why context engineering has become a thing. Having the right data at inference is critical to making AI as accurate and useful/ valuable as possible. 


## Implications/ Predictions

Ok, this is all well and good, but so what? We can use this framework to make some predictions: 

- **Data rich domains will be the first to be transformed by AI.** Particularly domains that with lots of unstructured data that was previously much harder to transform and operationalize. This is why there's so much excitement about AI for healthcare and bio: both are dominated by unstructured data and workflows, which make it difficult for traditional/ deterministic software solutions to succeed.  

- **Task verification and data collection/ quality will be become even more important.** The data centric AI trend will continue in this next wave of AI, and it will become even more sophisticated. You can see this with the rapid success of new companies for data labeling and reinforcment learning environments. Both are aimed at addressing this.  

- **AI will replace the need for analysis/ analytics** in almost all cases. One of the biggest pain points of any data analysis or analytics dashboard is they usually raise as many questions as they answer. AI is an antidote to that. You don't need to know questions at analysis/ analytics time, just answer any follow-ups right there in the chat. AI will overtake analysis/ analytics solutions/ products for this reason. Customers/ users will come to expect it.   

- **Data/ analytics experience translates to AI**. The good news for folks with extensive data/ analytics experience will see that the same principles/ skills also translate/ apply to AI. 


## Final Takeaway

The most important takeaway? Fundamentally, AI isn't very different from data and analytics work. It's a next phase of evolution.

Orgs that treat AI as completely separate from existing data capabilities struggle. Those that see it as the next step in analytical maturity succeed.

Fundamentally, AI is still about turning data into action and real value. The compression is more sophisticated, but the challenges are the same.
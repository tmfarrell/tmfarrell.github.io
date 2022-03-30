---
layout: post
title:  "Agile Product Management from Scratch"
date:   2021-11-29 08:00
categories: writing
---

### Product Objectives

This should be done at the beginning of a product management/ development lifecycle:

- Describe 3-5 high-level objectives that your business wants to achieve with their product(s)
- For each of those objectives, list 3-5 **quantifiable** key results that define the criteria for determining whether that objective was achieved. These key results should be metrics that can be tracked throughout the product development lifecycle.
    - These key results should also be designed such that they complement each other. For example, if there is one key result tracking a quantity (e.g. increasing # of active users) there should be another key result that tracks quality (e.g. decreasing churn rate).
- These objectives and key results (OKRs for short) should be refined and revisited each quarter. The most important objectives will not change very frequently while the key results should be updated quarterly.

This is a great reference for how to write good OKRs [https://www.whatmatters.com/faqs/okr-examples-and-how-to-write-them/](https://www.whatmatters.com/faqs/okr-examples-and-how-to-write-them/).

### Product Team

- Composition:
    - Product Manager
    - Design Team: 0-1 Designer (depending on if product has a user interface)
    - Engineering Team: 2-8 Engineers
- Duration: Ideally a sustained, durable team dedicated to developing a single product throughout its lifecycle.

### Product Development Process

- This as a four-step cyclic, iterative process that the whole team participates in. The third step in the cycle is commonly referred to in Scrum methodology as a "sprint"[[1]](https://www.amazon.com/Scrum-Doing-Twice-Work-Half-ebook/dp/B00JI54HCU/), while the first two steps are design-focused and commonly referred to as a "design sprint"[[2]](https://www.amazon.com/Sprint-Solve-Problems-Test-Ideas/dp/1442397683).
- The first two steps in the process can be done at the same time, on the same rhythm as the third step, however there should be an offset where the design team/ sprint is developing designs for future/ upstream features or user stories and the engineering team/ sprint is focused on implementing those features that have already been designed in prior design sprints. The last step of the process, "validation", should ideally be done continuously and is mostly the responsibility of the PM.[[3]](https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation-ebook/dp/B004J4XGN6/)

1. **Discovery** (Frame and Plan)
    - Interact with users/ customers to understand their biggest pain points or most desired features.
    - Decide what product features to prioritize that address those needs/ wants, taking into account the business objectives defined above and what value propositions can be offered.
    - This phase should end with a prioritized list of user stories that can be used to design/ build and test prototypes for usability, business viability, feasibility, etc.
    - _Participants_: PM, designer and at least one engineer


2. **Design** (Prototype and Test)
    - Take the prioritized list of user stories and produces prototypes to be validated with customers.
    - Based on those results, the most promising user stories should be added and prioritized on the product backlog.
    - _Participants_: PM, designer and at least one engineer


3. **Development** (Build and Launch/ Deploy)
    - This phase should start with a prioritized product backlog.
    - This phase lasts 2-4 weeks, starts with a sprint planning meeting to discuss the goal of that sprint (ideally to complete a set of related user stories, or epic) and ends with a sprint "demo" where the team showcases what they've build to stakeholders. The sprint should also end with an internal retrospective to discuss what could have been improved during the sprint.
    - Throughout the sprint, the team is should meet for 15-mins at the start of each day to check-in on progress towards the sprint goal and remove any obstacles to progress. This meeting is commonly referred to as "standup".
    - _Participants_: PM, engineering team


4. **Validation** (Test)
    - This phase requires the PM to validate that what was built and released to users had a positive impact on the product objectives.
    - This phase will naturally lead back into the discovery phase if a feature didn't have the desired outcome, or if it did and there are now new objectives the team needs to prioritize and focus on accomplishing.
    - _Participants_: PM

### Product Backlog

*The product backlog is important enough that it warrants its own section*
- The product backlog is a list, ideally prioritized, of user stories (essentially features) grouped into related sets called epics (essentially high-level user stories that describe a larger component with related features) that define the vision for the end product.
- The backlog is owned and mainly built by the PM, especially for adding in stories gleaned from discussions with customers and stakeholders. However, the engineering team also adds stories and/ or tasks related to product technical debt that also need to be prioritized and addressed.
- The product backlog should be on a system where everyone can view it and understand where the team is in terms of making progress towards sprint goals. One of the most popular systems out there is [Jira](https://www.atlassian.com/software/jira) but there is also [Trello](https://trello.com/en) and others.


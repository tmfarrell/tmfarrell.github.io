---
layout: post
title:  "Agile Product Management from Scratch"
date:   2021-11-29 08:00 
categories: writing
---

### Product Objectives

This should be done at the beginning of a product management/ development lifecycle

- Describe 3-5 high-level objectives that your business wants to achieve with their product(s)
- For each of those objectives, list 3-5 **quantifiable** key results that define the criteria for determining whether that objective was achieved. These key results should be metrics that measure outcomes described in the objectives.
    - These key results should also be designed such that they complement each other
- These objectives and key results (OKRs for short) should be refined and revisited each quarter. The most important objectives will not change very frequently while the key results should be updated each quarter

This is a great reference for how to write good OKRs [https://www.whatmatters.com/faqs/okr-examples-and-how-to-write-them/](https://www.whatmatters.com/faqs/okr-examples-and-how-to-write-them/). 

### Product Team

- Composition:
    - Product Manager
    - Design Team: 0-1 Designer (depending on if product has a user interface)
    - Engineering Team: 2-8 Engineers
- Duration: Ideally a sustained, durable team dedicated to developing a single product throughout its lifecycle

### Product Management/ Development Process

This is a cyclic, iterative process that the whole team is involved with: 

1. Discovery (Frame and Plan)
    1. Interact with users/ customers to understand their biggest pain points or most desired features 
    2. Decide what product features to prioritize that address those needs/ wants, taking into account the business objectives defined above and what value propositions can be offered
    3. This phase should end with a prioritized list of user stories that can be used to design/ build and test prototypes for usability, business viability, feasibility, etc.  
    4. Participants: PM, designer and at least one engineer
2. Design (Prototype and Test)
    1. Takes the prioritized list of Stories and produces prototypes to be shared and tested with customers
    2. Based on the testing results, the most promising user stories should be added and prioritized on the product backlog 
    3. Participants: PM, designer and at least one engineer 
3. Development (Build and Launch/ Deploy)
    1. This phase should start with a prioritized product backlog 
    2. This phase is commonly referred to in the agile scrum methodology as the "sprint". It lasts 2-4 weeks, starts with a sprint planning meeting to discuss the goal of that sprint (ideally to complete a set of related user stories, or epic) and ends with a sprint "demo" where the team showcases what they've build to stakeholders. The team also ends the sprint with an internal retrospective to discuss what could have been improved during the sprint, so that the team can address those areas and improve during subsequent sprints. The sprint is also characterized by a 15-min standup meeting every day to check-in on progress towards the sprint goal and remove any obstacles to progress   
    3. Participants: PM, engineering team 
4. Validation (Test)
    1. This phase requires the PM to validate that what was built and released to users had a positive impact on the product objectives
    2. This phase will naturally lead back into the discovery phase if a feature didn't have the desired outcome, or if it did and there are now new objectives the team needs to prioritize and focus on accomplishing 
    3. Participants: PM

### Product Backlog

The product backlog seems important enough that it should get its own section
- The product backlog is a list, ideally prioritized, of user stories (essentially features) grouped into related sets called epics (essentially high-level user stories that describe a larger component with related features) that define the vision for the end product
- The backlog is owned and mainly built by the PM, especially for adding in stories gleaned from discussions with customers and stakeholders. However, the engineering team also adds stories and/ or tasks related to product technical debt that also need to be prioritized and addressed
- The product backlog should be on a system where everyone can view it and understand where the team is in terms of making progress towards sprint goals. One of the most popular systems out there is [Jira](https://www.atlassian.com/software/jira) but there is also [Trello](https://trello.com/en) and others.
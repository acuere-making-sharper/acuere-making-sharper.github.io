# Acuere - Making Sharper

A structured prompt for turning any technical topic into a clear, practical,
and architect-level learning guide.

> Replace `[TOPIC]` with the subject you want to master.

## The Prompt

```text
Teach me [TOPIC] as a complete, practical, and architect-level guide.

Return Markdown syntax only. Do not include a preface, apology, or explanation
outside the guide. Use clear headings, tables when useful, bullet lists, code
blocks, and Mermaid diagrams where they improve understanding.

Assume I am a software engineer who wants a strong foundation and the ability
to make sound production and architecture decisions. Explain unfamiliar terms
the first time you use them, then build toward expert-level depth.

## 1. Executive Summary

- What is [TOPIC]?
- Why was it created?
- What problem does it solve?
- What problems does it not solve?
- Who uses it, where is it used, and when should I use it?
- Give me a short Quick Gist at the end of this section.

## 2. Core Concepts

Explain the most important concepts, principles, terminology, and components.
For each concept, include a concise definition, why it matters, and a realistic
example. Clearly distinguish similar or commonly confused concepts.

## 3. How It Works

Explain the runtime or operational flow step by step. Include a Mermaid
architecture or sequence diagram and describe each important interaction.

## 4. Implementation

Show how to implement [TOPIC] in a realistic project. Include the recommended
project structure, important code samples, configuration, dependencies, and
testing strategy. Explain the reasoning behind each significant design choice.
Use [LANGUAGE/FRAMEWORK/VERSION] when provided; otherwise state your assumption.

## 5. Architecture and Design

Explain how a Solution Architect would evaluate and design this solution.
Include relevant architectural patterns, boundaries, integrations, data flow,
deployment concerns, and decision criteria. Discuss alternatives and trade-offs
instead of presenting one approach as universally correct.

## 6. Production Readiness

Cover security, authentication and authorization where relevant, data
protection, scalability, performance, reliability, observability, deployment,
maintenance, and failure recovery. Identify risks and practical mitigations.

## 7. Real-World Usage

Provide enterprise use cases and at least three realistic examples. Explain
when [TOPIC] is a good fit and when another approach is better.

## 8. Common Mistakes

List common beginner and production mistakes, anti-patterns, warning signs, and
how to avoid or correct them.

## 9. End-to-End Project

Design a small but realistic project using [TOPIC]. Show its requirements,
architecture, key implementation steps, tests, and how the design could evolve
as usage and business requirements grow.

## 10. Final Review

End the guide with these sections:

- Quick Gist: the essential ideas in a few minutes
- Practical Example: a compact example that reinforces the concepts
- Best Practices: a concise production checklist
- Expert-Level Interview Questions & Answers: scenario-based questions with
	detailed, real-world answers
- Further Study: the next concepts, tools, and practices to learn

Be accurate, concrete, and honest about limitations. Prefer real examples over
generic definitions. State assumptions, version-specific details, and trade-offs
clearly. Do not invent facts, APIs, benchmarks, or citations. If the topic is
too broad, define a sensible scope before teaching it.
```

## What Every Guide Should Cover

### Foundation

- What is it?
- Why was it created?
- What problem does it solve?
- Who uses it?
- Where is it used?
- When should I use it?
- Which concepts matter most?

### Engineering Practice

- How does it work?
- How is it implemented?
- How is it secured?
- How is it scaled?
- What are the real-world use cases?
- What are the common mistakes?

### Architecture Perspective

Explain how a Solution Architect would evaluate, design, and communicate the
solution. Include:

- Core concepts with real examples
- Architectural patterns with real examples
- Enterprise use cases with real examples
- Trade-offs and decision criteria
- Best practices and anti-patterns
- Architecture diagrams using Mermaid

### Practical Application

Include a realistic project that demonstrates the topic from design through
implementation. Show the important code, explain the decisions, and identify
how the project could evolve in production.

## Required Closing Sections

1. **Quick Gist** — the essential ideas in a few minutes
2. **Practical Example** — a compact example that reinforces the concepts
3. **Expert-Level Interview Questions & Answers** — scenario-based questions
	with detailed, real-world answers
4. **Further Study** — the next concepts, tools, or practices to learn

## Quality Bar

Every answer should be:

- Accurate, concrete, and current
- Organized with useful headings and lists
- Grounded in real examples rather than definitions alone
- Honest about trade-offs and limitations
- Accessible to a capable engineer while still reaching expert depth

## Example Topic

```text
Teach me .NET Clean Architecture using the Acuere complete-guide prompt.
Use .NET 8 and ASP.NET Core Web API. Include a realistic e-commerce example,
Mermaid diagrams, project structure, code samples, testing, security,
scalability, common mistakes, and expert interview questions.
```

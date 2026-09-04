# Claude Code Project Structure and How to Use It

The best way to think about **Claude Code** is:

> **Your normal software project + a `.claude` layer that teaches and configures Claude to work consistently inside that project.**

Claude Code can explore your repository, modify files, run commands, execute tests, and work through multi-step development tasks. The most important project-level concepts are **`CLAUDE.md`**, **skills**, **subagents**, **hooks**, and project settings. ([Anthropic][1])

---

# 1. Recommended Claude Code Project Structure

For a professional application, I recommend something like this:

```text
my-project/
│
├── CLAUDE.md                     # Main instructions for Claude
├── README.md
├── package.json / *.csproj
├── .gitignore
│
├── .claude/
│   │
│   ├── settings.json             # Project-level Claude configuration
│   │
│   ├── skills/                   # Reusable specialized workflows
│   │   │
│   │   ├── architecture/
│   │   │   └── SKILL.md
│   │   │
│   │   ├── backend-development/
│   │   │   └── SKILL.md
│   │   │
│   │   ├── frontend-development/
│   │   │   └── SKILL.md
│   │   │
│   │   ├── code-review/
│   │   │   └── SKILL.md
│   │   │
│   │   └── testing/
│   │       └── SKILL.md
│   │
│   ├── agents/                   # Specialized subagents
│   │   │
│   │   ├── architect.md
│   │   ├── code-reviewer.md
│   │   ├── debugger.md
│   │   └── test-engineer.md
│   │
│   └── hooks/                    # Optional automation scripts
│
├── docs/
│   ├── architecture.md
│   ├── coding-standards.md
│   └── api-guidelines.md
│
├── src/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── api/
│
├── tests/
│
└── scripts/
```

This structure separates:

| Folder/File             | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `CLAUDE.md`             | Main project instructions                  |
| `.claude/skills/`       | Specialized reusable knowledge/workflows   |
| `.claude/agents/`       | Specialized AI roles                       |
| `.claude/hooks/`        | Automation around Claude actions           |
| `.claude/settings.json` | Project configuration                      |
| `docs/`                 | Architecture and engineering documentation |
| `src/`                  | Application source code                    |
| `tests/`                | Automated tests                            |

Skills are designed as folders containing a `SKILL.md`, with additional instructions, scripts, and resources added as complexity grows. This supports progressive loading of only the relevant context. ([Anthropic][2])

---

# 2. The Most Important File: `CLAUDE.md`

`CLAUDE.md` is essentially the **permanent onboarding document for Claude**.

Create:

```text
my-project/
└── CLAUDE.md
```

Example:

```markdown
# Project Overview

This is an ASP.NET Core application following Clean Architecture.

## Technology Stack

- .NET 10
- ASP.NET Core
- Entity Framework Core
- SQL Server
- MediatR
- FluentValidation
- xUnit

## Architecture Rules

The project follows these layers:

Domain
Application
Infrastructure
API

Dependencies must flow inward.

Domain must not depend on Infrastructure or API.

## Coding Standards

- Use async/await for I/O operations.
- Use dependency injection.
- Avoid static mutable state.
- Follow SOLID principles.
- Keep methods focused and small.
- Add tests for business logic.

## Before Making Changes

1. Understand the existing architecture.
2. Search for similar implementations.
3. Create a plan for significant changes.
4. Do not modify unrelated files.

## Before Finishing

Always:

1. Build the solution.
2. Run relevant tests.
3. Fix compilation errors.
4. Summarize modified files.
5. Explain architectural decisions.
```

## What should go in `CLAUDE.md`?

Put **stable project knowledge** there:

* architecture
* technology stack
* coding conventions
* folder conventions
* testing commands
* build commands
* security rules
* important domain concepts
* things Claude should never do

Do **not** put your entire documentation there.

Keep it focused and point Claude to detailed documentation when needed.

---

# 3. Start Using Claude Code

From your project root:

```bash
cd my-project
claude
```

Then you can ask:

```text
Analyze this project and explain the architecture.
```

Or:

```text
Read CLAUDE.md and the existing codebase.
Do not make changes yet.
Explain the architecture, dependencies, and important patterns.
```

This is one of the best first prompts for a new repository.

---

# 4. Use Claude Code in Three Modes

## Mode 1: Explore

Ask Claude to understand before changing anything.

```text
Explore the authentication implementation.

Do not modify code.

Explain:

- request flow
- important classes
- dependencies
- potential problems
```

Use this when:

* joining a new project
* understanding legacy code
* investigating bugs
* learning an architecture

---

## Mode 2: Plan

For larger changes, don't immediately say:

> "Implement this."

Instead:

```text
I want to add multi-tenant support.

First:

1. Analyze the current architecture.
2. Identify affected components.
3. Identify database changes.
4. Identify API changes.
5. Identify security concerns.
6. Create an implementation plan.

Do not modify files yet.
```

Then review the plan.

After that:

```text
Implement the approved plan.

Requirements:

- Follow CLAUDE.md.
- Preserve existing architecture.
- Add tests.
- Run relevant tests.
- Do not make unrelated changes.
```

This workflow is much safer for production systems.

Claude Code's own guidance emphasizes using planning and project context to make agentic work more reliable. ([Anthropic][1])

---

# 5. Skills: Reusable Developer Workflows

A **skill** is a reusable package of instructions and supporting resources.

Example:

```text
.claude/
└── skills/
    └── code-review/
        └── SKILL.md
```

Example `SKILL.md`:

```markdown
---
name: code-review
description: Review code for bugs, security, maintainability, performance, and architecture violations.
---

# Code Review Workflow

When reviewing code:

## Step 1: Understand Context

Read:

- CLAUDE.md
- affected files
- related implementations
- relevant tests

## Step 2: Review Categories

Check:

### Correctness
- bugs
- null handling
- edge cases

### Architecture
- dependency direction
- SOLID principles
- separation of concerns

### Security
- input validation
- authentication
- authorization
- secrets

### Performance
- unnecessary database queries
- N+1 queries
- blocking I/O

### Testing
- missing tests
- weak assertions
- edge cases

## Output

Return findings ordered by severity:

1. Critical
2. High
3. Medium
4. Low
```

Skills can contain more than just `SKILL.md`, such as scripts and additional reference files. Claude can load the detailed material only when the skill is relevant. ([Anthropic][2])

---

# 6. Skills I Recommend for Every Developer

For your goal of covering **design → architecture → implementation → testing**, I would create these:

```text
.claude/
└── skills/
    │
    ├── system-design/
    ├── architecture/
    ├── feature-development/
    ├── backend-development/
    ├── frontend-development/
    ├── debugging/
    ├── code-review/
    ├── testing/
    ├── refactoring/
    ├── security-review/
    ├── performance/
    └── documentation/
```

### Suggested responsibilities

| Skill                 | Responsibility                 |
| --------------------- | ------------------------------ |
| `system-design`       | High-level system design       |
| `architecture`        | Project architecture decisions |
| `feature-development` | End-to-end feature workflow    |
| `debugging`           | Root cause investigation       |
| `code-review`         | Quality and defect review      |
| `testing`             | Unit/integration test strategy |
| `refactoring`         | Safe code improvement          |
| `security-review`     | Security analysis              |
| `performance`         | Performance investigation      |
| `documentation`       | README/API/architecture docs   |

---

# 7. Subagents: Specialized AI Roles

Subagents are useful when you want different tasks or perspectives separated.

Example:

```text
.claude/
└── agents/
    ├── architect.md
    ├── backend-expert.md
    ├── code-reviewer.md
    └── test-engineer.md
```

## Architect

```markdown
# Role

You are a senior software architect.

## Responsibilities

- Analyze system architecture.
- Identify architectural risks.
- Propose scalable designs.
- Protect dependency boundaries.

## Rules

Do not implement code immediately.

First:

1. Understand requirements.
2. Analyze the existing architecture.
3. Identify alternatives.
4. Explain trade-offs.
5. Recommend an approach.
```

## Code Reviewer

```markdown
# Role

You are a senior code reviewer.

Focus on:

- correctness
- security
- maintainability
- performance
- architecture
- testing

Do not rewrite code unless requested.

Report findings with:

- severity
- location
- problem
- recommendation
```

Subagents are particularly useful for specialized roles, parallel investigation, and context isolation in larger repositories. ([Anthropic][3])

---

# 8. My Recommended Workflow

For every significant feature:

```text
                    ┌───────────────┐
                    │ Requirement   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Exploration   │
                    │ Understand    │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Architecture  │
                    │ Design        │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Implementation│
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Testing       │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Code Review   │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Build / Verify│
                    └───────────────┘
```

### Actual Claude prompts

#### Step 1 — Explore

```text
Analyze the current implementation.

Do not modify code.

Explain:

- relevant modules
- data flow
- existing patterns
- dependencies
- potential impact of this feature
```

#### Step 2 — Architect

```text
Design the implementation.

Consider:

- architecture
- scalability
- security
- performance
- testing

Give me alternatives and recommend one.
Do not implement yet.
```

#### Step 3 — Implement

```text
Implement the approved design.

Follow:

- CLAUDE.md
- existing project conventions
- architecture boundaries

Add or update tests.

Do not modify unrelated code.
```

#### Step 4 — Review

```text
Review the implementation as a senior engineer.

Check:

- correctness
- security
- performance
- architecture
- maintainability
- tests

Report findings first.
```

#### Step 5 — Verify

```text
Run the relevant build and tests.

Fix failures caused by your changes.

Then provide:

- files changed
- tests executed
- important decisions
- remaining risks
```

---

# 9. Best Structure for a Large .NET Project

Since you're interested in `.NET`, architecture, CQRS, RAG, and agent frameworks, I would personally recommend:

```text
MyProduct/
│
├── CLAUDE.md
│
├── .claude/
│   │
│   ├── settings.json
│   │
│   ├── skills/
│   │   ├── dotnet-development/
│   │   ├── clean-architecture/
│   │   ├── cqrs/
│   │   ├── testing/
│   │   ├── code-review/
│   │   ├── performance/
│   │   └── security/
│   │
│   └── agents/
│       ├── solution-architect.md
│       ├── dotnet-expert.md
│       ├── database-expert.md
│       ├── test-engineer.md
│       └── code-reviewer.md
│
├── docs/
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── decisions.md
│   │   └── diagrams.md
│   │
│   ├── api/
│   └── development/
│
├── src/
│   ├── MyProduct.Domain/
│   ├── MyProduct.Application/
│   ├── MyProduct.Infrastructure/
│   └── MyProduct.API/
│
├── tests/
│   ├── MyProduct.Domain.Tests/
│   ├── MyProduct.Application.Tests/
│   ├── MyProduct.IntegrationTests/
│   └── MyProduct.ArchitectureTests/
│
└── scripts/
```

---

# 10. The Biggest Mistake to Avoid

Don't treat Claude Code like autocomplete.

❌ Bad:

```text
Build the entire application.
```

Better:

```text
Analyze the requirements and existing project.

Create an implementation plan.

Wait for my approval before modifying files.
```

Then:

```text
Implement step 1 of the approved plan.
```

Then:

```text
Run tests and review the implementation before proceeding.
```

The most effective division of labor is generally for **you to own what and why**, while Claude handles more of the detailed exploration and execution. ([Anthropic][4])

---

# My Recommended Starting Setup for You

Start with just this:

```text
project/
│
├── CLAUDE.md
│
├── .claude/
│   ├── skills/
│   │   ├── architecture/
│   │   ├── dotnet-development/
│   │   ├── code-review/
│   │   └── testing/
│   │
│   └── agents/
│       ├── architect.md
│       └── reviewer.md
│
├── docs/
├── src/
└── tests/
```

Then gradually add more skills only when you repeatedly need a workflow. Avoid creating 30 skills immediately.

## Best next step

If you want, I can build you a **complete production-ready `.claude` folder template specifically for a .NET project**, including:

* `CLAUDE.md`
* Clean Architecture rules
* CQRS rules
* .NET coding standards
* Architecture skill
* Feature development skill
* Code review skill
* Testing skill
* Debugging skill
* Performance skill
* Security skill
* Specialized architect and reviewer agents

That would give you a ready-to-copy structure for your projects.

[1]: https://www.anthropic.com/webinars/claude-code-foundations?utm_source=chatgpt.com "Claude Code: Foundations | Webinars \ Anthropic"
[2]: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills?utm_source=chatgpt.com "Equipping agents for the real world with Agent Skills \ Anthropic"
[3]: https://www.anthropic.com/webinars/claude-code-advanced-patterns?utm_source=chatgpt.com "Claude Code Advanced Patterns: Subagents, MCP, and Scaling to Real Codebases | Webinars \ Anthropic"
[4]: https://www.anthropic.com/research/claude-code-expertise?utm_source=chatgpt.com "How Claude Code is used in practice \ Anthropic"

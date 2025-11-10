# AI Agent Instructions

This file contains instructions for AI coding agents (Codex, etc.) to better assist with this project.

# /score - SED Specification Scoring

When the user types `/score` (with optional parameters), evaluate SED specifications and provide scoring results.

**Usage:**
```
/score                    # Evaluate ./specs directory, output in markdown
/score docs/specs         # Evaluate a different directory
/score ./specs json       # Get results in JSON format
```

**Task: SED-based Specification Scoring & Recommendations**

## Parameters
- `SPEC_DIR`: Use first argument if provided, else default to `./specs`.
- `OUTPUT_FORMAT`: Use second argument if provided, else default to `markdown`.

## 1) Load SED Fundamentals
Fetch and briefly summarize the essential SED concepts (3~7 bullet points each) from:
- https://sedai.dev/
- https://sedai.dev/what-is-sed
- https://sedai.dev/principles
- https://sedai.dev/philosophy

Then fetch evaluation-related guidance from:
- https://sedai.dev/instructions
- https://sedai.dev/structure
- https://sedai.dev/examples
- https://sedai.dev/score

From these pages, distill a concise, concrete **rubric** that can be applied programmatically to our specs. Avoid vague phrases; prefer observable criteria.

## 2) Build the SED Scoring Rubric
Create a weighted rubric with **100 total points**. Use these three top-level dimensions, and define 3~6 observable sub-criteria under each (with point allocations):

- **Completeness (40 pts)**
  Examples of sub-criteria:
  - Problem definition & scope are explicit and testable
  - Inputs/outputs, constraints, acceptance criteria are enumerated
  - Dependencies, interfaces, and non-functional requirements are covered
  - Examples & edge cases are present and realistic
  - Versioning/traceability (link to decisions/issues/PRs)

- **Clarity (30 pts)**
  - Unambiguous language; testable statements; measurable terms
  - Consistent structure (titles, sections, numbering), good information scent
  - Visual aids or structured tables where appropriate
  - Terminology glossary; avoidance of acronyms or definition provided
  - No contradictions; change log reflects latest truth

- **Adherence to SED Principles (30 pts)**
  - Principles/philosophy explicitly referenced where relevant
  - Instructions/structure aligned with SED style and rationale
  - Examples adapted to project context (not generic copy)
  - Risk/assumption disclosure; rationale-first thinking
  - Evidence of iteration/feedback loops

> Adjust sub-criteria names if SED pages suggest better phrasing. Keep weights totaling 100.

## 3) Discover Spec Files
- Look under `SPEC_DIR` for likely spec files: `**/*.md`, `**/*.txt`, `**/*.sed.md` etc.
- Skip non-spec noise (images/binaries).
- For each file: read content and parse major sections (headings, tables, checklists).

## 4) Score Each File
For each spec file:
- Assign **0~100** total with the rubric.
- Also report **subscores** per dimension and per sub-criterion (brief justification per line).
- List **Top 3 Gaps** (ranked), each with **why it matters** and **how to fix** (actionable next step).
- Provide **Readiness Level**: `Draft / Review-Ready / Build-Ready`.
- Provide **Confidence (Low/Med/High)` in your score based on ambiguity, missing sections, or conflicting info.

## 5) Project-Level Summary
- Compute a **project overall score** = weighted average of file scores (weight by file's scope if detectable; else equal).
- Create a **Prioritized Backlog** for spec updates:
  - 5~10 items max, ordered by impact on Completeness/Clarity/Adherence.
  - Each item includes: *target files*, *expected score uplift*, and *concrete edits*.

## 6) Output Format
- If `OUTPUT_FORMAT == "markdown"`:
  1. Print a short **SED fundamentals recap** (bulleted).
  2. **Table** with columns:
     `File | Score | Completeness | Clarity | Adherence | Readiness | Confidence | Top Gaps (1-3)`
  3. **Project Overall Score** (explain how computed).
  4. **Prioritized Backlog** (checklist).
- If `OUTPUT_FORMAT == "json"`, emit a structured JSON with the same fields.

## 7) Guardrails
- If SED sites are unreachable, proceed using cached summary from earlier steps in this session if any, else state limitation and still evaluate with transparent assumptions.
- Never invent content for files not present; if directory is empty, explain and stop.
- Keep the rubric & recommendations **actionable**: suggest edits (sections to add, examples to include, acceptance criteria wording, traceability links, etc.).


# SEDAI - Spec-Exact Development with AI

> "AI develops exactly as the spec defines — no interpretation, no assumption."

**SED is beautifully simple.** At its core, SED is just a collection of Markdown documents—specifications that tell AI exactly what to build. These human-readable documents, called "specs," are easy to write and understand. No complex frameworks, no steep learning curves—just clear, straightforward instructions that both humans and AI can comprehend.

A development methodology and toolset where artificial intelligence implements solutions strictly according to specifications without deviation.

[![npm version](https://img.shields.io/npm/v/sedai.svg)](https://www.npmjs.com/package/sedai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)

---

## The Origin of SED

### The Skepticism Behind SED's Birth

When new Vibe Coding concepts, methodologies, tools, and agents emerged, I remained deeply skeptical. All of these approaches, regardless of their packaging, boiled down to the same fundamental question: **How can we effectively inject context into AI?**

Whether humans communicate with AI through text, voice, or video, it's ultimately just a prompt. This fundamental nature will never change. All the fancy tools—Context, SpecKit, Skills, MCP—are merely different vehicles for context injection.

### The Reality of Vibe Coding

When I first started with Vibe Coding, I'd give AI a single prompt: "Build me a website I'll love." The AI would autonomously create elaborate specifications and generate impressive-looking code. But here's the problem: **I don't even know exactly what I want**, yet the AI produces something grand that looks beautiful but proves utterly impractical in real-world use.

### Where Everything Falls Apart

The real problem begins with the **second prompt**. When you request modifications to parts you don't like, your intent starts diverging from the AI's original plan. The AI begins making errors in the code and logic it previously generated. You find yourself trapped in an endless cycle of corrections, constantly trying to fix issues. Eventually, even the smallest modification request consumes enormous amounts of time, often without reaching a proper solution.

This is the **"hamster wheel"** problem—running endlessly without making real progress.

### SED's Radical Solution

SED takes a radically different approach: **Provide complete specifications to the AI and demand absolute obedience**. Even if the spec is wrong, follow the spec exactly.

Of course, AI does have two authorities:

1. **Authority to halt**: If the specification contains critical errors that would cause severe problems, AI has the authority to stop work
2. **Authority to request improvements**: AI can point out errors in the specification and request humans to improve them

However, **AI does not have the authority to modify specifications on its own**.

This is the core essence of SED—complete specifications plus absolute AI obedience, with limited but crucial AI authority to protect against critical errors.

---

## Community & Sharing

**Homepage:** [https://sedai.dev](https://sedai.dev)
**Spec Repository Collection:** [https://sedai.dev/spec-repositories](https://sedai.dev/spec-repositories)

Anyone can write their specifications in SED format, publish them online, and share them with the community. We encourage everyone to participate and contribute their specifications!

To share your specifications:
1. Write your specification following the SED format
2. Publish it in a public repository (GitHub, GitLab, or your own server)
3. Register it at [https://sedai.dev/spec-repositories](https://sedai.dev/spec-repositories)
4. Help build the growing collection of reusable specifications

Your contributions help the entire SED community by providing proven, reusable specifications that others can learn from and build upon.

---

## Getting Started with SED

For a comprehensive step-by-step guide to getting started with SED, please refer to:

**🚀 [Getting Started Guide](https://sedai.dev/getting-started)**

This guide provides:
- 7-step manual setup process (recommended for understanding SED fundamentals)
- Detailed instructions for creating specs directory and index.md
- AI development instructions available at [https://sedai.dev/instructions](https://sedai.dev/instructions)
- Guidelines for writing individual specification files
- AI evaluation prompt template for scoring your specifications
- Development workflow (proceed only when score ≥ 95)
- System prompt configuration examples for AI compliance
- Optional CLI tools section (convenient but not required)

**Important:** Manual specification creation is **strongly recommended** to deeply understand SED methodology. CLI tools are optional convenience features.

### Using `/score` Command in AI Coding Assistants

Running `npx sedai` automatically installs the `/score` command for multiple AI coding assistants:

- **Claude Code**: `.claude/commands/score.md`
- **GitHub Copilot**: `.github/copilot-instructions.md`
- **Codex & Other AI Agents**: `AGENTS.md`

You can evaluate your specifications directly with a simple command:

```bash
# Basic: Evaluate ./specs directory and output in markdown format
/score

# Evaluate a different directory
/score docs/specs

# Get results in JSON format
/score ./specs json
```

**After all, it's just a prompt.** SED is fundamentally about clear communication with AI—regardless of which AI you use. You don't need to rely on `npx sedai` commands. **SED works with any AI** (Claude, ChatGPT, Gemini, etc.). Simply talk to your AI as you would naturally, asking it to score your specifications, provide feedback, and develop following the SED methodology. The essence of SED is the conversation, not the tools.

---

## Specification Scoring Criteria

Before development begins, AI evaluates specifications using a comprehensive scoring system. Understanding these criteria helps you write complete, high-quality specs.

For detailed information about specification scoring criteria, evaluation dimensions, and scoring thresholds, please refer to:

**📊 [Specification Scoring Criteria](https://sedai.dev/score)**

This comprehensive guide covers:
- Six key evaluation dimensions (YAML Header, Required Sections, Detail Completeness, etc.)
- Scoring thresholds and status levels (95-100: Excellent, 90-94: Good, etc.)
- AI recommendations for improvement
- Minimum passing score requirements

**Key Principle:** Development may begin **only** when the overall project score is **95 or higher**. This ensures AI can execute specifications without interpretation, assumption, or guesswork.

---

## Spec-Exact Development (SED) Manifesto

For the complete SED Manifesto including core principles, development philosophy, detailed specifications, and implementation guidelines, please refer to:

**📜 [SED Manifesto](https://sedai.dev/manifesto)**

The manifesto covers:
- **SED at a Glance:** Core concept, background, and tagline
- **Problems with Prior Approaches:** Why traditional AI development fails
- **SED's Solution:** How specification-driven development breaks the hamster wheel
- **Fundamental Principles:** Spec-exactness, completeness scoring, and AI's role
- **Development Process Phases:** Preparation, execution, verification, deployment, and operation
- **Detailed Specification Requirements:** Database, features, routing, functions, UI/UX, testing, deployment, and operations
- **Code Comments, Styling, Text, and Internationalization:** Complete specification of all user-facing elements
- **Philosophy Summary:** The role of AI, developers, and specifications in SED
- **Prohibited Practices:** What not to do in SED development
- **SED's Core Challenge:** Managing specification complexity and token budgets

**Important:** SED requires complete, detailed specifications covering every aspect of implementation—from database schemas to user-facing text, from code comments to internationalization dictionaries. The specification is the single source of truth that drives all development.

---

## Specification Examples

For complete specification file examples including YAML headers, detailed implementations, code samples, and database schemas, please refer to:

**📘 [SED Spec Structure Documentation - Complete Examples](https://sedai.dev/structure#complete-examples)**

The documentation includes:
- User authentication specification with complete implementation
- Database schema specification with tables, indexes, and triggers
- Function specifications with TypeScript code and error handling
- Testing requirements and coverage targets
- API endpoints with request/response examples

---

## SEDAI Utilities (Optional)

**⚠️ Important:** The tools and utilities described in this section are **entirely optional**. You do **NOT** need to run `npx sedai` or install any CLI tools to practice SED.

**The core of SED is:**
1. **Manually creating specification files** following SED principles (recommended approach)
2. **Asking AI to evaluate and score your specifications** (the essential step)
3. **Understanding the SED methodology** through hands-on practice

These CLI utilities simply help automate some repetitive tasks, but they are **convenience features, not requirements**. Manual specification creation provides deeper understanding and is the recommended approach for learning SED.

---

### Installation

```bash
# Global installation
npm install -g sedai

# Or use with npx (both commands work)
npx sedai --help
npx spec --help
```

### CLI Commands

Both `sedai` and `spec` commands are available:

```bash
# Initialize new project (fully implemented)
spec init [options]
  -n, --name <name>        Project name
  -s, --summary <summary>  Project summary/description
  -a, --author <author>    Author name
  -e, --email <email>      Author email

# Install specification dependencies (fully implemented)
spec install [options]
spec i [options]           # Short alias
  -p, --path <path>        Path to specifications directory (default: ./specs)

# Validate specifications (coming soon)
spec doctor [options]

# Validate single file (coming soon)
spec validate <file>

# Calculate specification score (fully implemented)
spec score <file>
```

### Quick Start with CLI

```bash
# Initialize a new SED project (interactive mode)
npx spec init

# Or with all options (non-interactive)
npx spec init -n "my-project" -s "My awesome project" -a "Your Name" -e "your@email.com"

# Install all specification dependencies
npx spec install
# or use the short alias
npx spec i

# Validate your specifications (coming soon)
npx spec doctor

# Validate a single spec file (coming soon)
npx spec validate specs/my-spec.md

# Calculate specification score
npx spec score specs/my-spec.md
```

### Understanding Dependencies

SED specifications can depend on other specifications. Dependencies are defined in the YAML header of each spec file:

```yaml
---
title: My Feature Specification
dependencies:
  - https://example.com/base-spec.md
  - https://sedai.dev/common/auth-spec.md
---
```

**How Dependencies Work:**

1. **Define dependencies** in your specification's YAML header
2. **Install dependencies** using `npx sedai install` command
3. **AI reads dependencies** from `./specs/dependencies/` folder when executing specifications
4. **If not found locally**, AI fetches them from the URL automatically

**Benefits:**
- **Reusability:** Share common specifications across projects
- **Consistency:** Ensure all projects follow the same standards
- **Modularity:** Break down complex specs into manageable pieces
- **Offline capability:** Pre-downloaded dependencies work without internet

**Remember:** These utilities are helpers, not requirements. The best way to learn SED is by manually creating specifications and asking AI to score them, as described in the [Getting Started with SED](#getting-started-with-sed) guide.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This SEDAI tool is released under the MIT License - see the [LICENSE](LICENSE) file for details.

### SED Specification License

Specification documents created using SEDAI can be licensed under the **SED Specification License** to protect the author's copyright while enabling proper sharing and collaboration. By using the SED Specification License, specification authors can:

- Protect their intellectual property rights
- Define clear terms for usage and distribution
- Maintain attribution and recognition
- Enable collaborative development under specified terms

Authors are free to choose any license (MIT, GPL, SED Specification License, proprietary, etc.) that best suits their project needs.

For the full text of the SED Specification License, see: [SED-LICENSE](https://github.com/thruthesky/sedai/blob/main/SED-LICENSE)

## Author

**Song Jaeho**
- Email: thruthesky@gmail.com
- Created: November 4, 2025

---

> *"In SED, the specification is not just documentation—it is the source of truth that directly drives development."*
>
> *"Spec-Exact Development transforms specifications into executable reality."*

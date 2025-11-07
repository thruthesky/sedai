---
name: sedaiweb-design-bootstrap
version: 1.0.0
description: Bootstrap 5.3.8 based UI/UX design specification for SEDAI homepage
author: Song Jaeho
email: thruthesky@gmail.com
homepage: https://github.com/thruthesky/sedai
license: MIT
step: 10
dependencies:
---

# SEDAI Homepage Design Specification - Bootstrap 5.3.8

## Overview

This specification defines the complete UI/UX design for the SEDAI homepage using Bootstrap 5.3.8 framework via CDN. Every visual element, component, spacing, color, typography, and interaction must follow this specification exactly. AI must not infer or improvise any design decisions beyond what is explicitly defined here.

**Design Philosophy:** Modern, professional, accessible, and developer-friendly interface that reflects the precision and clarity of the SED methodology.

---

## Requirements

### Libraries and Dependencies

#### Bootstrap 5.3.8 CDN

**CSS (must be placed in `<head>`):**
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
```

**JavaScript (must be placed before closing `</body>`):**
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz4YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
```

#### Custom CSS

Custom CSS must be loaded **after** Bootstrap CSS to allow overrides:
```html
<link href="./assets/css/custom.css" rel="stylesheet">
```

#### Font

**System Font Stack (no external font loading):**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

---

## Workflow

AI must follow this exact sequence when implementing the design:

1. **Load Bootstrap 5.3.8 via CDN** (CSS in `<head>`, JS before `</body>`)
2. **Define custom CSS variables** (colors, spacing, shadows)
3. **Implement HTML structure** (semantic HTML5 with Bootstrap classes)
4. **Apply Bootstrap utility classes** (spacing, colors, typography)
5. **Add custom CSS overrides** (only when Bootstrap defaults are insufficient)
6. **Test responsive behavior** (mobile-first, all breakpoints)
7. **Verify accessibility** (ARIA labels, keyboard navigation, color contrast)
8. **Validate HTML** (W3C validator, no errors)

---

## Detail Items

### 1. Color System

#### Primary Colors

**Primary Color (SEDAI Purple):**
- HEX: `#6366F1`
- RGB: `rgb(99, 102, 241)`
- Bootstrap variable override: `--bs-primary: #6366F1;`
- Usage: Primary buttons, links, brand elements

**Secondary Color (Purple Gradient End):**
- HEX: `#8B5CF6`
- RGB: `rgb(139, 92, 246)`
- Bootstrap variable override: `--bs-secondary: #8B5CF6;`
- Usage: Secondary buttons, accents, gradients

**Gradient (Primary to Secondary):**
```css
background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
```
- Usage: Hero section, headers, feature highlights

#### Neutral Colors

**Text Dark:**
- HEX: `#1F2937`
- RGB: `rgb(31, 41, 55)`
- Bootstrap class: `.text-dark` (override with custom value)
- Usage: Body text, headings

**Text Light (Muted):**
- HEX: `#6B7280`
- RGB: `rgb(107, 114, 128)`
- Bootstrap class: `.text-muted`
- Usage: Secondary text, descriptions, captions

**Background Light:**
- HEX: `#F9FAFB`
- RGB: `rgb(249, 250, 251)`
- Bootstrap class: `.bg-light` (override)
- Usage: Alternate section backgrounds

**Background White:**
- HEX: `#FFFFFF`
- RGB: `rgb(255, 255, 255)`
- Bootstrap class: `.bg-white`
- Usage: Cards, main content areas

**Border Color:**
- HEX: `#E5E7EB`
- RGB: `rgb(229, 231, 235)`
- Bootstrap class: `.border` (override color)
- Usage: Card borders, dividers

#### Semantic Colors

**Success:**
- HEX: `#10B981`
- Bootstrap class: `.text-success`, `.bg-success`
- Usage: Success messages, checkmarks, positive states

**Warning:**
- HEX: `#F59E0B`
- Bootstrap class: `.text-warning`, `.bg-warning`
- Usage: Warning messages, attention markers

**Danger:**
- HEX: `#EF4444`
- Bootstrap class: `.text-danger`, `.bg-danger`
- Usage: Error messages, delete actions

**Info:**
- HEX: `#3B82F6`
- Bootstrap class: `.text-info`, `.bg-info`
- Usage: Information messages, hints

#### Custom CSS Variables

Place in `custom.css`:
```css
:root {
    /* Override Bootstrap variables */
    --bs-primary: #6366F1;
    --bs-primary-rgb: 99, 102, 241;
    --bs-secondary: #8B5CF6;
    --bs-secondary-rgb: 139, 92, 246;

    /* Custom variables */
    --sedai-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
    --sedai-text-dark: #1F2937;
    --sedai-text-light: #6B7280;
    --sedai-bg-light: #F9FAFB;
    --sedai-border: #E5E7EB;
    --sedai-success: #10B981;
    --sedai-warning: #F59E0B;

    /* Shadows */
    --sedai-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --sedai-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --sedai-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --sedai-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

---

### 2. Typography

#### Font Family

**Primary Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```
- Bootstrap default already uses this
- Apply to `body` element
- No custom font loading required

#### Font Sizes

**Bootstrap Size Scale (use these classes):**
- `.display-1` - 5rem (80px) - Extra large displays
- `.display-2` - 4.5rem (72px) - Large displays
- `.display-3` - 4rem (64px) - Medium displays
- `.display-4` - 3.5rem (56px) - Small displays
- `.display-5` - 3rem (48px) - Extra small displays
- `.display-6` - 2.5rem (40px) - Heading displays

**Headings:**
- `h1`, `.h1` - 2.5rem (40px) - Page titles
- `h2`, `.h2` - 2rem (32px) - Section headings
- `h3`, `.h3` - 1.75rem (28px) - Subsection headings
- `h4`, `.h4` - 1.5rem (24px) - Card titles
- `h5`, `.h5` - 1.25rem (20px) - Small headings
- `h6`, `.h6` - 1rem (16px) - Captions

**Body Text:**
- Base: `1rem` (16px)
- Small: `.small` or `<small>` - 0.875rem (14px)
- Large: `.lead` - 1.25rem (20px) - Intro paragraphs

#### Font Weights

**Bootstrap classes:**
- `.fw-light` - 300 - Light text
- `.fw-normal` - 400 - Normal text (body default)
- `.fw-medium` - 500 - Medium weight
- `.fw-semibold` - 600 - Semi-bold (headings)
- `.fw-bold` - 700 - Bold (emphasis)
- `.fw-bolder` - 800 - Extra bold

#### Line Heights

**Bootstrap classes:**
- `.lh-1` - 1 - Tight (headings)
- `.lh-sm` - 1.25 - Small
- `.lh-base` - 1.5 - Base (body default)
- `.lh-lg` - 2 - Large (spacious reading)

**Custom line heights for specific elements:**
```css
/* Body text */
body {
    line-height: 1.7;
}

/* Headings */
h1, h2, h3, h4, h5, h6,
.h1, .h2, .h3, .h4, .h5, .h6 {
    line-height: 1.2;
}

/* Display headings */
.display-1, .display-2, .display-3,
.display-4, .display-5, .display-6 {
    line-height: 1.1;
}

/* Lead paragraph */
.lead {
    line-height: 1.6;
}
```

#### Letter Spacing

```css
/* Headings */
.display-1, .display-2, .display-3,
.display-4, .display-5, .display-6 {
    letter-spacing: -0.02em;
}

/* Body text - default */
body {
    letter-spacing: normal;
}
```

---

### 3. Layout System

#### Container

**Bootstrap Container (use these classes):**
- `.container` - Responsive fixed-width container (max-width: 1320px at xl)
- `.container-fluid` - Full-width container
- `.container-{breakpoint}` - 100% width until breakpoint

**Default container for main content:**
```html
<div class="container">
    <!-- Content -->
</div>
```

**Full-width sections (hero, footer):**
```html
<section class="container-fluid">
    <div class="container">
        <!-- Centered content -->
    </div>
</section>
```

#### Grid System

**Bootstrap Grid (12-column):**
```html
<div class="row">
    <div class="col-md-6">Column 1</div>
    <div class="col-md-6">Column 2</div>
</div>
```

**Common grid patterns:**

**Two columns (50/50):**
```html
<div class="row">
    <div class="col-md-6">Left</div>
    <div class="col-md-6">Right</div>
</div>
```

**Three columns (33/33/33):**
```html
<div class="row">
    <div class="col-md-4">Column 1</div>
    <div class="col-md-4">Column 2</div>
    <div class="col-md-4">Column 3</div>
</div>
```

**Auto-fit columns:**
```html
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <div class="col">Item 1</div>
    <div class="col">Item 2</div>
    <div class="col">Item 3</div>
</div>
```

#### Responsive Breakpoints

**Bootstrap 5.3.8 breakpoints:**
- `xs` - < 576px (Extra small - mobile)
- `sm` - ≥ 576px (Small - mobile landscape)
- `md` - ≥ 768px (Medium - tablets)
- `lg` - ≥ 992px (Large - small desktops)
- `xl` - ≥ 1200px (Extra large - desktops)
- `xxl` - ≥ 1400px (Extra extra large - large desktops)

**Usage in classes:**
- `.col-md-6` - 50% width on medium screens and up
- `.d-none d-md-block` - Hidden on mobile, visible on tablet+
- `.text-center text-md-start` - Centered on mobile, left-aligned on tablet+

---

### 4. Spacing System

#### Bootstrap Spacing Scale

**Spacing units (based on 1rem = 16px):**
- `0` - 0
- `1` - 0.25rem (4px)
- `2` - 0.5rem (8px)
- `3` - 1rem (16px)
- `4` - 1.5rem (24px)
- `5` - 3rem (48px)

**Spacing properties:**
- `m` - margin
- `p` - padding

**Directions:**
- `t` - top
- `b` - bottom
- `s` - start (left in LTR)
- `e` - end (right in LTR)
- `x` - horizontal (left and right)
- `y` - vertical (top and bottom)
- (none) - all sides

**Examples:**
- `.mt-3` - margin-top: 1rem
- `.pb-5` - padding-bottom: 3rem
- `.mx-auto` - margin-left: auto; margin-right: auto;
- `.py-4` - padding-top: 1.5rem; padding-bottom: 1.5rem;

#### Section Spacing

**Standard section padding:**
```html
<section class="py-5">
    <!-- Vertical padding: 3rem (48px) top and bottom -->
</section>
```

**Large section padding:**
```html
<section class="py-5 py-md-6">
    <!-- 3rem on mobile, 4rem on tablet+ -->
</section>
```

**Hero section:**
```html
<section class="hero py-5 py-md-6">
    <!-- Large vertical padding -->
</section>
```

---

### 5. Components

#### 5.1 Navigation Bar

**HTML Structure:**
```html
<nav class="navbar navbar-expand-lg navbar-dark sticky-top" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);">
    <div class="container">
        <a class="navbar-brand fw-bold" href="/">SEDAI</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#what-is-sed">What is SED?</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#principles">Principles</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#quick-start">Quick Start</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#workflow">Workflow</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="https://github.com/thruthesky/sedai">GitHub</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

**Styling (custom.css):**
```css
/* Navbar */
.navbar {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: 700;
}

.nav-link {
    font-weight: 500;
    transition: opacity 0.2s ease;
}

.nav-link:hover {
    opacity: 0.8;
}
```

#### 5.2 Hero Section

**HTML Structure:**
```html
<section class="hero text-white text-center py-5" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);">
    <div class="container py-5">
        <h1 class="display-3 fw-bold mb-4">SEDAI</h1>
        <p class="lead fst-italic mb-4">
            "AI develops exactly as the spec defines - no interpretation, no assumption."
        </p>
        <p class="fs-5 mb-4 opacity-90">
            A development methodology and toolset where artificial intelligence implements solutions
            strictly according to specifications without deviation.
        </p>

        <div class="d-flex justify-content-center gap-3 mb-4">
            <img src="https://img.shields.io/npm/v/sedai.svg" alt="npm version" height="20">
            <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" height="20">
            <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen" alt="Node.js Version" height="20">
        </div>

        <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <a href="#quick-start" class="btn btn-light btn-lg px-4">Get Started</a>
            <a href="https://github.com/thruthesky/sedai" class="btn btn-outline-light btn-lg px-4">View on GitHub</a>
        </div>
    </div>
</section>
```

**Custom styling:**
```css
.hero {
    min-height: 500px;
    display: flex;
    align-items: center;
}

.hero .display-3 {
    letter-spacing: -0.02em;
}

.hero .lead {
    font-size: 1.5rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

.hero .btn-light {
    background: white;
    color: #6366F1;
    font-weight: 600;
}

.hero .btn-light:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hero .btn-outline-light:hover {
    background: white;
    color: #6366F1;
}
```

#### 5.3 Cards

**Basic Card:**
```html
<div class="card h-100 shadow-sm">
    <div class="card-body">
        <h3 class="card-title h5 text-primary mb-3">Card Title</h3>
        <p class="card-text text-muted">
            Card content goes here. This is a description or explanation.
        </p>
    </div>
</div>
```

**Card with Icon:**
```html
<div class="card h-100 shadow-sm border-0">
    <div class="card-body text-center p-4">
        <div class="mb-3">
            <div class="bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center"
                 style="width: 70px; height: 70px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);">
                <span class="text-white fw-bold fs-2">S</span>
            </div>
        </div>
        <h3 class="h5 text-primary mb-3">Complete Specifications</h3>
        <p class="text-muted">
            Create comprehensive specifications that cover every aspect of your project.
        </p>
    </div>
</div>
```

**Card Grid:**
```html
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <div class="col">
        <div class="card h-100 shadow-sm">
            <!-- Card content -->
        </div>
    </div>
    <div class="col">
        <div class="card h-100 shadow-sm">
            <!-- Card content -->
        </div>
    </div>
    <div class="col">
        <div class="card h-100 shadow-sm">
            <!-- Card content -->
        </div>
    </div>
</div>
```

**Custom card styling:**
```css
.card {
    border-radius: 0.75rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
}

.card-title {
    font-weight: 600;
}
```

#### 5.4 Buttons

**Primary Button:**
```html
<button type="button" class="btn btn-primary px-4 py-2">
    Primary Button
</button>
```

**Secondary Button:**
```html
<button type="button" class="btn btn-secondary px-4 py-2">
    Secondary Button
</button>
```

**Outline Button:**
```html
<button type="button" class="btn btn-outline-primary px-4 py-2">
    Outline Button
</button>
```

**Large Button:**
```html
<button type="button" class="btn btn-primary btn-lg px-5 py-3">
    Large Button
</button>
```

**Button with gradient background:**
```html
<button type="button" class="btn btn-gradient px-4 py-2">
    Gradient Button
</button>
```

**Custom button styles:**
```css
.btn {
    font-weight: 600;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
}

.btn-primary {
    background: #6366F1;
    border-color: #6366F1;
}

.btn-primary:hover {
    background: #4F46E5;
    border-color: #4F46E5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-gradient {
    background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
    color: white;
    border: none;
}

.btn-gradient:hover {
    background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}
```

#### 5.5 Alerts

**Info Alert:**
```html
<div class="alert alert-info" role="alert">
    <strong>Info:</strong> This is an informational message.
</div>
```

**Success Alert:**
```html
<div class="alert alert-success" role="alert">
    <strong>Success!</strong> Your operation completed successfully.
</div>
```

**Warning Alert:**
```html
<div class="alert alert-warning" role="alert">
    <strong>Warning:</strong> Please review this carefully.
</div>
```

**Danger Alert:**
```html
<div class="alert alert-danger" role="alert">
    <strong>Error:</strong> Something went wrong.
</div>
```

#### 5.6 Code Blocks

**Inline Code:**
```html
<p>Use the <code>npm install</code> command.</p>
```

**Code Block:**
```html
<pre><code class="language-bash"># Install globally
npm install -g sedai

# Or use with npx
npx sedai --help
</code></pre>
```

**Styled Code Block:**
```html
<div class="bg-dark text-light p-4 rounded">
    <pre class="mb-0"><code class="text-light"><span class="text-secondary"># Global installation</span>
npm install -g sedai

<span class="text-secondary"># Or use with npx</span>
npx sedai --help
npx spec --help</code></pre>
</div>
```

**Custom code styling:**
```css
pre {
    background: #2B2B2B;
    border-radius: 0.5rem;
    padding: 1.5rem;
    overflow-x: auto;
}

pre code {
    color: #E8E8E8;
    font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
    font-size: 0.95rem;
    line-height: 1.6;
}

code {
    background: #F3F4F6;
    color: #E11D48;
    padding: 0.2em 0.4em;
    border-radius: 0.25rem;
    font-size: 0.9em;
}

.text-secondary {
    color: #7A7A7A !important;
}
```

#### 5.7 Tables

**Basic Table:**
```html
<div class="table-responsive">
    <table class="table table-hover">
        <thead class="table-primary">
            <tr>
                <th>Category</th>
                <th>Content</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="fw-semibold text-primary">Philosophy</td>
                <td>Spec is the truth. Development simply executes that truth.</td>
            </tr>
            <tr>
                <td class="fw-semibold text-primary">AI's Role</td>
                <td>Makes no judgments - executes the specification without interpretation.</td>
            </tr>
        </tbody>
    </table>
</div>
```

**Striped Table:**
```html
<table class="table table-striped">
    <!-- Table content -->
</table>
```

**Bordered Table:**
```html
<table class="table table-bordered">
    <!-- Table content -->
</table>
```

**Custom table styling:**
```css
.table-primary {
    background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
    color: white;
}

.table-primary th {
    font-weight: 600;
    border: none;
}

.table > tbody > tr > td {
    vertical-align: middle;
    padding: 1rem;
}
```

#### 5.8 Badges

**Primary Badge:**
```html
<span class="badge bg-primary">New</span>
```

**Success Badge:**
```html
<span class="badge bg-success">Active</span>
```

**Version Badge:**
```html
<span class="badge bg-secondary">v1.0.0</span>
```

**Custom badge:**
```html
<span class="badge" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);">
    Featured
</span>
```

#### 5.9 List Group

**Basic List Group:**
```html
<ul class="list-group">
    <li class="list-group-item">
        <span class="text-success fw-bold me-2">✓</span>
        Specifications, context, and required skills are often described vaguely
    </li>
    <li class="list-group-item">
        <span class="text-success fw-bold me-2">✓</span>
        MCPs provide only fragmented pieces of information
    </li>
    <li class="list-group-item">
        <span class="text-success fw-bold me-2">✓</span>
        AI freely interprets requirements, creating unpredictable outcomes
    </li>
</ul>
```

**Flush List Group (no borders):**
```html
<ul class="list-group list-group-flush">
    <li class="list-group-item">Item 1</li>
    <li class="list-group-item">Item 2</li>
</ul>
```

---

### 6. Sections Layout

#### 6.1 What is SED Section

```html
<section id="what-is-sed" class="py-5">
    <div class="container">
        <h2 class="display-5 text-center mb-4">What is Spec-Exact Development?</h2>

        <div class="row justify-content-center">
            <div class="col-lg-10">
                <p class="lead">
                    <strong>Spec-Exact Development (SED)</strong> is an AI-driven development paradigm in which
                    the AI never deviates by even a single line from the specification.
                </p>

                <div class="alert alert-primary p-4 text-center my-4" role="alert">
                    <p class="display-6 fst-italic mb-0">
                        "If the spec is wrong, the product is wrong - by design."
                    </p>
                </div>

                <h3 class="h4 mt-5 mb-3">Background</h3>
                <p>
                    Created by <strong>Song Jaeho</strong> on <strong>November 4, 2025</strong> to overcome
                    the limitations of vibe coding and ensure consistent, predictable AI-driven development.
                </p>

                <h3 class="h4 mt-5 mb-3">Problems with Prior Approaches</h3>
                <ul class="list-group list-group-flush mb-4">
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        Specifications, context, and required skills are often described vaguely
                    </li>
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        MCPs provide only fragmented pieces of information
                    </li>
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        AI freely interprets requirements, creating unpredictable outcomes
                    </li>
                </ul>

                <h3 class="h4 mt-5 mb-3">SED's Solution</h3>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        Provide AI with complete blueprints
                    </li>
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        AI follows the blueprints precisely without making inferences
                    </li>
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        Specifications become the absolute standard that guarantees consistency
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

#### 6.2 Core Principles Section

```html
<section id="principles" class="py-5 bg-light">
    <div class="container">
        <h2 class="display-5 text-center mb-3">Core Principles</h2>
        <p class="text-center text-muted mb-5">
            SED is built on fundamental principles that ensure specification integrity and implementation accuracy
        </p>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <h3 class="h5 text-primary mb-3">1. Spec-Exactness</h3>
                        <p class="text-muted">
                            Development implements only what the specification defines. If the specification
                            is incomplete, the AI must immediately return a Spec Error and stop development.
                        </p>
                    </div>
                </div>
            </div>

            <div class="col">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <h3 class="h5 text-primary mb-3">2. Spec Completeness Scoring</h3>
                        <p class="text-muted">
                            Before development begins, the AI evaluates the specification and assigns a score
                            from 0-100. Development may start only when the score is 90 or higher.
                        </p>
                    </div>
                </div>
            </div>

            <div class="col">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <h3 class="h5 text-primary mb-3">3. Spec Is the Law</h3>
                        <p class="text-muted">
                            AI never attempts to infer human intent. Ambiguous sentences in the specification
                            are ignored and not implemented. Guessing is forbidden.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

#### 6.3 Features Section

```html
<section id="features" class="py-5">
    <div class="container">
        <h2 class="display-5 text-center mb-3">Features</h2>
        <p class="text-center text-muted mb-5">
            Powerful tools and methodology for spec-exact development
        </p>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                        <div class="mb-3">
                            <div class="bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center"
                                 style="width: 70px; height: 70px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);">
                                <span class="text-white fw-bold fs-2">S</span>
                            </div>
                        </div>
                        <h3 class="h5 text-primary mb-3">Complete Specifications</h3>
                        <p class="text-muted">
                            Create comprehensive specifications that cover every aspect of your project,
                            from database schemas to UI/UX details.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Repeat for other features -->
        </div>
    </div>
</section>
```

#### 6.4 Workflow Section

```html
<section id="workflow" class="py-5 bg-light">
    <div class="container">
        <h2 class="display-5 text-center mb-3">Development Workflow</h2>
        <p class="text-center text-muted mb-5">
            A systematic approach to spec-exact development
        </p>

        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="d-flex mb-4">
                    <div class="flex-shrink-0">
                        <div class="bg-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                             style="width: 60px; height: 60px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);">
                            1
                        </div>
                    </div>
                    <div class="flex-grow-1 ms-4">
                        <h3 class="h5 mb-2">Preparation Phase</h3>
                        <p class="text-muted">
                            Write comprehensive specification storylines (100+ items) and convert them
                            into blueprint-level detail. Include database specs, feature specs, routing,
                            functions, UI/UX requirements, testing specs, and deployment configs.
                        </p>
                    </div>
                </div>

                <!-- Repeat for other workflow steps -->
            </div>
        </div>
    </div>
</section>
```

#### 6.5 Footer

```html
<footer class="bg-dark text-white pt-5 pb-3">
    <div class="container">
        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <h5 class="text-primary mb-3">SEDAI</h5>
                <p class="small">
                    Spec-Exact Development with AI<br>
                    Created by Song Jaeho<br>
                    November 4, 2025
                </p>
            </div>

            <div class="col-md-3">
                <h5 class="text-primary mb-3">Resources</h5>
                <ul class="list-unstyled">
                    <li class="mb-2">
                        <a href="https://github.com/thruthesky/sedai" class="text-white-50 text-decoration-none">
                            GitHub Repository
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://www.npmjs.com/package/sedai" class="text-white-50 text-decoration-none">
                            NPM Package
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://github.com/thruthesky/sedai/blob/main/README.md" class="text-white-50 text-decoration-none">
                            Documentation
                        </a>
                    </li>
                </ul>
            </div>

            <div class="col-md-3">
                <h5 class="text-primary mb-3">Contact</h5>
                <ul class="list-unstyled">
                    <li class="mb-2">
                        <a href="mailto:thruthesky@gmail.com" class="text-white-50 text-decoration-none">
                            thruthesky@gmail.com
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://github.com/thruthesky/sedai/issues" class="text-white-50 text-decoration-none">
                            Report Issues
                        </a>
                    </li>
                </ul>
            </div>

            <div class="col-md-3">
                <h5 class="text-primary mb-3">License</h5>
                <p class="small">
                    SEDAI Tool: MIT License<br>
                    SED Specifications: SED Specification License
                </p>
            </div>
        </div>

        <hr class="border-secondary">

        <div class="text-center py-3">
            <p class="small text-muted mb-0">
                &copy; 2025 Song Jaeho. All rights reserved.<br>
                "In SED, the specification is not just documentation - it is the source of truth that directly drives development."
            </p>
        </div>
    </div>
</footer>
```

---

### 7. Accessibility

#### ARIA Labels

**Navigation:**
```html
<nav class="navbar" role="navigation" aria-label="Main navigation">
    <!-- Nav content -->
</nav>
```

**Buttons:**
```html
<button type="button" class="btn btn-primary" aria-label="Get started with SEDAI">
    Get Started
</button>
```

**Links:**
```html
<a href="#quick-start" aria-label="Jump to quick start section">Quick Start</a>
```

#### Keyboard Navigation

All interactive elements must be keyboard accessible:
- Buttons: Enter/Space to activate
- Links: Enter to navigate
- Dropdown: Arrow keys to navigate, Enter to select
- Modal: Esc to close

#### Focus States

```css
/* Ensure visible focus indicators */
a:focus,
button:focus,
.btn:focus {
    outline: 2px solid #6366F1;
    outline-offset: 2px;
}

/* Skip to main content link */
.skip-to-main {
    position: absolute;
    left: -9999px;
    z-index: 999;
}

.skip-to-main:focus {
    left: 50%;
    transform: translateX(-50%);
    top: 1rem;
    background: #6366F1;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
}
```

#### Color Contrast

All text must meet WCAG 2.1 Level AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**Verified combinations:**
- White text on `#6366F1` (Primary) - ✓ Pass
- Dark text `#1F2937` on white - ✓ Pass
- Muted text `#6B7280` on white - ✓ Pass

---

### 8. Animations and Transitions

#### Hover Effects

```css
/* Card hover */
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Button hover */
.btn {
    transition: all 0.2s ease;
}

.btn:hover {
    transform: translateY(-2px);
}

/* Link hover */
a {
    transition: opacity 0.2s ease, color 0.2s ease;
}

a:hover {
    opacity: 0.8;
}
```

#### Scroll Behavior

```css
html {
    scroll-behavior: smooth;
}
```

#### Loading States

```html
<button class="btn btn-primary" type="button" disabled>
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Loading...
</button>
```

---

### 9. Responsive Design

#### Mobile-First Approach

Always start with mobile design and enhance for larger screens:

```html
<!-- Mobile: Stack vertically -->
<!-- Tablet+: Two columns -->
<div class="row row-cols-1 row-cols-md-2 g-4">
    <div class="col">Column 1</div>
    <div class="col">Column 2</div>
</div>
```

#### Hide/Show at Breakpoints

```html
<!-- Hide on mobile, show on tablet+ -->
<div class="d-none d-md-block">Desktop content</div>

<!-- Show on mobile, hide on tablet+ -->
<div class="d-block d-md-none">Mobile content</div>
```

#### Responsive Text

```html
<!-- Smaller on mobile, larger on desktop -->
<h1 class="display-6 display-md-4 display-lg-3">Responsive Heading</h1>

<!-- Center on mobile, left-align on tablet+ -->
<p class="text-center text-md-start">Responsive alignment</p>
```

#### Responsive Spacing

```html
<!-- Small padding on mobile, large padding on tablet+ -->
<section class="py-3 py-md-5">
    <!-- Content -->
</section>
```

---

### 10. Browser Support

**Minimum browser versions:**
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- iOS Safari: iOS 12+
- Android Chrome: Android 5+

**Polyfills not required** - Bootstrap 5.3.8 does not support IE11

---

### 11. Performance Optimization

#### CSS

```html
<!-- Minified Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Inline critical CSS for above-the-fold content -->
<style>
    /* Critical CSS here */
</style>

<!-- Async load custom CSS -->
<link href="./assets/css/custom.css" rel="stylesheet" media="print" onload="this.media='all'">
```

#### JavaScript

```html
<!-- Place before closing </body> -->
<!-- Bootstrap bundle includes Popper.js -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

<!-- Defer custom scripts -->
<script src="./assets/js/custom.js" defer></script>
```

#### Images

```html
<!-- Lazy loading -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- Responsive images -->
<img srcset="image-320w.jpg 320w,
             image-640w.jpg 640w,
             image-1280w.jpg 1280w"
     sizes="(max-width: 640px) 100vw, 640px"
     src="image-640w.jpg"
     alt="Description">
```

---

### 12. Testing Checklist

Before deploying, verify:

- [ ] All Bootstrap components render correctly
- [ ] Responsive design works on all breakpoints (xs, sm, md, lg, xl, xxl)
- [ ] All interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA standards
- [ ] All links work correctly
- [ ] Forms validate properly
- [ ] No console errors
- [ ] Page loads in < 3 seconds
- [ ] All images have alt text
- [ ] HTML validates (W3C validator)
- [ ] Cross-browser testing completed

---

## Summary

This specification defines every aspect of the SEDAI homepage design using Bootstrap 5.3.8. AI must implement exactly as specified:

1. **Use Bootstrap 5.3.8 CDN** - No modifications to Bootstrap source
2. **Apply custom CSS** only for colors and minor adjustments
3. **Follow semantic HTML5** - Proper use of `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
4. **Use Bootstrap classes** - Leverage grid, utilities, components
5. **Maintain accessibility** - ARIA labels, keyboard navigation, color contrast
6. **Ensure responsiveness** - Mobile-first, all breakpoints tested
7. **Optimize performance** - Minimal custom CSS, lazy loading, deferred scripts

**No improvisation allowed.** Every color, spacing, component, and interaction is defined. If something is not specified here, ask for clarification - do not guess or infer.

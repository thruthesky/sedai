---
name: sedaiweb-design-bootstrap
version: 1.0.0
description: SEDAI 홈페이지를 위한 Bootstrap 5.3.8 기반 UI/UX 디자인 명세
author: Song Jaeho
email: thruthesky@gmail.com
homepage: https://github.com/thruthesky/sedai
license: MIT
step: 10
dependencies:
---

# SEDAI 홈페이지 디자인 명세 - Bootstrap 5.3.8

## 개요

본 명세는 Bootstrap 5.3.8 프레임워크를 CDN으로 사용하여 SEDAI 홈페이지의 완전한 UI/UX 디자인을 정의합니다. 모든 시각적 요소, 컴포넌트, 간격, 색상, 타이포그래피, 상호작용은 본 명세에 정의된 대로 정확히 따라야 합니다. AI는 여기에 명시적으로 정의된 것 이외의 어떤 디자인 결정도 추론하거나 즉흥적으로 만들어서는 안 됩니다.

**디자인 철학:** SED 방법론의 정확성과 명확성을 반영하는 현대적이고, 전문적이며, 접근성 높고, 개발자 친화적인 인터페이스.

---

## 요구사항

### 라이브러리 및 의존성

#### Bootstrap 5.3.8 CDN

**CSS (`<head>`에 위치해야 함):**
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
```

**JavaScript (`</body>` 닫기 전에 위치해야 함):**
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz4YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
```

#### 커스텀 CSS

커스텀 CSS는 재정의를 허용하기 위해 Bootstrap CSS **이후에** 로드해야 합니다:
```html
<link href="./assets/css/custom.css" rel="stylesheet">
```

#### 폰트

**시스템 폰트 스택 (외부 폰트 로딩 없음):**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

---

## 워크플로우

AI는 디자인 구현 시 다음 순서를 정확히 따라야 합니다:

1. **Bootstrap 5.3.8을 CDN으로 로드** (CSS는 `<head>`에, JS는 `</body>` 전에)
2. **커스텀 CSS 변수 정의** (색상, 간격, 그림자)
3. **HTML 구조 구현** (Bootstrap 클래스가 포함된 시맨틱 HTML5)
4. **Bootstrap 유틸리티 클래스 적용** (간격, 색상, 타이포그래피)
5. **커스텀 CSS 재정의 추가** (Bootstrap 기본값이 불충분한 경우에만)
6. **반응형 동작 테스트** (모바일 우선, 모든 중단점)
7. **접근성 검증** (ARIA 레이블, 키보드 네비게이션, 색상 대비)
8. **HTML 검증** (W3C 검증기, 오류 없음)

---

## 상세 항목

### 1. 색상 시스템

#### 주요 색상

**주색상 (SEDAI 보라색):**
- HEX: `#6366F1`
- RGB: `rgb(99, 102, 241)`
- Bootstrap 변수 재정의: `--bs-primary: #6366F1;`
- 용도: 주요 버튼, 링크, 브랜드 요소

**보조 색상 (보라색 그라디언트 끝):**
- HEX: `#8B5CF6`
- RGB: `rgb(139, 92, 246)`
- Bootstrap 변수 재정의: `--bs-secondary: #8B5CF6;`
- 용도: 보조 버튼, 강조, 그라디언트

**그라디언트 (주색상에서 보조색상으로):**
```css
background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
```
- 용도: 히어로 섹션, 헤더, 기능 하이라이트

#### 중립 색상

**어두운 텍스트:**
- HEX: `#1F2937`
- RGB: `rgb(31, 41, 55)`
- Bootstrap 클래스: `.text-dark` (커스텀 값으로 재정의)
- 용도: 본문 텍스트, 제목

**밝은 텍스트 (흐림):**
- HEX: `#6B7280`
- RGB: `rgb(107, 114, 128)`
- Bootstrap 클래스: `.text-muted`
- 용도: 보조 텍스트, 설명, 캡션

**밝은 배경:**
- HEX: `#F9FAFB`
- RGB: `rgb(249, 250, 251)`
- Bootstrap 클래스: `.bg-light` (재정의)
- 용도: 교차 섹션 배경

**흰색 배경:**
- HEX: `#FFFFFF`
- RGB: `rgb(255, 255, 255)`
- Bootstrap 클래스: `.bg-white`
- 용도: 카드, 주요 콘텐츠 영역

**테두리 색상:**
- HEX: `#E5E7EB`
- RGB: `rgb(229, 231, 235)`
- Bootstrap 클래스: `.border` (색상 재정의)
- 용도: 카드 테두리, 구분선

#### 시맨틱 색상

**성공:**
- HEX: `#10B981`
- Bootstrap 클래스: `.text-success`, `.bg-success`
- 용도: 성공 메시지, 체크마크, 긍정 상태

**경고:**
- HEX: `#F59E0B`
- Bootstrap 클래스: `.text-warning`, `.bg-warning`
- 용도: 경고 메시지, 주의 표시

**위험:**
- HEX: `#EF4444`
- Bootstrap 클래스: `.text-danger`, `.bg-danger`
- 용도: 오류 메시지, 삭제 작업

**정보:**
- HEX: `#3B82F6`
- Bootstrap 클래스: `.text-info`, `.bg-info`
- 용도: 정보 메시지, 힌트

#### 커스텀 CSS 변수

`custom.css`에 배치:
```css
:root {
    /* Bootstrap 변수 재정의 */
    --bs-primary: #6366F1;
    --bs-primary-rgb: 99, 102, 241;
    --bs-secondary: #8B5CF6;
    --bs-secondary-rgb: 139, 92, 246;

    /* 커스텀 변수 */
    --sedai-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
    --sedai-text-dark: #1F2937;
    --sedai-text-light: #6B7280;
    --sedai-bg-light: #F9FAFB;
    --sedai-border: #E5E7EB;
    --sedai-success: #10B981;
    --sedai-warning: #F59E0B;

    /* 그림자 */
    --sedai-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --sedai-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --sedai-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --sedai-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

---

### 2. 타이포그래피

#### 폰트 패밀리

**주 폰트 스택:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```
- Bootstrap 기본값이 이미 이것을 사용
- `body` 요소에 적용
- 커스텀 폰트 로딩 불필요

#### 폰트 크기

**Bootstrap 크기 스케일 (이 클래스들을 사용):**
- `.display-1` - 5rem (80px) - 아주 큰 디스플레이
- `.display-2` - 4.5rem (72px) - 큰 디스플레이
- `.display-3` - 4rem (64px) - 중간 디스플레이
- `.display-4` - 3.5rem (56px) - 작은 디스플레이
- `.display-5` - 3rem (48px) - 아주 작은 디스플레이
- `.display-6` - 2.5rem (40px) - 헤딩 디스플레이

**제목:**
- `h1`, `.h1` - 2.5rem (40px) - 페이지 제목
- `h2`, `.h2` - 2rem (32px) - 섹션 제목
- `h3`, `.h3` - 1.75rem (28px) - 하위 섹션 제목
- `h4`, `.h4` - 1.5rem (24px) - 카드 제목
- `h5`, `.h5` - 1.25rem (20px) - 작은 제목
- `h6`, `.h6` - 1rem (16px) - 캡션

**본문 텍스트:**
- 기본: `1rem` (16px)
- 작게: `.small` 또는 `<small>` - 0.875rem (14px)
- 크게: `.lead` - 1.25rem (20px) - 소개 단락

#### 폰트 굵기

**Bootstrap 클래스:**
- `.fw-light` - 300 - 가벼운 텍스트
- `.fw-normal` - 400 - 일반 텍스트 (본문 기본값)
- `.fw-medium` - 500 - 중간 굵기
- `.fw-semibold` - 600 - 세미볼드 (제목)
- `.fw-bold` - 700 - 볼드 (강조)
- `.fw-bolder` - 800 - 아주 굵게

#### 줄 높이

**Bootstrap 클래스:**
- `.lh-1` - 1 - 좁게 (제목)
- `.lh-sm` - 1.25 - 작게
- `.lh-base` - 1.5 - 기본 (본문 기본값)
- `.lh-lg` - 2 - 크게 (넓은 읽기)

**특정 요소에 대한 커스텀 줄 높이:**
```css
/* 본문 텍스트 */
body {
    line-height: 1.7;
}

/* 제목 */
h1, h2, h3, h4, h5, h6,
.h1, .h2, .h3, .h4, .h5, .h6 {
    line-height: 1.2;
}

/* 디스플레이 제목 */
.display-1, .display-2, .display-3,
.display-4, .display-5, .display-6 {
    line-height: 1.1;
}

/* 리드 단락 */
.lead {
    line-height: 1.6;
}
```

#### 자간

```css
/* 제목 */
.display-1, .display-2, .display-3,
.display-4, .display-5, .display-6 {
    letter-spacing: -0.02em;
}

/* 본문 텍스트 - 기본값 */
body {
    letter-spacing: normal;
}
```

---

### 3. 레이아웃 시스템

#### 컨테이너

**Bootstrap 컨테이너 (이 클래스들을 사용):**
- `.container` - 반응형 고정 너비 컨테이너 (xl에서 최대 너비: 1320px)
- `.container-fluid` - 전체 너비 컨테이너
- `.container-{breakpoint}` - 중단점까지 100% 너비

**주요 콘텐츠에 대한 기본 컨테이너:**
```html
<div class="container">
    <!-- 콘텐츠 -->
</div>
```

**전체 너비 섹션 (히어로, 푸터):**
```html
<section class="container-fluid">
    <div class="container">
        <!-- 중앙 정렬 콘텐츠 -->
    </div>
</section>
```

#### 그리드 시스템

**Bootstrap 그리드 (12열):**
```html
<div class="row">
    <div class="col-md-6">열 1</div>
    <div class="col-md-6">열 2</div>
</div>
```

**일반적인 그리드 패턴:**

**두 열 (50/50):**
```html
<div class="row">
    <div class="col-md-6">왼쪽</div>
    <div class="col-md-6">오른쪽</div>
</div>
```

**세 열 (33/33/33):**
```html
<div class="row">
    <div class="col-md-4">열 1</div>
    <div class="col-md-4">열 2</div>
    <div class="col-md-4">열 3</div>
</div>
```

**자동 맞춤 열:**
```html
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <div class="col">항목 1</div>
    <div class="col">항목 2</div>
    <div class="col">항목 3</div>
</div>
```

#### 반응형 중단점

**Bootstrap 5.3.8 중단점:**
- `xs` - < 576px (아주 작음 - 모바일)
- `sm` - ≥ 576px (작음 - 모바일 가로)
- `md` - ≥ 768px (중간 - 태블릿)
- `lg` - ≥ 992px (큼 - 작은 데스크톱)
- `xl` - ≥ 1200px (아주 큼 - 데스크톱)
- `xxl` - ≥ 1400px (매우 큼 - 대형 데스크톱)

**클래스에서의 사용:**
- `.col-md-6` - 중간 화면 이상에서 50% 너비
- `.d-none d-md-block` - 모바일에서 숨김, 태블릿 이상에서 표시
- `.text-center text-md-start` - 모바일에서 중앙 정렬, 태블릿 이상에서 왼쪽 정렬

---

### 4. 간격 시스템

#### Bootstrap 간격 스케일

**간격 단위 (1rem = 16px 기준):**
- `0` - 0
- `1` - 0.25rem (4px)
- `2` - 0.5rem (8px)
- `3` - 1rem (16px)
- `4` - 1.5rem (24px)
- `5` - 3rem (48px)

**간격 속성:**
- `m` - margin
- `p` - padding

**방향:**
- `t` - top
- `b` - bottom
- `s` - start (LTR에서 left)
- `e` - end (LTR에서 right)
- `x` - horizontal (left와 right)
- `y` - vertical (top과 bottom)
- (없음) - 모든 방향

**예시:**
- `.mt-3` - margin-top: 1rem
- `.pb-5` - padding-bottom: 3rem
- `.mx-auto` - margin-left: auto; margin-right: auto;
- `.py-4` - padding-top: 1.5rem; padding-bottom: 1.5rem;

#### 섹션 간격

**표준 섹션 패딩:**
```html
<section class="py-5">
    <!-- 세로 패딩: 상하 3rem (48px) -->
</section>
```

**큰 섹션 패딩:**
```html
<section class="py-5 py-md-6">
    <!-- 모바일에서 3rem, 태블릿 이상에서 4rem -->
</section>
```

**히어로 섹션:**
```html
<section class="hero py-5 py-md-6">
    <!-- 큰 세로 패딩 -->
</section>
```

---

### 5. 컴포넌트

#### 5.1 네비게이션 바

**HTML 구조:**
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
                    <a class="nav-link" href="#what-is-sed">SED란?</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#principles">원칙</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#quick-start">빠른 시작</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#workflow">워크플로우</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="https://github.com/thruthesky/sedai">GitHub</a>
                </li>
            </ul>
        </div>
    </div>
</nav>
```

**스타일링 (custom.css):**
```css
/* 네비게이션 바 */
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

#### 5.2 히어로 섹션

**HTML 구조:**
```html
<section class="hero text-white text-center py-5" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);">
    <div class="container py-5">
        <h1 class="display-3 fw-bold mb-4">SEDAI</h1>
        <p class="lead fst-italic mb-4">
            "AI는 스펙이 정의한 대로 정확히 개발합니다 - 해석도, 가정도 없이."
        </p>
        <p class="fs-5 mb-4 opacity-90">
            인공지능이 명세에 따라 일탈 없이 솔루션을 엄격하게 구현하는 개발 방법론 및 도구 세트.
        </p>

        <div class="d-flex justify-content-center gap-3 mb-4">
            <img src="https://img.shields.io/npm/v/sedai.svg" alt="npm 버전" height="20">
            <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="라이선스: MIT" height="20">
            <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen" alt="Node.js 버전" height="20">
        </div>

        <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <a href="#quick-start" class="btn btn-light btn-lg px-4">시작하기</a>
            <a href="https://github.com/thruthesky/sedai" class="btn btn-outline-light btn-lg px-4">GitHub에서 보기</a>
        </div>
    </div>
</section>
```

**커스텀 스타일링:**
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

#### 5.3 카드

**기본 카드:**
```html
<div class="card h-100 shadow-sm">
    <div class="card-body">
        <h3 class="card-title h5 text-primary mb-3">카드 제목</h3>
        <p class="card-text text-muted">
            카드 콘텐츠가 여기에 들어갑니다. 설명 또는 설명입니다.
        </p>
    </div>
</div>
```

**아이콘이 있는 카드:**
```html
<div class="card h-100 shadow-sm border-0">
    <div class="card-body text-center p-4">
        <div class="mb-3">
            <div class="bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center"
                 style="width: 70px; height: 70px; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);">
                <span class="text-white fw-bold fs-2">S</span>
            </div>
        </div>
        <h3 class="h5 text-primary mb-3">완전한 명세</h3>
        <p class="text-muted">
            프로젝트의 모든 측면을 포괄하는 포괄적인 명세를 작성합니다.
        </p>
    </div>
</div>
```

**카드 그리드:**
```html
<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
    <div class="col">
        <div class="card h-100 shadow-sm">
            <!-- 카드 콘텐츠 -->
        </div>
    </div>
    <div class="col">
        <div class="card h-100 shadow-sm">
            <!-- 카드 콘텐츠 -->
        </div>
    </div>
    <div class="col">
        <div class="card h-100 shadow-sm">
            <!-- 카드 콘텐츠 -->
        </div>
    </div>
</div>
```

**커스텀 카드 스타일링:**
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

#### 5.4 버튼

**주요 버튼:**
```html
<button type="button" class="btn btn-primary px-4 py-2">
    주요 버튼
</button>
```

**보조 버튼:**
```html
<button type="button" class="btn btn-secondary px-4 py-2">
    보조 버튼
</button>
```

**외곽선 버튼:**
```html
<button type="button" class="btn btn-outline-primary px-4 py-2">
    외곽선 버튼
</button>
```

**큰 버튼:**
```html
<button type="button" class="btn btn-primary btn-lg px-5 py-3">
    큰 버튼
</button>
```

**그라디언트 배경 버튼:**
```html
<button type="button" class="btn btn-gradient px-4 py-2">
    그라디언트 버튼
</button>
```

**커스텀 버튼 스타일:**
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

#### 5.5 알림

**정보 알림:**
```html
<div class="alert alert-info" role="alert">
    <strong>정보:</strong> 이것은 정보 메시지입니다.
</div>
```

**성공 알림:**
```html
<div class="alert alert-success" role="alert">
    <strong>성공!</strong> 작업이 성공적으로 완료되었습니다.
</div>
```

**경고 알림:**
```html
<div class="alert alert-warning" role="alert">
    <strong>경고:</strong> 이것을 주의 깊게 검토하세요.
</div>
```

**위험 알림:**
```html
<div class="alert alert-danger" role="alert">
    <strong>오류:</strong> 문제가 발생했습니다.
</div>
```

#### 5.6 코드 블록

**인라인 코드:**
```html
<p><code>npm install</code> 명령을 사용하세요.</p>
```

**코드 블록:**
```html
<pre><code class="language-bash"># 전역으로 설치
npm install -g sedai

# 또는 npx 사용
npx sedai --help
</code></pre>
```

**스타일된 코드 블록:**
```html
<div class="bg-dark text-light p-4 rounded">
    <pre class="mb-0"><code class="text-light"><span class="text-secondary"># 전역 설치</span>
npm install -g sedai

<span class="text-secondary"># 또는 npx 사용</span>
npx sedai --help
npx spec --help</code></pre>
</div>
```

**커스텀 코드 스타일링:**
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

#### 5.7 테이블

**기본 테이블:**
```html
<div class="table-responsive">
    <table class="table table-hover">
        <thead class="table-primary">
            <tr>
                <th>카테고리</th>
                <th>내용</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="fw-semibold text-primary">철학</td>
                <td>스펙이 진리입니다. 개발은 단순히 그 진리를 실행합니다.</td>
            </tr>
            <tr>
                <td class="fw-semibold text-primary">AI의 역할</td>
                <td>판단하지 않습니다 - 명세를 해석 없이 실행합니다.</td>
            </tr>
        </tbody>
    </table>
</div>
```

**줄무늬 테이블:**
```html
<table class="table table-striped">
    <!-- 테이블 콘텐츠 -->
</table>
```

**테두리 테이블:**
```html
<table class="table table-bordered">
    <!-- 테이블 콘텐츠 -->
</table>
```

**커스텀 테이블 스타일링:**
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

#### 5.8 배지

**주요 배지:**
```html
<span class="badge bg-primary">새로운</span>
```

**성공 배지:**
```html
<span class="badge bg-success">활성</span>
```

**버전 배지:**
```html
<span class="badge bg-secondary">v1.0.0</span>
```

**커스텀 배지:**
```html
<span class="badge" style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);">
    추천
</span>
```

#### 5.9 목록 그룹

**기본 목록 그룹:**
```html
<ul class="list-group">
    <li class="list-group-item">
        <span class="text-success fw-bold me-2">✓</span>
        명세, 컨텍스트, 필요한 기술이 종종 모호하게 설명됩니다
    </li>
    <li class="list-group-item">
        <span class="text-success fw-bold me-2">✓</span>
        MCP는 단편적인 정보만 제공합니다
    </li>
    <li class="list-group-item">
        <span class="text-success fw-bold me-2">✓</span>
        AI가 요구사항을 자유롭게 해석하여 예측 불가능한 결과를 만듭니다
    </li>
</ul>
```

**플러시 목록 그룹 (테두리 없음):**
```html
<ul class="list-group list-group-flush">
    <li class="list-group-item">항목 1</li>
    <li class="list-group-item">항목 2</li>
</ul>
```

---

### 6. 섹션 레이아웃

#### 6.1 SED란 무엇인가 섹션

```html
<section id="what-is-sed" class="py-5">
    <div class="container">
        <h2 class="display-5 text-center mb-4">스펙 정확 개발(Spec-Exact Development)이란?</h2>

        <div class="row justify-content-center">
            <div class="col-lg-10">
                <p class="lead">
                    <strong>스펙 정확 개발(SED)</strong>은 AI가 명세로부터 단 한 줄도 벗어나지 않는
                    AI 기반 개발 패러다임입니다.
                </p>

                <div class="alert alert-primary p-4 text-center my-4" role="alert">
                    <p class="display-6 fst-italic mb-0">
                        "스펙이 틀렸다면, 제품도 틀립니다 - 의도적으로."
                    </p>
                </div>

                <h3 class="h4 mt-5 mb-3">배경</h3>
                <p>
                    <strong>Song Jaeho</strong>가 <strong>2025년 11월 4일</strong>에 만들었으며,
                    바이브 코딩의 한계를 극복하고 일관되고 예측 가능한 AI 기반 개발을 보장합니다.
                </p>

                <h3 class="h4 mt-5 mb-3">기존 접근법의 문제점</h3>
                <ul class="list-group list-group-flush mb-4">
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        명세, 컨텍스트, 필요한 기술이 종종 모호하게 설명됩니다
                    </li>
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        MCP는 단편적인 정보만 제공합니다
                    </li>
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        AI가 요구사항을 자유롭게 해석하여 예측 불가능한 결과를 만듭니다
                    </li>
                </ul>

                <h3 class="h4 mt-5 mb-3">SED의 해결책</h3>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        AI에게 완전한 청사진 제공
                    </li>
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        AI가 추론 없이 청사진을 정확히 따릅니다
                    </li>
                    <li class="list-group-item">
                        <span class="text-success fw-bold me-2">✓</span>
                        명세가 일관성을 보장하는 절대 기준이 됩니다
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>
```

#### 6.2 핵심 원칙 섹션

```html
<section id="principles" class="py-5 bg-light">
    <div class="container">
        <h2 class="display-5 text-center mb-3">핵심 원칙</h2>
        <p class="text-center text-muted mb-5">
            SED는 명세 무결성과 구현 정확성을 보장하는 근본적인 원칙 위에 구축됩니다
        </p>

        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <h3 class="h5 text-primary mb-3">1. 스펙 정확성</h3>
                        <p class="text-muted">
                            개발은 명세가 정의한 것만 구현합니다. 명세가 불완전하면 AI는 즉시
                            Spec Error를 반환하고 개발을 중단해야 합니다.
                        </p>
                    </div>
                </div>
            </div>

            <div class="col">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <h3 class="h5 text-primary mb-3">2. 스펙 완전성 점수</h3>
                        <p class="text-muted">
                            개발 시작 전에 AI는 명세를 평가하고 0-100점을 부여합니다.
                            점수가 90점 이상일 때만 개발을 시작할 수 있습니다.
                        </p>
                    </div>
                </div>
            </div>

            <div class="col">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body p-4">
                        <h3 class="h5 text-primary mb-3">3. 스펙이 법이다</h3>
                        <p class="text-muted">
                            AI는 인간의 의도를 추론하려 하지 않습니다. 명세의 모호한 문장은
                            무시되고 구현되지 않습니다. 추측은 금지됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

#### 6.3 기능 섹션

```html
<section id="features" class="py-5">
    <div class="container">
        <h2 class="display-5 text-center mb-3">기능</h2>
        <p class="text-center text-muted mb-5">
            스펙 정확 개발을 위한 강력한 도구와 방법론
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
                        <h3 class="h5 text-primary mb-3">완전한 명세</h3>
                        <p class="text-muted">
                            데이터베이스 스키마부터 UI/UX 세부사항까지 프로젝트의 모든 측면을
                            포괄하는 포괄적인 명세를 작성합니다.
                        </p>
                    </div>
                </div>
            </div>

            <!-- 다른 기능들을 위해 반복 -->
        </div>
    </div>
</section>
```

#### 6.4 워크플로우 섹션

```html
<section id="workflow" class="py-5 bg-light">
    <div class="container">
        <h2 class="display-5 text-center mb-3">개발 워크플로우</h2>
        <p class="text-center text-muted mb-5">
            스펙 정확 개발을 위한 체계적인 접근법
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
                        <h3 class="h5 mb-2">준비 단계</h3>
                        <p class="text-muted">
                            포괄적인 명세 스토리라인(100개 이상 항목)을 작성하고 청사진 수준의
                            세부사항으로 변환합니다. 데이터베이스 스펙, 기능 스펙, 라우팅,
                            함수, UI/UX 요구사항, 테스트 스펙, 배포 설정을 포함합니다.
                        </p>
                    </div>
                </div>

                <!-- 다른 워크플로우 단계들을 위해 반복 -->
            </div>
        </div>
    </div>
</section>
```

#### 6.5 푸터

```html
<footer class="bg-dark text-white pt-5 pb-3">
    <div class="container">
        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <h5 class="text-primary mb-3">SEDAI</h5>
                <p class="small">
                    AI를 이용한 스펙 정확 개발<br>
                    Song Jaeho 제작<br>
                    2025년 11월 4일
                </p>
            </div>

            <div class="col-md-3">
                <h5 class="text-primary mb-3">리소스</h5>
                <ul class="list-unstyled">
                    <li class="mb-2">
                        <a href="https://github.com/thruthesky/sedai" class="text-white-50 text-decoration-none">
                            GitHub 저장소
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://www.npmjs.com/package/sedai" class="text-white-50 text-decoration-none">
                            NPM 패키지
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://github.com/thruthesky/sedai/blob/main/README.md" class="text-white-50 text-decoration-none">
                            문서
                        </a>
                    </li>
                </ul>
            </div>

            <div class="col-md-3">
                <h5 class="text-primary mb-3">연락처</h5>
                <ul class="list-unstyled">
                    <li class="mb-2">
                        <a href="mailto:thruthesky@gmail.com" class="text-white-50 text-decoration-none">
                            thruthesky@gmail.com
                        </a>
                    </li>
                    <li class="mb-2">
                        <a href="https://github.com/thruthesky/sedai/issues" class="text-white-50 text-decoration-none">
                            이슈 보고
                        </a>
                    </li>
                </ul>
            </div>

            <div class="col-md-3">
                <h5 class="text-primary mb-3">라이선스</h5>
                <p class="small">
                    SEDAI 도구: MIT 라이선스<br>
                    SED 명세: SED Specification License
                </p>
            </div>
        </div>

        <hr class="border-secondary">

        <div class="text-center py-3">
            <p class="small text-muted mb-0">
                &copy; 2025 Song Jaeho. All rights reserved.<br>
                "SED에서 명세는 단순한 문서가 아닙니다 - 개발을 직접 주도하는 진리의 원천입니다."
            </p>
        </div>
    </div>
</footer>
```

---

### 7. 접근성

#### ARIA 레이블

**네비게이션:**
```html
<nav class="navbar" role="navigation" aria-label="주 네비게이션">
    <!-- 네비게이션 콘텐츠 -->
</nav>
```

**버튼:**
```html
<button type="button" class="btn btn-primary" aria-label="SEDAI 시작하기">
    시작하기
</button>
```

**링크:**
```html
<a href="#quick-start" aria-label="빠른 시작 섹션으로 이동">빠른 시작</a>
```

#### 키보드 네비게이션

모든 상호작용 요소는 키보드로 접근 가능해야 합니다:
- 버튼: Enter/Space로 활성화
- 링크: Enter로 네비게이션
- 드롭다운: 화살표 키로 네비게이션, Enter로 선택
- 모달: Esc로 닫기

#### 포커스 상태

```css
/* 보이는 포커스 표시 보장 */
a:focus,
button:focus,
.btn:focus {
    outline: 2px solid #6366F1;
    outline-offset: 2px;
}

/* 메인 콘텐츠로 건너뛰기 링크 */
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

#### 색상 대비

모든 텍스트는 WCAG 2.1 Level AA 표준을 충족해야 합니다:
- 일반 텍스트: 4.5:1 대비율
- 큰 텍스트 (18pt+): 3:1 대비율
- UI 컴포넌트: 3:1 대비율

**검증된 조합:**
- `#6366F1` (주색상)의 흰색 텍스트 - ✓ 통과
- 흰색의 어두운 텍스트 `#1F2937` - ✓ 통과
- 흰색의 흐린 텍스트 `#6B7280` - ✓ 통과

---

### 8. 애니메이션 및 전환

#### 호버 효과

```css
/* 카드 호버 */
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* 버튼 호버 */
.btn {
    transition: all 0.2s ease;
}

.btn:hover {
    transform: translateY(-2px);
}

/* 링크 호버 */
a {
    transition: opacity 0.2s ease, color 0.2s ease;
}

a:hover {
    opacity: 0.8;
}
```

#### 스크롤 동작

```css
html {
    scroll-behavior: smooth;
}
```

#### 로딩 상태

```html
<button class="btn btn-primary" type="button" disabled>
    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    로딩 중...
</button>
```

---

### 9. 반응형 디자인

#### 모바일 우선 접근법

항상 모바일 디자인으로 시작하고 더 큰 화면으로 확장합니다:

```html
<!-- 모바일: 세로로 쌓기 -->
<!-- 태블릿+: 두 열 -->
<div class="row row-cols-1 row-cols-md-2 g-4">
    <div class="col">열 1</div>
    <div class="col">열 2</div>
</div>
```

#### 중단점에서 숨기기/보이기

```html
<!-- 모바일에서 숨김, 태블릿 이상에서 표시 -->
<div class="d-none d-md-block">데스크톱 콘텐츠</div>

<!-- 모바일에서 표시, 태블릿 이상에서 숨김 -->
<div class="d-block d-md-none">모바일 콘텐츠</div>
```

#### 반응형 텍스트

```html
<!-- 모바일에서 작게, 데스크톱에서 크게 -->
<h1 class="display-6 display-md-4 display-lg-3">반응형 제목</h1>

<!-- 모바일에서 중앙, 태블릿 이상에서 왼쪽 정렬 -->
<p class="text-center text-md-start">반응형 정렬</p>
```

#### 반응형 간격

```html
<!-- 모바일에서 작은 패딩, 태블릿 이상에서 큰 패딩 -->
<section class="py-3 py-md-5">
    <!-- 콘텐츠 -->
</section>
```

---

### 10. 브라우저 지원

**최소 브라우저 버전:**
- Chrome/Edge: 최근 2 버전
- Firefox: 최근 2 버전
- Safari: 최근 2 버전
- iOS Safari: iOS 12+
- Android Chrome: Android 5+

**폴리필 불필요** - Bootstrap 5.3.8은 IE11을 지원하지 않습니다

---

### 11. 성능 최적화

#### CSS

```html
<!-- 최소화된 Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- 스크롤 없이 볼 수 있는 콘텐츠를 위한 인라인 크리티컬 CSS -->
<style>
    /* 크리티컬 CSS 여기 */
</style>

<!-- 커스텀 CSS 비동기 로드 -->
<link href="./assets/css/custom.css" rel="stylesheet" media="print" onload="this.media='all'">
```

#### JavaScript

```html
<!-- </body> 닫기 전에 배치 -->
<!-- Bootstrap 번들은 Popper.js를 포함 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

<!-- 커스텀 스크립트 지연 -->
<script src="./assets/js/custom.js" defer></script>
```

#### 이미지

```html
<!-- 지연 로딩 -->
<img src="image.jpg" loading="lazy" alt="설명">

<!-- 반응형 이미지 -->
<img srcset="image-320w.jpg 320w,
             image-640w.jpg 640w,
             image-1280w.jpg 1280w"
     sizes="(max-width: 640px) 100vw, 640px"
     src="image-640w.jpg"
     alt="설명">
```

---

### 12. 테스트 체크리스트

배포 전 검증:

- [ ] 모든 Bootstrap 컴포넌트가 올바르게 렌더링됨
- [ ] 반응형 디자인이 모든 중단점에서 작동 (xs, sm, md, lg, xl, xxl)
- [ ] 모든 상호작용 요소가 키보드로 접근 가능
- [ ] 색상 대비가 WCAG AA 표준 충족
- [ ] 모든 링크가 올바르게 작동
- [ ] 폼이 올바르게 검증
- [ ] 콘솔 오류 없음
- [ ] 페이지 로딩이 3초 미만
- [ ] 모든 이미지에 alt 텍스트 있음
- [ ] HTML 검증 통과 (W3C 검증기)
- [ ] 크로스 브라우저 테스트 완료

---

## 요약

본 명세는 Bootstrap 5.3.8을 사용한 SEDAI 홈페이지 디자인의 모든 측면을 정의합니다. AI는 명시된 대로 정확히 구현해야 합니다:

1. **Bootstrap 5.3.8 CDN 사용** - Bootstrap 소스 수정 없음
2. **커스텀 CSS 적용** - 색상 및 사소한 조정만
3. **시맨틱 HTML5 따르기** - `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` 적절히 사용
4. **Bootstrap 클래스 사용** - 그리드, 유틸리티, 컴포넌트 활용
5. **접근성 유지** - ARIA 레이블, 키보드 네비게이션, 색상 대비
6. **반응성 보장** - 모바일 우선, 모든 중단점 테스트
7. **성능 최적화** - 최소 커스텀 CSS, 지연 로딩, 지연된 스크립트

**즉흥적인 것은 허용되지 않습니다.** 모든 색상, 간격, 컴포넌트, 상호작용이 정의되어 있습니다. 여기에 명시되지 않은 것이 있으면 명확히 하기 위해 질문하세요 - 추측하거나 추론하지 마세요.

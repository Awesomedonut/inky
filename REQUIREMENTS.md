# Inky Requirements (Code-Derived)

Last updated: 2026-03-03  
Source of truth: current implementation in `app/`, `components/`, and `lib/`.

## Functional Requirements

### FR-001: Home and discovery
- The home page must show recent works (up to 12), sorted newest first.
- Users must be able to navigate to browse works and post a new work.

### FR-002: Browse works
- Users must be able to browse works on `/works`.
- Users must be able to search by title, summary, or author (`q` query param).
- Users must be able to filter by tag (`tag` query param).
- Results must be paginated with 20 works per page (`page` query param).

### FR-003: Work detail pages
- Users must be able to view a work by ID (`/works/[id]`).
- Work pages must display title, author, summary, tags, word count, chapter count, hit count, and kudos count.
- Work pages must display chapter index and chapter navigation when multiple chapters exist.
- Work pages must render comments and comment form.

### FR-004: Chapter detail pages
- Users must be able to view a chapter by work ID + chapter ID.
- Chapter pages must validate chapter/work association before rendering.
- Chapter pages must include prev/next chapter navigation and comments.

### FR-005: Create work
- Users must be able to create a work with:
  - title (required)
  - optional author/summary/rating/tags
  - chapter 1 body (required)
  - chapter title (optional)
  - chapter format (`rich_text` or `html`)
- System must return a one-time raw edit token after creation.
- UI must show the edit token immediately and instruct users to save it.

### FR-006: Edit/delete work (token-based)
- Users must provide edit token to update or delete a work.
- Edit token must be verified server-side before mutation.
- Editable fields are limited to: title, author, summary, rating, fandoms, relationships, characters, freeforms.

### FR-007: Add chapter (token-based)
- Users must provide edit token to add new chapters.
- Chapter body is required.
- Chapter format must be restricted to `rich_text` or `html`.
- Work stats (word/chapter counts) must be recalculated after chapter creation.

### FR-008: Comments
- Users must be able to read comments per work.
- Signed-in users (Google session) can post comments without captcha.
- Anonymous users can post comments only after successful Cloudflare Turnstile verification.
- Comment body is required.

### FR-009: Reactions and view counters
- Users must be able to leave kudos on a work.
- Users must be able to register hits on work/chapter views.
- Client must locally prevent repeated kudos from the same browser via `localStorage`.

### FR-010: Tag APIs and UI
- System must provide aggregated tags across works.
- Tag suggestions must be queryable by tag type and partial match.
- Tag filter UI must provide links to filtered browse results.

### FR-011: Auth
- System must support Google sign-in/sign-out via NextAuth.
- Header must reflect auth state and show login/logout actions.

### FR-012: Text rendering
- `rich_text` mode must support simple `*italic*` formatting.
- `html` mode must sanitize HTML and only allow a safe subset of tags and link protocols.

### FR-013: Analytics
- If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, the app must load GA4 `gtag.js`.
- App must emit manual `page_view` events on route changes.

## Non-Functional Requirements

### NFR-001: Security and abuse prevention
- Edit tokens must be stored only as SHA-256 hashes.
- Raw edit token must only be returned at creation time.
- Anonymous comments must be protected by Turnstile.
- HTML input must be sanitized before rendering.
- PII should not be logged/stored beyond explicit fields in data files.

### NFR-002: Data persistence and integrity
- Data must persist to local JSON files in `data/` (`works.json`, `chapters.json`, `comments.json`).
- Writes must be atomic at file level using temp-file + rename strategy.
- IDs must be UUID-based.

### NFR-003: Performance and rendering behavior
- Core content pages use dynamic rendering (`force-dynamic`) to reflect latest data.
- Listing pagination size is fixed at 20 items/page.

### NFR-004: Compatibility and stack
- Runtime stack is Next.js App Router + React 19 + TypeScript.
- Auth provider is Google (NextAuth v5 beta).

### NFR-005: Accessibility baseline
- App layout must include skip link to main content.
- Semantic headings/navigation landmarks should be preserved across pages.

### NFR-006: Operational configuration
- Required environment variables:
  - `AUTH_SECRET`
  - `AUTH_GOOGLE_ID`
  - `AUTH_GOOGLE_SECRET`
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
  - `TURNSTILE_SECRET_KEY`
- Optional environment variables:
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## Known Gaps / Edge Cases

- `page` query parsing can produce invalid `NaN` behavior for malformed inputs (for example, `?page=abc`).
- Works API can return `totalPages = 0` when there are no works; consumers should handle empty states.
- Counter increments (`hits`, `kudos`) are file-based and not concurrency-safe under heavy parallel writes.
- Build may fail in restricted/offline environments when fetching Google Fonts (`next/font/google`).

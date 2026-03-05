# UI Style Improvement Steps

This document outlines the steps to keep the app clean, modern, and professional with a light-only theme and no iconography.

## 1) Global style foundation
- Use semantic tokens in `src/index.css` for all surfaces, text, borders, and states.
- Keep typography consistent (body, headings, captions) and avoid ad-hoc `text-gray-*` and `bg-gray-*` usage in page code.
- Prefer `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, and `bg-card` for layout surfaces.

## 2) App shell and navigation
- Sidebar and header should be text-first, minimal, and consistent.
- Avoid decorative gradients and heavy shadows.
- Use subtle hover and active states with neutral contrast.

## 3) Page structure consistency
- Standardize spacing: page padding, section gaps, card padding, and list spacing.
- Use consistent heading hierarchy: page title, section title, support text.

## 4) Forms and inputs
- Use consistent input sizes and label styles.
- Keep helper text, errors, and placeholder styles uniform.

## 5) Lists and tables
- Use a single row style for lists (height, padding, borders).
- Avoid mixed card + table layouts on the same page.

## 6) Status and feedback
- Use text labels and subtle status badges.
- Avoid icon-based status indicators.

## 7) Accessibility checks
- Ensure contrast ratios meet WCAG AA.
- Keep focus states visible and consistent.

## 8) Final QA
- Confirm: no lucide icons visible, light-only theme, consistent typography and spacing across all screens.
- Run build and do a full UI walkthrough on desktop and mobile.

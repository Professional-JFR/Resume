# Resume & Portfolio Hub

This repository is a personal resume and portfolio site built to present role-specific experience and selected software projects in one clear, recruiter-friendly place. It pairs a lightweight static site with thoughtful accessibility, print, and validation details—without introducing a server-side framework.

**Live site:** [professional-jfr.github.io/Resume](https://professional-jfr.github.io/Resume/)

## What’s included

- A landing page that organizes resume options and highlights selected projects.
- Role-targeted resume pages for general software engineering, full-stack, Python, Java, AI, data, embedded, and .NET roles, alongside an original resume.
- Print-ready layouts and a save-to-PDF flow for sharing resumes offline.
- Optional client-side theme switching and GitHub project statistics.

## Tech stack

- **HTML** for page structure and content
- **CSS** for shared, responsive screen and print styling
- **TypeScript** for typed browser-side interactions, compiled to JavaScript
- **GitHub Pages** for static site hosting
- **GitHub Actions** for continuous integration

## Engineering highlights

- Accessibility-minded markup, labeled controls, visible keyboard focus, and reduced-motion support.
- Landing-page SEO metadata, social-sharing tags, and structured data.
- Shared styling across resume pages, with layouts adapted for print.
- A site-check script validates page metadata and local references; `npm test` runs it after the TypeScript build.
- CI runs the build and site checks, and verifies that committed generated JavaScript is up to date.
- GitHub project statistics are loaded client-side and cached, while resume content remains usable if the API is unavailable.

## Why this project is portfolio-worthy

This is both a personal brand experience and a small production-minded web project. It demonstrates how to present information for different audiences while keeping the implementation lightweight, accessible, maintainable, and easy to validate. The result gives recruiters a direct path from the portfolio overview to relevant experience and project work.

## Local development

Requires Node.js and npm.

```sh
npm ci
npm run build
npm test
```

The TypeScript build writes browser JavaScript to `dist/`; those generated files are committed so the static site can serve the interactions directly.

## Possible future improvements

- Move repeated resume content into typed data and generate the role-specific pages.
- Add Lighthouse CI to track accessibility, performance, and SEO over time.
- Add a sitemap, `robots.txt`, canonical URLs, and a social preview image.

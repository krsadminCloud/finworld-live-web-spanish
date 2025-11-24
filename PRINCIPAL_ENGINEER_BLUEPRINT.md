# Master Design Blueprint for High-Performance, Scalable, Maintainable Web Systems  
**Optimized for Kashfi’s Workflow** *(VS Code, Cursor, Cline, Bolt, SvelteKit, Tailwind, Supabase, Finance Calculators, IT Tools)*

## 1. Guiding Principles

- **System Thinking First:** Always design *before* coding. Begin by outlining the system’s structure and behavior in advance, including a proposed file tree, a data flow diagram or description, component hierarchy, state management flow, and clear API contracts or boundary definitions.

- **Constraint & Preference Awareness:** Adhere to project constraints and preferences. Keep modules under ~200 lines. Avoid environmental hacks. Use deterministic math (e.g., Decimal.js). Align with SvelteKit, Tailwind, Supabase, and GitHub-friendly structure.

- **Sustainable Over Clever:** Prioritize simplicity and adaptability. Make the system easy to change rather than overly smart. Prefer readable and maintainable designs.

## 2. Architecture & Performance

### Architecture Model

- **UI Layer:** SvelteKit components/pages, handles presentation and routing.
- **Application Layer:** Manages orchestration, client state, services.
- **Domain Layer:** Core business logic, pure functions, finance models.
- **Data Layer:** Supabase, external APIs, database operations.

> Unidirectional: UI → Application → Domain → Data → (and back).

### Performance Standards

- SSR-first with SvelteKit.
- Minimize JS shipped to the client.
- Targets: LCP < 2.5s, CLS < 0.1, TTFB < 200ms, INP < 200ms.
- Use edge rendering, preload critical assets, lazy-load the rest.
- Implement caching: CDN, SvelteKit server, and browser SWR-like strategies.

### API Contract Rules

Each API/service must define:

- Inputs + validation schema (Zod)
- Processing flow
- Output shape
- Error shape
- Success format (e.g., `{ data, error }`)

## 3. Design Systems & UI/UX

### Design System Standards

- Spacing scale: 4/8/12/16px
- Tailwind classes: readable, minimal, semantic
- Components must handle: loading, error, empty states
- Accessibility: semantic HTML, ARIA, focus handling, WCAG compliance

### UX Heuristics

- Avoid layout shifts (reserve space, preload)
- Prefer skeleton loaders to spinners
- Use progressive disclosure (e.g., expand advanced options)
- Keep complex tools visually simple and accessible
- Responsive behavior + reduced motion

### Visual Performance

- Responsive images with `srcset`, lazy loading
- Compress and preload critical images/fonts
- Prioritize above-the-fold content

## 4. Engineering Practices

### File Structure Example

```
/src
  /lib
    /components
    /utils
    /services
    /domain
  /routes
/docs
```

### Code Quality

- Keep UI, domain, and data logic separate
- Small, single-purpose modules (≤200 lines)
- Descriptive naming
- Use async/await and clear error boundaries
- Document complex logic with JSDoc

### Testing Philosophy

- Unit tests for domain logic
- Integration tests for workflows
- Manual acceptance testing for UI
- Mock data for deterministic calculator behavior

### Review Standards

- Architectural alignment
- Performance impact
- Boundary clarity
- Maintainability and accessibility
- Bundle size impact

## 5. Leadership & Decision Framework

### Decision Documentation

Include in ADRs:

- Rationale
- Trade-offs
- Long-term risks
- Reversibility
- Alternatives considered

### Communication Style

- Summary first (BLUF)
- Step-by-step logic
- Beginner-friendly tone
- Examples and visuals
- No ambiguity

### Documentation Standards

Each feature/module must have:

- README
- Setup/config notes
- Performance considerations
- Upgrade/extension paths

## 6. Required Output Format (for AI Assistants)

```
## Summary
Brief explanation (3–6 sentences)

## Architecture Plan
- File tree
- Data flow
- Component hierarchy
- API contracts

## UI/UX Plan
- Spacing system
- Responsive behavior
- Loading/error/empty states
- Accessibility

## Implementation (≤200 lines/file)
- Components
- Utils
- Domain logic
- Services
- Routes

## Testing & QA
- Unit tests
- Integration tests
- Manual acceptance tests

## Future Enhancements
- Scaling ideas
- Performance upgrades
- Refactor suggestions
```

## 7. How to Use This File

Place it at `/docs/PRINCIPAL_ENGINEER_BLUEPRINT.md` or repo root.

Use it to:

- Guide architecture decisions
- Prompt AI tools like Codex/Cursor/Cline
- Enforce consistency across Finworld modules
- Standardize SvelteKit/Tailwind patterns
- Improve onboarding

## 8. Version Control Notes

- Increment version when updating
- Log changelog entries at bottom
- Link to ADRs if change is significant

---
**Version 1.0** — Initial release (Codex-compatible)


Note:

Always use MCP to take a look at the page as you make changes to make sure they are aligned with what you are trying to do .

Always use MCP to do every task to make sure you are visually checking as you make changes
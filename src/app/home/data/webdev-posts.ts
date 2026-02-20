import { BlogPost } from '../models/blog-post.model';

export const WEBDEV_POSTS: BlogPost[] = [
	{
		id: 3,
		title: 'CSS Container Queries Are Here — Stop Using Only Media Queries',
		summary:
			"Container queries let components respond to their parent's size, not just the viewport. This changes everything for reusable components.",
		category: 'Web Dev',
		date: '2026-02-12',
		readTime: '4 min read',
		tags: ['CSS', 'Frontend', 'Responsive Design'],
		content: `Media queries respond to the **viewport** size. But what if your component lives in a sidebar one moment and a full-width section the next?\n\n**Container Queries to the Rescue**\n\`\`\`css\n.card-container {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card { display: flex; }\n}\n\n@container (max-width: 399px) {\n  .card { display: block; }\n}\n\`\`\`\n\nThe component adapts to its **container**, not the screen. This is huge for design systems and reusable components.\n\n**Browser Support**\nAll modern browsers now support container queries. It's safe to use in production.\n\nStart using \`container-type: inline-size\` on wrapper elements and write \`@container\` rules instead of \`@media\` for component-level responsiveness.`,
	},
	{
		id: 19,
		title: 'TypeScript 5.x: Features Every Developer Should Know',
		summary:
			'TypeScript keeps evolving. From const type parameters to satisfies, these features will make your code safer and more expressive.',
		category: 'Web Dev',
		date: '2025-11-28',
		readTime: '6 min read',
		tags: ['TypeScript', 'JavaScript', 'Frontend'],
		content: `TypeScript has shipped several game-changing features in recent versions. Here are the ones that matter most for day-to-day development.\n\n**The satisfies Operator**\nValidate that an expression matches a type without widening it:\n\`\`\`typescript\ntype Route = { path: string; component: string };\n\nconst routes = {\n  home: { path: '/', component: 'HomeComponent' },\n  about: { path: '/about', component: 'AboutComponent' },\n} satisfies Record<string, Route>;\n\n// routes.home.path is still typed as '/' (literal), not string\n\`\`\`\n\n**const Type Parameters**\nForce literal type inference in generics:\n\`\`\`typescript\nfunction createConfig<const T extends readonly string[]>(items: T): T {\n  return items;\n}\n\nconst colors = createConfig(['red', 'blue', 'green']);\n// Type: readonly ['red', 'blue', 'green'] — not string[]\n\`\`\`\n\n**Decorators (Standard)**\nTypeScript 5.0 shipped TC39 standard decorators:\n\`\`\`typescript\nfunction log(target: any, context: ClassMethodDecoratorContext) {\n  return function (...args: any[]) {\n    console.log(\`Calling \${String(context.name)}\`);\n    return target.apply(this, args);\n  };\n}\n\nclass UserService {\n  @log\n  getUser(id: number) { /* ... */ }\n}\n\`\`\`\n\n**Using Declarations (Explicit Resource Management)**\n\`\`\`typescript\nasync function processFile() {\n  using file = await openFile('data.txt');\n  // file is automatically disposed when the block exits\n  return file.read();\n}\n\`\`\`\n\n**Template Literal Types**\nBuild types from string patterns:\n\`\`\`typescript\ntype EventName = 'click' | 'focus' | 'blur';\ntype Handler = \`on\${Capitalize<EventName>}\`;\n// Type: 'onClick' | 'onFocus' | 'onBlur'\n\`\`\`\n\n**Utility Type Improvements**\n\`NoInfer<T>\` prevents TypeScript from inferring a type parameter from a specific position:\n\`\`\`typescript\nfunction createFSM<S extends string>(initial: S, transitions: Record<S, NoInfer<S>[]>) { }\n\`\`\`\n\nStay current with TypeScript releases — each version brings features that reduce boilerplate and catch more bugs at compile time.`,
	},
	{
		id: 20,
		title: 'Web Performance: Core Web Vitals Optimization Guide',
		summary:
			"Google uses Core Web Vitals as a ranking factor. Here's a practical guide to measuring and improving LCP, INP, and CLS.",
		category: 'Web Dev',
		date: '2025-11-20',
		readTime: '7 min read',
		tags: ['Performance', 'SEO', 'Web Dev', 'Frontend'],
		content: `Core Web Vitals are Google's metrics for user experience. They directly affect your search rankings. Here's what they measure and how to optimize them.\n\n**The Three Metrics**\n- LCP (Largest Contentful Paint) — How fast the main content loads. Target: < 2.5s\n- INP (Interaction to Next Paint) — How responsive the page is to user input. Target: < 200ms\n- CLS (Cumulative Layout Shift) — How much the layout moves unexpectedly. Target: < 0.1\n\n**Optimizing LCP**\n\`\`\`html\n<!-- Preload the largest image -->\n<link rel="preload" as="image" href="hero.webp" fetchpriority="high">\n\n<!-- Use modern formats -->\n<picture>\n  <source srcset="hero.avif" type="image/avif">\n  <source srcset="hero.webp" type="image/webp">\n  <img src="hero.jpg" alt="Hero" width="1200" height="600" fetchpriority="high">\n</picture>\n\`\`\`\n\nOther LCP wins:\n- Minimize render-blocking CSS and JS\n- Use a CDN for static assets\n- Inline critical CSS\n- Server-side render above-the-fold content\n\n**Optimizing INP**\nINP replaced FID in 2024. It measures all interactions, not just the first one.\n\`\`\`javascript\n// BAD: Long task blocks the main thread\nbutton.addEventListener('click', () => {\n  processThousandItems(); // 500ms of work\n  updateUI();\n});\n\n// GOOD: Break up work with yielding\nbutton.addEventListener('click', async () => {\n  updateUI(); // Instant visual feedback\n  await scheduler.yield(); // Let the browser paint\n  processThousandItems(); // Heavy work after paint\n});\n\`\`\`\n\n- Use \`requestAnimationFrame\` for visual updates\n- Debounce input handlers\n- Move heavy computation to Web Workers\n\n**Optimizing CLS**\n\`\`\`css\n/* Always set dimensions on images and videos */\nimg, video {\n  width: 100%;\n  height: auto;\n  aspect-ratio: 16 / 9;\n}\n\n/* Reserve space for dynamic content */\n.ad-slot {\n  min-height: 250px;\n}\n\`\`\`\n\n- Never insert content above existing content\n- Use CSS \`contain\` to isolate layout changes\n- Prefer CSS animations over JavaScript animations\n- Use \`font-display: swap\` with size-adjusted fallback fonts\n\n**Measuring**\nUse these tools to track Core Web Vitals:\n- Chrome DevTools Performance panel\n- Lighthouse CI in your deployment pipeline\n- Google Search Console (field data)\n- web-vitals npm package for real user monitoring\n\nCore Web Vitals optimization isn't just about SEO — it directly improves user experience and conversion rates.`,
	},
	{
		id: 21,
		title: 'Modern CSS: Features You Should Be Using in 2026',
		summary:
			'CSS has evolved dramatically. Native nesting, :has(), subgrid, and scroll-driven animations are production-ready. Time to update your toolkit.',
		category: 'Web Dev',
		date: '2025-11-12',
		readTime: '6 min read',
		tags: ['CSS', 'Frontend', 'Web Dev'],
		content: `CSS in 2026 is almost unrecognizable from five years ago. Features that used to require preprocessors or JavaScript are now native.\n\n**Native CSS Nesting**\nNo more Sass just for nesting:\n\`\`\`css\n.card {\n  padding: 1rem;\n  background: var(--surface);\n\n  & .title {\n    font-size: 1.25rem;\n    font-weight: 600;\n  }\n\n  &:hover {\n    box-shadow: 0 4px 12px oklch(0 0 0 / 0.1);\n  }\n\n  @media (width >= 768px) {\n    & { padding: 2rem; }\n  }\n}\n\`\`\`\n\n**The :has() Selector**\nStyle a parent based on its children — previously impossible in CSS:\n\`\`\`css\n/* Style form groups that contain an invalid input */\n.form-group:has(input:invalid) {\n  border-color: red;\n}\n\n/* Style article differently if it has an image */\narticle:has(img) {\n  grid-template-columns: 1fr 1fr;\n}\n\n/* Disable a button if a required field is empty */\nform:has(input:required:placeholder-shown) button {\n  opacity: 0.5;\n  pointer-events: none;\n}\n\`\`\`\n\n**CSS Subgrid**\nChild elements can align to the parent grid's tracks:\n\`\`\`css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}\n\n.card {\n  display: grid;\n  grid-template-rows: subgrid;\n  grid-row: span 3; /* Participate in parent's row tracks */\n}\n\`\`\`\nThis finally solves the "cards with different content heights" alignment problem.\n\n**Scroll-Driven Animations**\n\`\`\`css\n.parallax-image {\n  animation: parallax linear;\n  animation-timeline: scroll();\n}\n\n@keyframes parallax {\n  from { transform: translateY(-100px); }\n  to { transform: translateY(100px); }\n}\n\`\`\`\nNo JavaScript needed for scroll-linked effects.\n\n**OKLCH Color Space**\n\`\`\`css\n:root {\n  --primary: oklch(65% 0.25 260);\n  --primary-light: oklch(80% 0.15 260);\n  --primary-dark: oklch(45% 0.25 260);\n}\n\`\`\`\nPerceptually uniform — adjusting lightness actually looks like adjusting lightness, unlike HSL.\n\nThe line between CSS and preprocessors has nearly disappeared. Build systems for CSS are becoming optional, and that's a good thing.`,
	},
	{
		id: 22,
		title: 'Web Components: Building Framework-Agnostic UI Elements',
		summary:
			'Web Components work everywhere — Angular, React, Vue, or plain HTML. Learn when and how to use Custom Elements, Shadow DOM, and templates.',
		category: 'Web Dev',
		date: '2025-11-05',
		readTime: '5 min read',
		tags: ['Web Components', 'JavaScript', 'Frontend'],
		content: `Web Components are a set of browser standards for creating reusable, encapsulated HTML elements. They work with any framework — or none at all.\n\n**The Three Standards**\n1. Custom Elements — Define new HTML tags\n2. Shadow DOM — Encapsulated styles and markup\n3. HTML Templates — Reusable template fragments\n\n**Creating a Custom Element**\n\`\`\`javascript\nclass StatusBadge extends HTMLElement {\n  static observedAttributes = ['status'];\n\n  constructor() {\n    super();\n    this.attachShadow({ mode: 'open' });\n  }\n\n  connectedCallback() {\n    this.render();\n  }\n\n  attributeChangedCallback() {\n    this.render();\n  }\n\n  render() {\n    const status = this.getAttribute('status') || 'unknown';\n    const colors = { active: '#22c55e', inactive: '#ef4444', pending: '#f59e0b' };\n\n    this.shadowRoot.innerHTML = \`\n      <style>\n        .badge {\n          display: inline-flex;\n          align-items: center;\n          gap: 6px;\n          padding: 4px 12px;\n          border-radius: 999px;\n          font-size: 0.875rem;\n          font-weight: 500;\n          background: \${colors[status] || '#6b7280'}20;\n          color: \${colors[status] || '#6b7280'};\n        }\n        .dot {\n          width: 8px;\n          height: 8px;\n          border-radius: 50%;\n          background: currentColor;\n        }\n      </style>\n      <span class="badge">\n        <span class="dot"></span>\n        \${status}\n      </span>\n    \`;\n  }\n}\n\ncustomElements.define('status-badge', StatusBadge);\n\`\`\`\n\n**Usage — Works Everywhere**\n\`\`\`html\n<status-badge status="active"></status-badge>\n<status-badge status="pending"></status-badge>\n\`\`\`\n\n**Shadow DOM Encapsulation**\nStyles inside the Shadow DOM don't leak out, and external styles don't leak in. This guarantees your component looks the same regardless of where it's used.\n\n**When to Use Web Components**\n- Design system elements shared across teams using different frameworks\n- Embeddable widgets (chat widgets, feedback forms)\n- Micro-frontend architecture\n- When you need framework independence\n\n**When NOT to Use Them**\n- Within a single-framework app (use framework components instead)\n- Complex stateful applications (frameworks handle this better)\n- When SSR is critical (shadow DOM support in SSR is limited)\n\nWeb Components aren't a replacement for Angular or React — they complement them. Use them for the parts of your UI that need to work everywhere.`,
	},
];

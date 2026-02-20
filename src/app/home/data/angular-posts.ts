import { BlogPost } from '../models/blog-post.model';

export const ANGULAR_POSTS: BlogPost[] = [
	{
		id: 1,
		title: "Angular 21: What's New and Why It Matters",
		summary:
			'Angular 21 is here with resource APIs, signal-based forms, and zoneless change detection by default. A look at what shipped and why it matters.',
		category: 'Angular',
		date: '2026-02-18',
		readTime: '6 min read',
		tags: ['Angular', 'TypeScript', 'Frontend'],
		content: `Angular 21 marks another major step in the framework's modern evolution. Here's what shipped and why it matters.\n\n**Zoneless by Default**\nNew projects are now zoneless out of the box — no more Zone.js. Change detection is driven entirely by signals and the framework's internal scheduler. Existing apps can opt in with \`provideExperimentalZonelessChangeDetection()\`, but for new projects it's the default.\n\n**Resource API**\nThe new \`resource()\` and \`rxResource()\` APIs provide a declarative way to load async data tied to signals:\n\`\`\`typescript\nuserId = signal(1);\nuserResource = resource({\n  request: () => ({ id: this.userId() }),\n  loader: ({ request }) => this.http.get('/api/users/' + request.id),\n});\n// userResource.value(), userResource.isLoading(), userResource.error()\n\`\`\`\nNo more manual subscribe/unsubscribe patterns for data fetching.\n\n**Signal-Based Forms**\nReactive forms now have signal-powered variants that integrate directly with Angular's reactivity model:\n\`\`\`typescript\nname = formSignal('');\nemail = formSignal('', { validators: [Validators.email] });\n// Template: <input [formSignal]="name" />\n\`\`\`\n\n**Improved @let Syntax**\nTemplate local variables are now stable:\n\`\`\`html\n@let fullName = user.firstName + ' ' + user.lastName;\n<h2>{{ fullName }}</h2>\n\`\`\`\n\n**Enhanced SSR with Partial Hydration**\nBuilding on incremental hydration from Angular 19, partial hydration now lets you skip hydrating components entirely if they're static content — reducing JavaScript payload.\n\n**Standalone Schematics**\nAll CLI schematics generate standalone code only. NgModule schematics have been removed.\n\nAngular 21 is the most signal-native release yet. If you've been waiting to go all-in on signals, now's the time.`,
	},
	{
		id: 6,
		title: 'Angular Signals vs RxJS: When to Use Which',
		summary:
			"Signals and RxJS both handle reactivity in Angular — but they solve different problems. Here's when to reach for each.",
		category: 'Angular',
		date: '2026-02-01',
		readTime: '4 min read',
		tags: ['Angular', 'RxJS', 'Signals', 'TypeScript'],
		content: `With Angular Signals now stable, developers are wondering: do I still need RxJS?\n\n**Use Signals When:**\n- Managing simple component state (counters, toggles, form values)\n- You want synchronous, fine-grained reactivity\n- You're building new components from scratch\n\n\`\`\`typescript\ncount = signal(0);\ndoubled = computed(() => this.count() * 2);\nincrement() { this.count.update(v => v + 1); }\n\`\`\`\n\n**Use RxJS When:**\n- Working with HTTP requests, WebSockets, or event streams\n- You need operators like debounceTime, switchMap, retry\n- Handling complex async workflows\n\n\`\`\`typescript\nthis.searchResults$ = this.searchInput$.pipe(\n  debounceTime(300),\n  switchMap(query => this.http.get(\`/api/search?q=\${query}\`))\n);\n\`\`\`\n\n**The Bottom Line**\nSignals replace simple uses of BehaviorSubject and basic state management. RxJS is still the right tool for async streams and complex event handling. They complement each other.`,
	},
	{
		id: 7,
		title: 'Dependency Injection in Angular: A Practical Deep Dive',
		summary:
			"Angular's DI system is one of its most powerful features. Learn how to use providers, injection tokens, and hierarchical injectors effectively.",
		category: 'Angular',
		date: '2026-01-28',
		readTime: '7 min read',
		tags: ['Angular', 'TypeScript', 'Architecture'],
		content: `Dependency Injection (DI) is at the heart of Angular. Every service, guard, and interceptor relies on it. But most developers only scratch the surface.\n\n**The Basics: providedIn**\nThe simplest way to register a service is tree-shakable:\n\`\`\`typescript\n@Injectable({ providedIn: 'root' })\nexport class UserService {\n  private users = signal<User[]>([]);\n  readonly users$ = this.users.asReadonly();\n}\n\`\`\`\nThis creates a singleton available app-wide.\n\n**Component-Level Providers**\nNeed a fresh instance per component? Provide it locally:\n\`\`\`typescript\n@Component({\n  providers: [FormStateService]\n})\nexport class CheckoutComponent { }\n\`\`\`\nEach instance of CheckoutComponent gets its own FormStateService.\n\n**InjectionToken for Non-Class Values**\nNeed to inject a config object or primitive value?\n\`\`\`typescript\nexport const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');\n\n// In providers:\n{ provide: API_BASE_URL, useValue: 'https://api.example.com' }\n\n// In a service:\nconstructor(@Inject(API_BASE_URL) private apiUrl: string) { }\n\`\`\`\n\n**inject() Function (Modern Approach)**\nAngular 14+ introduced the \`inject()\` function as an alternative to constructor injection:\n\`\`\`typescript\nexport class ProductComponent {\n  private productService = inject(ProductService);\n  private router = inject(Router);\n}\n\`\`\`\nThis is cleaner in standalone components and reduces constructor boilerplate.\n\n**Hierarchical Injectors**\nAngular has a tree of injectors: Platform → Root → Component. Each level can override providers. This lets you swap implementations for testing or feature-specific behavior.\n\nUnderstanding DI deeply lets you build modular, testable, and flexible applications.`,
	},
	{
		id: 8,
		title: 'Building Custom Structural Directives in Angular',
		summary:
			'Go beyond *ngIf and *ngFor — learn how to create your own structural directives for cleaner, more expressive templates.',
		category: 'Angular',
		date: '2026-01-22',
		readTime: '6 min read',
		tags: ['Angular', 'Directives', 'TypeScript'],
		content: `Structural directives like *ngIf and *ngFor manipulate the DOM by adding or removing elements. You can build your own for custom logic.\n\n**How Structural Directives Work**\nAngular transforms the asterisk syntax into an \`<ng-template>\`:\n\`\`\`html\n<!-- This: -->\n<div *appIfRole="'admin'">Secret content</div>\n\n<!-- Becomes: -->\n<ng-template [appIfRole]="'admin'">\n  <div>Secret content</div>\n</ng-template>\n\`\`\`\n\n**Building a Role-Based Directive**\n\`\`\`typescript\n@Directive({ selector: '[appIfRole]', standalone: true })\nexport class IfRoleDirective {\n  private authService = inject(AuthService);\n  private templateRef = inject(TemplateRef<any>);\n  private viewContainer = inject(ViewContainerRef);\n  private hasView = false;\n\n  @Input() set appIfRole(role: string) {\n    const hasRole = this.authService.currentUser()?.roles.includes(role);\n    if (hasRole && !this.hasView) {\n      this.viewContainer.createEmbeddedView(this.templateRef);\n      this.hasView = true;\n    } else if (!hasRole && this.hasView) {\n      this.viewContainer.clear();\n      this.hasView = false;\n    }\n  }\n}\n\`\`\`\n\n**A Repeat Directive**\nHere's a simpler example — repeat content N times:\n\`\`\`typescript\n@Directive({ selector: '[appRepeat]', standalone: true })\nexport class RepeatDirective {\n  private templateRef = inject(TemplateRef<any>);\n  private viewContainer = inject(ViewContainerRef);\n\n  @Input() set appRepeat(count: number) {\n    this.viewContainer.clear();\n    for (let i = 0; i < count; i++) {\n      this.viewContainer.createEmbeddedView(this.templateRef, { index: i });\n    }\n  }\n}\n\`\`\`\n\n**When to Create Custom Directives**\n- Role-based or permission-based rendering\n- Feature flags\n- Complex conditional logic that clutters templates\n- Reusable view manipulation patterns\n\nCustom structural directives keep your templates clean and your logic testable.`,
	},
	{
		id: 9,
		title: 'Angular Route Guards: Protecting Your Application',
		summary:
			'Route guards control who can navigate where. Learn how to implement authentication, authorization, and data-preloading guards.',
		category: 'Angular',
		date: '2026-01-15',
		readTime: '5 min read',
		tags: ['Angular', 'Routing', 'Security'],
		content: `Route guards are functions that run before a route activates, deactivates, or loads. They're essential for protecting routes and preloading data.\n\n**Functional Guards (Modern Approach)**\nAngular now favors functional guards over class-based ones:\n\`\`\`typescript\nexport const authGuard: CanActivateFn = (route, state) => {\n  const authService = inject(AuthService);\n  const router = inject(Router);\n\n  if (authService.isAuthenticated()) {\n    return true;\n  }\n  return router.createUrlTree(['/login'], {\n    queryParams: { returnUrl: state.url }\n  });\n};\n\`\`\`\n\n**Applying Guards to Routes**\n\`\`\`typescript\nexport const routes: Routes = [\n  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },\n  { path: 'admin', component: AdminComponent, canActivate: [authGuard, roleGuard('admin')] },\n];\n\`\`\`\n\n**Role-Based Guard Factory**\nYou can create guard factories for flexible role checking:\n\`\`\`typescript\nexport function roleGuard(requiredRole: string): CanActivateFn {\n  return () => {\n    const auth = inject(AuthService);\n    return auth.hasRole(requiredRole) || inject(Router).createUrlTree(['/unauthorized']);\n  };\n}\n\`\`\`\n\n**Data Preloading with Resolvers**\nResolvers fetch data before the component loads:\n\`\`\`typescript\nexport const productResolver: ResolveFn<Product> = (route) => {\n  return inject(ProductService).getById(route.params['id']);\n};\n\n// In routes:\n{ path: 'product/:id', component: ProductComponent, resolve: { product: productResolver } }\n\`\`\`\n\n**Guard Types**\n- \`canActivate\` — Can the user navigate to this route?\n- \`canDeactivate\` — Can the user leave this route? (unsaved changes)\n- \`canMatch\` — Should this route even be considered during matching?\n- \`resolve\` — Preload data before the component renders\n\nGuards keep your routing logic clean and your app secure.`,
	},
	{
		id: 10,
		title: 'Server-Side Rendering with Angular: A Complete Guide',
		summary:
			'SSR improves performance and SEO for Angular apps. Learn how to set it up with Angular Universal and the new hydration features.',
		category: 'Angular',
		date: '2026-01-08',
		readTime: '8 min read',
		tags: ['Angular', 'SSR', 'Performance', 'SEO'],
		content: `By default, Angular apps render in the browser. Server-Side Rendering (SSR) pre-renders pages on the server, sending fully-formed HTML to the client.\n\n**Why SSR?**\n- Better SEO — search engines see fully rendered content\n- Faster First Contentful Paint (FCP)\n- Better experience on slow devices/connections\n- Social media link previews work correctly\n\n**Adding SSR to an Angular Project**\n\`\`\`bash\nng add @angular/ssr\n\`\`\`\nThis sets up the server entry point, Express server, and build configuration automatically.\n\n**How It Works**\n1. User requests a page\n2. Server renders the Angular app to HTML\n3. Browser receives pre-rendered HTML (fast first paint)\n4. Angular hydrates the page — attaching event listeners to existing DOM\n5. App becomes fully interactive\n\n**Incremental Hydration**\nAngular 19 introduced incremental hydration with \`@defer\`:\n\`\`\`html\n@defer (hydrate on viewport) {\n  <app-comments [postId]="post.id" />\n}\n\`\`\`\nThis renders the component on the server but delays hydration until it enters the viewport. Huge performance win for below-the-fold content.\n\n**Common Pitfalls**\n- Don't access \`window\`, \`document\`, or \`localStorage\` directly — use \`isPlatformBrowser()\` or \`afterNextRender()\`\n- Avoid side effects in constructors\n- HTTP requests should use absolute URLs on the server\n- Use \`TransferState\` to avoid duplicate API calls\n\n**Build and Deploy**\n\`\`\`bash\nng build\nnode dist/my-app/server/server.mjs\n\`\`\`\n\nSSR is no longer a complex add-on — it's a first-class citizen in modern Angular. For content-heavy or SEO-critical apps, there's no reason not to use it.`,
	},
];

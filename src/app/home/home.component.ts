import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BlogPost {
	id: number;
	title: string;
	summary: string;
	category: string;
	date: string;
	readTime: string;
	tags: string[];
	content: string;
}

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent {
	selectedPost: BlogPost | null = null;
	activeCategory = 'All';

	categories = ['All', 'Angular', 'C#', '.NET', 'Web Dev', 'DevOps'];

	posts: BlogPost[] = [
		{
			id: 1,
			title: 'Angular 19: What\'s New and Why It Matters',
			summary:
				'A deep dive into the latest Angular release — standalone components by default, signal-based reactivity, and improved SSR.',
			category: 'Angular',
			date: '2026-02-18',
			readTime: '5 min read',
			tags: ['Angular', 'TypeScript', 'Frontend'],
			content: `Angular 19 brings a wave of improvements that make the framework leaner and more modern.\n\n**Standalone by Default**\nComponents are now standalone by default — no more NgModules unless you need them. This simplifies project structure significantly.\n\n**Signal-Based Reactivity**\nSignals are now the recommended way to manage state. They offer fine-grained reactivity without the complexity of RxJS for simple use cases.\n\n**Improved SSR & Hydration**\nServer-side rendering got a major overhaul with incremental hydration, making pages interactive faster.\n\n**Deferrable Views**\nThe @defer block lets you lazy-load parts of a template based on triggers like viewport visibility or user interaction.\n\nAngular 19 is a solid step forward — if you haven't upgraded yet, now's the time.`,
		},
		{
			id: 2,
			title: 'Building REST APIs with ASP.NET Core Minimal APIs',
			summary:
				'Minimal APIs in .NET make building lightweight HTTP services fast and clean. Here\'s how to get started.',
			category: 'C#',
			date: '2026-02-15',
			readTime: '7 min read',
			tags: ['C#', '.NET', 'Backend', 'API'],
			content: `Minimal APIs in ASP.NET Core let you build HTTP endpoints with just a few lines of code — no controllers needed.\n\n**Getting Started**\nCreate a new project with:\n\`\`\`\ndotnet new web -n MyApi\n\`\`\`\n\n**Define Endpoints**\n\`\`\`csharp\nvar app = builder.Build();\napp.MapGet("/hello", () => "Hello World!");\napp.MapPost("/items", (Item item) => Results.Created($"/items/{item.Id}", item));\napp.Run();\n\`\`\`\n\n**When to Use Minimal APIs**\n- Microservices and small APIs\n- Prototyping\n- When you want less ceremony than MVC\n\nMinimal APIs pair beautifully with Entity Framework Core for database access. They're production-ready and fully supported.`,
		},
		{
			id: 3,
			title: 'CSS Container Queries Are Here — Stop Using Only Media Queries',
			summary:
				'Container queries let components respond to their parent\'s size, not just the viewport. This changes everything for reusable components.',
			category: 'Web Dev',
			date: '2026-02-12',
			readTime: '4 min read',
			tags: ['CSS', 'Frontend', 'Responsive Design'],
			content: `Media queries respond to the **viewport** size. But what if your component lives in a sidebar one moment and a full-width section the next?\n\n**Container Queries to the Rescue**\n\`\`\`css\n.card-container {\n  container-type: inline-size;\n}\n\n@container (min-width: 400px) {\n  .card { display: flex; }\n}\n\n@container (max-width: 399px) {\n  .card { display: block; }\n}\n\`\`\`\n\nThe component adapts to its **container**, not the screen. This is huge for design systems and reusable components.\n\n**Browser Support**\nAll modern browsers now support container queries. It's safe to use in production.\n\nStart using \`container-type: inline-size\` on wrapper elements and write \`@container\` rules instead of \`@media\` for component-level responsiveness.`,
		},
		{
			id: 4,
			title: 'Getting Started with Docker for .NET Developers',
			summary:
				'Docker simplifies deployment by packaging your app and its dependencies into containers. Here\'s a practical guide for .NET devs.',
			category: 'DevOps',
			date: '2026-02-08',
			readTime: '6 min read',
			tags: ['Docker', 'DevOps', '.NET', 'Deployment'],
			content: `Docker lets you package your .NET app into a container that runs the same everywhere — your machine, CI/CD, production.\n\n**Basic Dockerfile for .NET**\n\`\`\`dockerfile\nFROM mcr.microsoft.com/dotnet/sdk:9.0 AS build\nWORKDIR /app\nCOPY . .\nRUN dotnet publish -c Release -o out\n\nFROM mcr.microsoft.com/dotnet/aspnet:9.0\nWORKDIR /app\nCOPY --from=build /app/out .\nENTRYPOINT ["dotnet", "MyApp.dll"]\n\`\`\`\n\n**Key Commands**\n- \`docker build -t myapp .\` — build the image\n- \`docker run -p 8080:80 myapp\` — run the container\n- \`docker compose up\` — run multi-container setups\n\n**Why Docker?**\n- Consistent environments (no more "works on my machine")\n- Easy scaling and deployment\n- Great for microservices\n\nOnce you're comfortable with Docker, explore Docker Compose for multi-service apps and Kubernetes for orchestration.`,
		},
		{
			id: 5,
			title: 'Entity Framework Core: Tips for Better Performance',
			summary:
				'EF Core is powerful but easy to misuse. These tips will help you avoid common performance pitfalls.',
			category: '.NET',
			date: '2026-02-05',
			readTime: '5 min read',
			tags: ['C#', '.NET', 'Entity Framework', 'Database'],
			content: `Entity Framework Core makes database access easy, but that convenience can hide performance issues.\n\n**1. Use AsNoTracking for Read-Only Queries**\n\`\`\`csharp\nvar users = await db.Users.AsNoTracking().ToListAsync();\n\`\`\`\nSkips change tracking — faster for queries where you don't need to update data.\n\n**2. Avoid N+1 Queries**\nUse \`.Include()\` to eager-load related data:\n\`\`\`csharp\nvar orders = await db.Orders.Include(o => o.Items).ToListAsync();\n\`\`\`\n\n**3. Use Projections with Select**\nDon't load entire entities when you only need a few fields:\n\`\`\`csharp\nvar names = await db.Users.Select(u => new { u.Name, u.Email }).ToListAsync();\n\`\`\`\n\n**4. Batch Updates with ExecuteUpdate**\n.NET 7+ supports bulk operations:\n\`\`\`csharp\nawait db.Users.Where(u => !u.IsActive).ExecuteDeleteAsync();\n\`\`\`\n\n**5. Always Check Generated SQL**\nUse \`.ToQueryString()\` or logging to see what SQL EF is actually generating.`,
		},
		{
			id: 6,
			title: 'Angular Signals vs RxJS: When to Use Which',
			summary:
				'Signals and RxJS both handle reactivity in Angular — but they solve different problems. Here\'s when to reach for each.',
			category: 'Angular',
			date: '2026-02-01',
			readTime: '4 min read',
			tags: ['Angular', 'RxJS', 'Signals', 'TypeScript'],
			content: `With Angular Signals now stable, developers are wondering: do I still need RxJS?\n\n**Use Signals When:**\n- Managing simple component state (counters, toggles, form values)\n- You want synchronous, fine-grained reactivity\n- You're building new components from scratch\n\n\`\`\`typescript\ncount = signal(0);\ndoubled = computed(() => this.count() * 2);\nincrement() { this.count.update(v => v + 1); }\n\`\`\`\n\n**Use RxJS When:**\n- Working with HTTP requests, WebSockets, or event streams\n- You need operators like debounceTime, switchMap, retry\n- Handling complex async workflows\n\n\`\`\`typescript\nthis.searchResults$ = this.searchInput$.pipe(\n  debounceTime(300),\n  switchMap(query => this.http.get(\`/api/search?q=\${query}\`))\n);\n\`\`\`\n\n**The Bottom Line**\nSignals replace simple uses of BehaviorSubject and basic state management. RxJS is still the right tool for async streams and complex event handling. They complement each other.`,
		},
	];

	get filteredPosts(): BlogPost[] {
		if (this.activeCategory === 'All') return this.posts;
		return this.posts.filter((p) => p.category === this.activeCategory);
	}

	selectCategory(category: string): void {
		this.activeCategory = category;
		this.selectedPost = null;
	}

	openPost(post: BlogPost): void {
		this.selectedPost = post;
	}

	closePost(): void {
		this.selectedPost = null;
	}

	getParagraphs(content: string): string[] {
		return content.split('\n\n');
	}

	isCodeBlock(paragraph: string): boolean {
		return paragraph.startsWith('```');
	}

	stripCodeFences(paragraph: string): string {
		return paragraph
			.replace(/```\w*\n?/g, '')
			.replace(/```$/g, '');
	}

	formatText(paragraph: string): string {
		return paragraph
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
	}
}

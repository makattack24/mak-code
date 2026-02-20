import { BlogPost } from '../models/blog-post.model';

export const DOTNET_POSTS: BlogPost[] = [
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
		id: 15,
		title: 'Building Real-Time Apps with SignalR',
		summary:
			'SignalR makes real-time communication between server and client effortless. Build live dashboards, chat apps, and notifications.',
		category: '.NET',
		date: '2025-12-28',
		readTime: '7 min read',
		tags: ['.NET', 'SignalR', 'Real-Time', 'WebSockets'],
		content: `SignalR is a library for adding real-time web functionality to .NET applications. It handles WebSockets, Server-Sent Events, and long polling automatically.\n\n**Server-Side Hub**\nA Hub is the server-side endpoint clients connect to:\n\`\`\`csharp\npublic class ChatHub : Hub\n{\n    public async Task SendMessage(string user, string message)\n    {\n        await Clients.All.SendAsync("ReceiveMessage", user, message);\n    }\n\n    public async Task JoinRoom(string roomName)\n    {\n        await Groups.AddToGroupAsync(Context.ConnectionId, roomName);\n        await Clients.Group(roomName).SendAsync("UserJoined", Context.User?.Identity?.Name);\n    }\n\n    public override async Task OnDisconnectedAsync(Exception? exception)\n    {\n        await Clients.All.SendAsync("UserLeft", Context.ConnectionId);\n        await base.OnDisconnectedAsync(exception);\n    }\n}\n\`\`\`\n\n**Registration**\n\`\`\`csharp\nbuilder.Services.AddSignalR();\napp.MapHub<ChatHub>("/chatHub");\n\`\`\`\n\n**Angular Client**\nInstall the client package and connect:\n\`\`\`typescript\nimport * as signalR from '@microsoft/signalr';\n\nconst connection = new signalR.HubConnectionBuilder()\n  .withUrl('/chatHub')\n  .withAutomaticReconnect()\n  .build();\n\nconnection.on('ReceiveMessage', (user: string, message: string) => {\n  this.messages.update(msgs => [...msgs, { user, message }]);\n});\n\nawait connection.start();\n\`\`\`\n\n**Use Cases**\n- Live chat and messaging\n- Real-time dashboards and monitoring\n- Collaborative editing\n- Push notifications\n- Live sports scores or stock tickers\n\n**Scaling SignalR**\nFor multi-server deployments, use a backplane:\n- Azure SignalR Service (managed, scales automatically)\n- Redis backplane (self-hosted)\n\nSignalR abstracts away the complexity of real-time communication. You focus on the messages, it handles the transport.`,
	},
	{
		id: 16,
		title: '.NET Aspire: Cloud-Native Development Made Easy',
		summary:
			'.NET Aspire is a new stack for building observable, production-ready distributed applications. It simplifies orchestration, service discovery, and telemetry.',
		category: '.NET',
		date: '2025-12-20',
		readTime: '6 min read',
		tags: ['.NET', 'Aspire', 'Cloud-Native', 'Microservices'],
		content: `Building distributed systems in .NET used to mean stitching together dozens of libraries for health checks, logging, service discovery, and configuration. .NET Aspire changes that.\n\n**What Is Aspire?**\nAspire is an opinionated stack that provides:\n- Service orchestration and discovery\n- Built-in telemetry (OpenTelemetry)\n- Health checks and resilience\n- A developer dashboard\n- Component packages for common services (Redis, PostgreSQL, RabbitMQ, etc.)\n\n**The AppHost Project**\nThe orchestrator project defines your distributed app:\n\`\`\`csharp\nvar builder = DistributedApplication.CreateBuilder(args);\n\nvar cache = builder.AddRedis("cache");\nvar db = builder.AddPostgres("db\").AddDatabase("catalog");\n\nvar catalogApi = builder.AddProject<Projects.CatalogApi>("catalog-api\")\n    .WithReference(db)\n    .WithReference(cache);\n\nbuilder.AddProject<Projects.WebApp>("webapp\")\n    .WithReference(catalogApi);\n\nbuilder.Build().Run();\n\`\`\`\n\n**Service Defaults**\nThe ServiceDefaults project configures cross-cutting concerns once:\n\`\`\`csharp\nbuilder.AddServiceDefaults(); // Adds OpenTelemetry, health checks, resilience\n\`\`\`\n\n**The Dashboard**\nAspire includes a developer dashboard that shows:\n- All running services and their status\n- Distributed traces across services\n- Structured logs from all services\n- Metrics and resource consumption\n\n**Component Packages**\n\`\`\`csharp\n// Adds configured Redis client with health checks and telemetry\nbuilder.AddRedisClient("cache\");\n\n// Adds configured EF Core with retry and health checks\nbuilder.AddNpgsqlDbContext<CatalogContext>("db\");\n\`\`\`\n\n**Why Aspire Matters**\nIt brings the cloud-native developer experience that other ecosystems have had (like Spring Boot in Java) to .NET. You get production-grade observability and resilience out of the box, not as an afterthought.\n\nIf you're building microservices or any multi-project .NET solution, Aspire is worth adopting.`,
	},
	{
		id: 17,
		title: 'Middleware in ASP.NET Core: How the Pipeline Works',
		summary:
			'Every HTTP request in ASP.NET Core flows through a middleware pipeline. Understanding it is key to building robust web applications.',
		category: '.NET',
		date: '2025-12-12',
		readTime: '5 min read',
		tags: ['.NET', 'ASP.NET Core', 'Middleware', 'Architecture'],
		content: `The middleware pipeline is the backbone of ASP.NET Core. Every request and response flows through it, and understanding it unlocks powerful patterns.\n\n**How It Works**\nMiddleware components form a pipeline. Each one can:\n1. Do work before calling the next middleware\n2. Call the next middleware\n3. Do work after the next middleware returns\n\n\`\`\`csharp\napp.Use(async (context, next) =>\n{\n    var stopwatch = Stopwatch.StartNew();\n    await next(context);\n    stopwatch.Stop();\n    context.Response.Headers.Append("X-Response-Time\", $\"{stopwatch.ElapsedMilliseconds}ms\");\n});\n\`\`\`\n\n**Order Matters**\nThe order you register middleware defines the pipeline:\n\`\`\`csharp\napp.UseExceptionHandler();   // 1. Catch exceptions\napp.UseHttpsRedirection();   // 2. Redirect HTTP to HTTPS\napp.UseStaticFiles();        // 3. Serve static files\napp.UseAuthentication();     // 4. Who are you?\napp.UseAuthorization();      // 5. Can you access this?\napp.MapControllers();        // 6. Route to endpoints\n\`\`\`\n\n**Custom Middleware Class**\nFor complex middleware, create a dedicated class:\n\`\`\`csharp\npublic class ApiKeyMiddleware\n{\n    private readonly RequestDelegate _next;\n\n    public ApiKeyMiddleware(RequestDelegate next) => _next = next;\n\n    public async Task InvokeAsync(HttpContext context)\n    {\n        if (!context.Request.Headers.TryGetValue("X-API-Key\", out var apiKey)\n            || apiKey != \"expected-key\")\n        {\n            context.Response.StatusCode = 401;\n            await context.Response.WriteAsync(\"Invalid API Key\");\n            return; // Short-circuit — don't call next\n        }\n        await _next(context);\n    }\n}\n\n// Register it:\napp.UseMiddleware<ApiKeyMiddleware>();\n\`\`\`\n\n**Short-Circuiting**\nMiddleware can stop the pipeline early by not calling \`next()\`. This is how authentication, rate limiting, and CORS work — they reject invalid requests before they reach your controllers.\n\n**Branching with Map**\n\`\`\`csharp\napp.Map(\"/api\", apiApp =>\n{\n    apiApp.UseRateLimiting();\n    apiApp.MapControllers();\n});\n\`\`\`\n\nThink of middleware as layers of an onion — the request goes in through each layer, hits your endpoint, and the response comes back out through the same layers in reverse.`,
	},
	{
		id: 18,
		title: 'Dependency Injection in .NET: Best Practices and Advanced Patterns',
		summary:
			"The built-in DI container in .NET is simple but powerful. Learn registration strategies, lifetime management, and patterns that keep your code clean.",
		category: '.NET',
		date: '2025-12-05',
		readTime: '6 min read',
		tags: ['.NET', 'Dependency Injection', 'Architecture', 'Best Practices'],
		content: `ASP.NET Core has a built-in dependency injection container. It's simpler than Autofac or Ninject, but handles most scenarios well.\n\n**Service Lifetimes**\nChoosing the right lifetime is critical:\n\`\`\`csharp\nbuilder.Services.AddTransient<IEmailSender, SmtpEmailSender>();  // New instance every time\nbuilder.Services.AddScoped<IShoppingCart, ShoppingCart>();        // One per HTTP request\nbuilder.Services.AddSingleton<ICacheService, MemoryCacheService>(); // One for the app\n\`\`\`\n\n**The Captive Dependency Problem**\nNever inject a scoped service into a singleton — the scoped service becomes a singleton too:\n\`\`\`csharp\n// BAD: DbContext (scoped) injected into a singleton\npublic class CacheService // Singleton\n{\n    public CacheService(AppDbContext db) { } // db is now stuck as a singleton!\n}\n\n// GOOD: Use IServiceScopeFactory\npublic class CacheService\n{\n    private readonly IServiceScopeFactory _scopeFactory;\n    public CacheService(IServiceScopeFactory factory) => _scopeFactory = factory;\n\n    public async Task RefreshCache()\n    {\n        using var scope = _scopeFactory.CreateScope();\n        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();\n        // Use db safely\n    }\n}\n\`\`\`\n\n**Keyed Services (.NET 8+)**\nRegister multiple implementations of the same interface:\n\`\`\`csharp\nbuilder.Services.AddKeyedSingleton<INotifier, EmailNotifier>(\"email\");\nbuilder.Services.AddKeyedSingleton<INotifier, SmsNotifier>(\"sms\");\n\n// Resolve:\npublic class OrderService([FromKeyedServices(\"email\")] INotifier notifier) { }\n\`\`\`\n\n**Options Pattern**\nFor configuration, use the Options pattern instead of injecting IConfiguration:\n\`\`\`csharp\nbuilder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection(\"Smtp\"));\n\npublic class EmailSender(IOptions<SmtpSettings> options)\n{\n    private readonly SmtpSettings _settings = options.Value;\n}\n\`\`\`\n\n**Extension Methods for Clean Registration**\nOrganize registrations into extension methods:\n\`\`\`csharp\npublic static class ServiceCollectionExtensions\n{\n    public static IServiceCollection AddInfrastructure(this IServiceCollection services)\n    {\n        services.AddScoped<IUserRepository, SqlUserRepository>();\n        services.AddScoped<IOrderRepository, SqlOrderRepository>();\n        services.AddSingleton<ICacheService, RedisCacheService>();\n        return services;\n    }\n}\n\n// In Program.cs:\nbuilder.Services.AddInfrastructure();\n\`\`\`\n\nThe built-in container is sufficient for most apps. Only reach for third-party containers if you need features like convention-based registration or property injection.`,
	},
];

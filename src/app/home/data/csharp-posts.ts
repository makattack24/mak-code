import { BlogPost } from '../models/blog-post.model';

export const CSHARP_POSTS: BlogPost[] = [
	{
		id: 2,
		title: 'Building REST APIs with ASP.NET Core Minimal APIs',
		summary:
			"Minimal APIs in .NET make building lightweight HTTP services fast and clean. Here's how to get started.",
		category: 'C#',
		date: '2026-02-15',
		readTime: '7 min read',
		tags: ['C#', '.NET', 'Backend', 'API'],
		content: `Minimal APIs in ASP.NET Core let you build HTTP endpoints with just a few lines of code — no controllers needed.\n\n**Getting Started**\nCreate a new project with:\n\`\`\`\ndotnet new web -n MyApi\n\`\`\`\n\n**Define Endpoints**\n\`\`\`csharp\nvar app = builder.Build();\napp.MapGet("/hello", () => "Hello World!");\napp.MapPost("/items", (Item item) => Results.Created($"/items/{item.Id}", item));\napp.Run();\n\`\`\`\n\n**When to Use Minimal APIs**\n- Microservices and small APIs\n- Prototyping\n- When you want less ceremony than MVC\n\nMinimal APIs pair beautifully with Entity Framework Core for database access. They're production-ready and fully supported.`,
	},
	{
		id: 11,
		title: 'Pattern Matching in C# 12: A Complete Guide',
		summary:
			'C# pattern matching has evolved far beyond simple type checks. Master switch expressions, property patterns, and list patterns.',
		category: 'C#',
		date: '2026-01-25',
		readTime: '6 min read',
		tags: ['C#', '.NET', 'Language Features'],
		content: `Pattern matching in C# has grown from simple \`is\` checks into a powerful expression system. C# 12 completes the picture with list patterns and refined syntax.\n\n**Switch Expressions**\nReplace verbose switch statements with concise expressions:\n\`\`\`csharp\nstring GetDiscount(Customer customer) => customer switch\n{\n    { Tier: "Gold", YearsActive: > 5 } => "30% off",\n    { Tier: "Gold" } => "20% off",\n    { Tier: "Silver" } => "10% off",\n    { IsNewCustomer: true } => "15% welcome discount",\n    _ => "No discount"\n};\n\`\`\`\n\n**Property Patterns**\nMatch on nested properties without deconstructing:\n\`\`\`csharp\nif (order is { Customer.Address.Country: "US", Total: > 100 })\n{\n    ApplyFreeShipping(order);\n}\n\`\`\`\n\n**List Patterns (C# 11+)**\nMatch against collection contents:\n\`\`\`csharp\nint[] numbers = { 1, 2, 3, 4, 5 };\n\nvar result = numbers switch\n{\n    [1, 2, ..] => "Starts with 1, 2",\n    [_, _, _, ..var rest] => $"Has 3+ elements, rest: {rest.Length}",\n    [] => "Empty array",\n    _ => "Something else"\n};\n\`\`\`\n\n**Relational Patterns**\nCombine comparisons naturally:\n\`\`\`csharp\nstring ClassifyTemp(double temp) => temp switch\n{\n    < 0 => "Freezing",\n    >= 0 and < 20 => "Cold",\n    >= 20 and < 30 => "Comfortable",\n    >= 30 => "Hot"\n};\n\`\`\`\n\n**Why Pattern Matching Matters**\nIt reduces branching boilerplate, makes intent clearer, and catches missing cases at compile time with exhaustiveness checking. If you're still writing chains of if-else, pattern matching will transform how you write C#.`,
	},
	{
		id: 12,
		title: 'Understanding LINQ: Beyond the Basics',
		summary:
			'Most developers use LINQ for filtering and projecting. But LINQ has powerful operators you might be missing — grouping, aggregation, and custom queries.',
		category: 'C#',
		date: '2026-01-18',
		readTime: '6 min read',
		tags: ['C#', '.NET', 'LINQ', 'Data'],
		content: `LINQ is one of C#'s killer features, but many developers only use \`Where\`, \`Select\`, and \`FirstOrDefault\`. There's much more.\n\n**GroupBy for Aggregation**\n\`\`\`csharp\nvar ordersByCountry = orders\n    .GroupBy(o => o.Customer.Country)\n    .Select(g => new {\n        Country = g.Key,\n        TotalRevenue = g.Sum(o => o.Total),\n        OrderCount = g.Count()\n    })\n    .OrderByDescending(x => x.TotalRevenue);\n\`\`\`\n\n**Chunk for Batching**\n.NET 6+ added \`Chunk\` for splitting collections:\n\`\`\`csharp\nvar batches = customers.Chunk(100);\nforeach (var batch in batches)\n{\n    await ProcessBatch(batch);\n}\n\`\`\`\n\n**DistinctBy and MinBy/MaxBy**\n\`\`\`csharp\nvar uniqueByEmail = users.DistinctBy(u => u.Email);\nvar cheapestProduct = products.MinBy(p => p.Price);\n\`\`\`\n\n**Zip for Parallel Iteration**\n\`\`\`csharp\nvar names = new[] { "Alice", "Bob", "Charlie" };\nvar scores = new[] { 95, 87, 92 };\nvar results = names.Zip(scores, (name, score) => $"{name}: {score}");\n// ["Alice: 95", "Bob: 87", "Charlie: 92"]\n\`\`\`\n\n**Aggregate for Custom Reductions**\n\`\`\`csharp\nvar sentence = words.Aggregate((current, next) => $"{current} {next}");\n\`\`\`\n\n**Performance Tip: Use Span with LINQ Alternatives**\nFor hot paths, LINQ's allocations can matter. Consider \`foreach\` loops or \`Span<T>\` for performance-critical code. But for 95% of business logic, LINQ's readability wins.\n\nLINQ is a deep toolbox — invest time learning its full API and your C# code will be shorter, clearer, and more expressive.`,
	},
	{
		id: 13,
		title: 'Async/Await in C#: Patterns, Pitfalls, and Best Practices',
		summary:
			"Async programming in C# looks simple on the surface. But misuse leads to deadlocks, thread starvation, and subtle bugs. Here's how to do it right.",
		category: 'C#',
		date: '2026-01-10',
		readTime: '7 min read',
		tags: ['C#', '.NET', 'Async', 'Performance'],
		content: `The async/await keywords make asynchronous C# code look synchronous. But there are real pitfalls if you don't understand what's happening underneath.\n\n**The Golden Rules**\n1. Async all the way — don't mix sync and async\n2. Use \`await\` instead of \`.Result\` or \`.Wait()\`\n3. Return \`Task\` not \`void\` (except event handlers)\n4. Use \`ConfigureAwait(false)\` in library code\n\n**Don't Block on Async Code**\nThis causes deadlocks in ASP.NET:\n\`\`\`csharp\n// BAD — can deadlock\nvar result = GetDataAsync().Result;\n\n// GOOD\nvar result = await GetDataAsync();\n\`\`\`\n\n**Parallel Async Operations**\nWhen tasks are independent, run them concurrently:\n\`\`\`csharp\n// Sequential — slow\nvar users = await GetUsersAsync();\nvar orders = await GetOrdersAsync();\n\n// Parallel — fast\nvar usersTask = GetUsersAsync();\nvar ordersTask = GetOrdersAsync();\nawait Task.WhenAll(usersTask, ordersTask);\nvar users = usersTask.Result;\nvar orders = ordersTask.Result;\n\`\`\`\n\n**Cancellation Tokens**\nAlways support cancellation for long-running operations:\n\`\`\`csharp\npublic async Task<List<Product>> SearchAsync(string query, CancellationToken ct = default)\n{\n    var response = await httpClient.GetAsync($"/api/search?q={query}", ct);\n    ct.ThrowIfCancellationRequested();\n    return await response.Content.ReadFromJsonAsync<List<Product>>(ct);\n}\n\`\`\`\n\n**ValueTask for Hot Paths**\nIf a method often returns synchronously (e.g., cache hits), use \`ValueTask<T>\` to avoid Task allocation:\n\`\`\`csharp\npublic ValueTask<User> GetUserAsync(int id)\n{\n    if (_cache.TryGetValue(id, out var user))\n        return ValueTask.FromResult(user);\n    return new ValueTask<User>(LoadUserFromDbAsync(id));\n}\n\`\`\`\n\n**IAsyncEnumerable for Streaming**\n\`\`\`csharp\nasync IAsyncEnumerable<LogEntry> StreamLogsAsync([EnumeratorCancellation] CancellationToken ct)\n{\n    await foreach (var line in ReadLinesAsync(ct))\n    {\n        yield return ParseLogEntry(line);\n    }\n}\n\`\`\`\n\nAsync/await is easy to start with but requires discipline to use correctly at scale.`,
	},
	{
		id: 14,
		title: 'C# Records vs Classes: When to Use Which',
		summary:
			'Records provide value semantics and immutability with minimal boilerplate. But they are not always the right choice. Learn when each fits.',
		category: 'C#',
		date: '2026-01-03',
		readTime: '5 min read',
		tags: ['C#', '.NET', 'Language Features'],
		content: `C# records were introduced in C# 9 and refined in later versions. They look like classes but behave differently in important ways.\n\n**What Makes Records Different**\n\`\`\`csharp\n// Record — value equality, immutable by default\npublic record Product(string Name, decimal Price);\n\n// Equivalent class requires much more code\npublic class Product\n{\n    public string Name { get; init; }\n    public decimal Price { get; init; }\n    // Plus: Equals, GetHashCode, ToString, Deconstruct...\n}\n\`\`\`\n\n**Value Equality**\nTwo records with the same property values are equal:\n\`\`\`csharp\nvar a = new Product("Widget", 9.99m);\nvar b = new Product("Widget", 9.99m);\nConsole.WriteLine(a == b); // true (records)\n// For classes this would be false (reference equality)\n\`\`\`\n\n**Non-Destructive Mutation with 'with'**\n\`\`\`csharp\nvar original = new Product("Widget", 9.99m);\nvar discounted = original with { Price = 7.99m };\n// original is unchanged\n\`\`\`\n\n**Record Structs**\nFor stack-allocated value types with record features:\n\`\`\`csharp\npublic record struct Point(double X, double Y);\n\`\`\`\n\n**When to Use Records**\n- DTOs and API response models\n- Domain value objects (Money, Address, Coordinates)\n- Immutable configuration objects\n- Messages and events in event-driven architectures\n\n**When to Use Classes**\n- Entities with identity (User, Order with a unique ID)\n- Services with mutable state or dependencies\n- When you need reference equality semantics\n- Complex inheritance hierarchies\n\n**A Practical Rule of Thumb**\nIf the thing is defined by its data (what it contains), use a record. If it's defined by its identity (which one it is), use a class.`,
	},
];

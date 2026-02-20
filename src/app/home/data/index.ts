import { BlogPost } from '../models/blog-post.model';
import { ANGULAR_POSTS } from './angular-posts';
import { CSHARP_POSTS } from './csharp-posts';
import { DOTNET_POSTS } from './dotnet-posts';
import { WEBDEV_POSTS } from './webdev-posts';
import { DEVOPS_POSTS } from './devops-posts';

export type { BlogPost };

/**
 * All blog posts, sorted by date (newest first).
 *
 * To add a new post:
 * 1. Open the category file in src/app/home/data/ (e.g., angular-posts.ts)
 * 2. Add a new BlogPost object to the array
 * 3. Give it a unique `id` (use the next available number)
 * 4. It will automatically appear here, sorted by date
 *
 * To add a new category:
 * 1. Create a new file (e.g., python-posts.ts)
 * 2. Import and spread it into ALL_POSTS below
 * 3. Add the category name to the `categories` array in home.component.ts
 */
export const ALL_POSTS: BlogPost[] = [
	...ANGULAR_POSTS,
	...CSHARP_POSTS,
	...DOTNET_POSTS,
	...WEBDEV_POSTS,
	...DEVOPS_POSTS,
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

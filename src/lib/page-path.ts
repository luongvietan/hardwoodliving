/**
 * Helpers for nested page path resolution and static params.
 */

export interface PageForPath {
  _id: string;
  title: string;
  slug: string;
  parentRef: string | null;
  _updatedAt?: string;
}

/**
 * Resolve path segments to the page _id, or null if not found.
 * path e.g. ['about', 'team', 'history'] -> find root 'about', then its child 'team', then its child 'history'.
 */
export function resolvePageIdByPath(
  allPages: PageForPath[],
  path: string[]
): string | null {
  if (path.length === 0) return null;
  const bySlugAndParent = new Map<string, PageForPath[]>();
  for (const p of allPages) {
    const key = `${p.slug}\0${p.parentRef ?? ""}`;
    if (!bySlugAndParent.has(key)) bySlugAndParent.set(key, []);
    bySlugAndParent.get(key)!.push(p);
  }
  let current: PageForPath | null = null;
  for (let i = 0; i < path.length; i++) {
    const segment = path[i];
    const parentId = current?._id ?? null;
    const key = `${segment}\0${parentId ?? ""}`;
    const candidates = bySlugAndParent.get(key);
    if (!candidates?.length) return null;
    current = candidates[0];
  }
  return current?._id ?? null;
}

/**
 * Return all page path arrays for generateStaticParams.
 * Root pages get [slug]; children get [parentSlug, ..., slug].
 */
export function getAllPagePaths(allPages: PageForPath[]): string[][] {
  const byParent = new Map<string | null, PageForPath[]>();
  for (const p of allPages) {
    const key = p.parentRef ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(p);
  }
  const paths: string[][] = [];
  function walk(parentId: string | null, prefix: string[]) {
    const children = byParent.get(parentId) ?? [];
    for (const c of children) {
      const path = [...prefix, c.slug];
      paths.push(path);
      walk(c._id, path);
    }
  }
  walk(null, []);
  return paths;
}

/**
 * Return all page paths with the leaf page _id (for sitemap lastModified).
 */
export function getAllPagePathsWithIds(
  allPages: PageForPath[]
): Array<{ path: string[]; id: string }> {
  const byParent = new Map<string | null, PageForPath[]>();
  for (const p of allPages) {
    const key = p.parentRef ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(p);
  }
  const result: Array<{ path: string[]; id: string }> = [];
  function walk(parentId: string | null, prefix: string[]) {
    const children = byParent.get(parentId) ?? [];
    for (const c of children) {
      const path = [...prefix, c.slug];
      result.push({ path, id: c._id });
      walk(c._id, path);
    }
  }
  walk(null, []);
  return result;
}

/**
 * Ancestor titles for breadcrumbs: [root, ..., parent] for the given path.
 */
export function getAncestorTitlesByPath(
  allPages: PageForPath[],
  path: string[]
): Array<{ title: string; slug: string }> {
  if (path.length <= 1) return [];
  const result: Array<{ title: string; slug: string }> = [];
  const bySlugAndParent = new Map<string, PageForPath[]>();
  for (const p of allPages) {
    const key = `${p.slug}\0${p.parentRef ?? ""}`;
    if (!bySlugAndParent.has(key)) bySlugAndParent.set(key, []);
    bySlugAndParent.get(key)!.push(p);
  }
  let current: PageForPath | null = null;
  for (let i = 0; i < path.length - 1; i++) {
    const segment = path[i];
    const parentId = current?._id ?? null;
    const key = `${segment}\0${parentId ?? ""}`;
    const candidates = bySlugAndParent.get(key);
    if (!candidates?.length) break;
    current = candidates[0];
    result.push({ title: current.title, slug: current.slug });
  }
  return result;
}

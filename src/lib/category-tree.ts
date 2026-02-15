/**
 * Helpers for category hierarchy: ancestor chain and descendant slugs.
 */

export interface CategoryWithNestedParent {
  _id: string;
  title: string;
  slug: { current: string };
  parent?: CategoryWithNestedParent | null;
}

/**
 * Flatten nested parent->parent->... into an array from root to immediate parent.
 */
export function flattenAncestors(
  category: CategoryWithNestedParent | null
): Array<{ _id: string; title: string; slug: { current: string } }> {
  if (!category?.parent) return [];
  const list: Array<{ _id: string; title: string; slug: { current: string } }> = [];
  let current: CategoryWithNestedParent | null | undefined = category.parent;
  while (current) {
    list.push({ _id: current._id, title: current.title, slug: current.slug });
    current = current.parent;
  }
  return list.reverse();
}

export interface CategoryWithParentSlug {
  slug: string;
  parentSlug: string | null;
}

/**
 * Return all slugs that are descendants of the given slug (recursive).
 */
export function getDescendantSlugs(
  slug: string,
  all: CategoryWithParentSlug[]
): string[] {
  const byParent = new Map<string, string[]>();
  for (const c of all) {
    const key = c.parentSlug ?? "";
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(c.slug);
  }
  const result: string[] = [];
  function collect(s: string) {
    const children = byParent.get(s);
    if (!children) return;
    for (const c of children) {
      result.push(c);
      collect(c);
    }
  }
  collect(slug);
  return result;
}

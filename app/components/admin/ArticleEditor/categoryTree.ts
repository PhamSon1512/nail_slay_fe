import type { ArticleCategory } from '~/utils/api/admin';

export type CategoryTreeNode = ArticleCategory & {
  children: CategoryTreeNode[];
  articleCount?: number;
};

export function buildCategoryTree(categories: ArticleCategory[]): CategoryTreeNode[] {
  const map = new Map<string, CategoryTreeNode>();
  for (const c of categories) {
    map.set(c.id, { ...c, children: [] });
  }
  const roots: CategoryTreeNode[] = [];
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sortNodes = (nodes: CategoryTreeNode[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    nodes.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);
  return roots;
}

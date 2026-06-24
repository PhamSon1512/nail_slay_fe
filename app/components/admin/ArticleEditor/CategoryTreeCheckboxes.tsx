import { useMemo, useState } from 'react';
import { Checkbox } from '@heroui/react';
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import type { ArticleCategory } from '~/utils/api/admin';
import { buildCategoryTree, type CategoryTreeNode } from './categoryTree';

type CategoryTreeCheckboxesProps = {
  categories: ArticleCategory[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  showCounts?: boolean;
};

function TreeNode({
  node,
  depth,
  selectedIds,
  onToggle,
  showCounts,
}: {
  node: CategoryTreeNode;
  depth: number;
  selectedIds: string[];
  onToggle: (id: string, checked: boolean) => void;
  showCounts?: boolean;
}) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div className="flex items-center gap-0.5" style={{ paddingLeft: depth * 14 }}>
        {hasChildren ? (
          <button
            type="button"
            className="p-0.5 text-[#50575e] hover:text-[#1d2327] shrink-0"
            onClick={() => setExpanded((e) => !e)}
            aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {expanded ? <RiArrowDownSLine size={14} /> : <RiArrowRightSLine size={14} />}
          </button>
        ) : (
          <span className="w-[18px] shrink-0" />
        )}
        <Checkbox
          size="sm"
          isSelected={selectedIds.includes(node.id)}
          onValueChange={(checked) => onToggle(node.id, checked)}
          classNames={{ label: 'text-sm text-[#2c3338]' }}
        >
          {node.name}
          {showCounts && node.articleCount != null ? ` (${node.articleCount})` : ''}
        </Checkbox>
      </div>
      {expanded &&
        node.children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedIds={selectedIds}
            onToggle={onToggle}
            showCounts={showCounts}
          />
        ))}
    </div>
  );
}

export function CategoryTreeCheckboxes({
  categories,
  selectedIds,
  onChange,
  showCounts,
}: CategoryTreeCheckboxesProps) {
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);

  const toggle = (id: string, checked: boolean) => {
    if (checked) onChange([...new Set([...selectedIds, id])]);
    else onChange(selectedIds.filter((x) => x !== id));
  };

  return (
    <div className="max-h-44 overflow-y-auto space-y-0.5">
      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedIds={selectedIds}
          onToggle={toggle}
          showCounts={showCounts}
        />
      ))}
    </div>
  );
}

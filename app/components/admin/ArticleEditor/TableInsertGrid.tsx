import { useState } from 'react';
import { cn } from '~/utils';

const DEFAULT_ROWS = 5;
const DEFAULT_COLS = 5;
const MAX_ROWS = 12;
const MAX_COLS = 10;

type TableInsertGridProps = {
  onInsert: (rows: number, cols: number) => void;
};

export function TableInsertGrid({ onInsert }: TableInsertGridProps) {
  const [hover, setHover] = useState({ rows: 0, cols: 0 });
  const [gridRows, setGridRows] = useState(DEFAULT_ROWS);
  const [gridCols, setGridCols] = useState(DEFAULT_COLS);

  const handleCellEnter = (row: number, col: number) => {
    setHover({ rows: row, cols: col });
    if (row >= gridRows) setGridRows(Math.min(MAX_ROWS, row + 1));
    if (col >= gridCols) setGridCols(Math.min(MAX_COLS, col + 1));
  };

  const label =
    hover.rows > 0 && hover.cols > 0 ? `${hover.rows} × ${hover.cols} bảng` : 'Chèn bảng';

  return (
    <div className="p-2" onMouseLeave={() => setHover({ rows: 0, cols: 0 })}>
      <p className="text-xs text-[#50575e] mb-2">{label}</p>
      <div
        className="inline-grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
      >
        {Array.from({ length: gridRows * gridCols }, (_, i) => {
          const row = Math.floor(i / gridCols) + 1;
          const col = (i % gridCols) + 1;
          const active = row <= hover.rows && col <= hover.cols;
          return (
            <button
              key={`${row}-${col}`}
              type="button"
              className={cn(
                'h-4 w-4 rounded-sm border border-[#c3c4c7]',
                active ? 'bg-primary-500 border-primary-600' : 'bg-white hover:bg-primary-100',
              )}
              onMouseEnter={() => handleCellEnter(row, col)}
              onClick={() => {
                if (hover.rows > 0 && hover.cols > 0) onInsert(hover.rows, hover.cols);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

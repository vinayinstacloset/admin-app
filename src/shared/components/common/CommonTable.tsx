import type { CSSProperties, ReactNode } from "react";

export interface CommonTableColumn {
  header: string;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface CommonTableProps {
  headers: CommonTableColumn[] | string[];
  data: ReactNode[][];
  rowKeys?: Array<string | number>;
  minWidth?: number | string;
  emptyMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  style?: CSSProperties;
  headerStyle?: CSSProperties;
  rowStyle?: CSSProperties;
  cellStyle?: CSSProperties;
  columnGap?: number | string;
}

const DEFAULT_WIDTH = "1fr";

export default function CommonTable({
  headers,
  data,
  rowKeys,
  minWidth = 760,
  emptyMessage = "No data available",
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  style,
  headerStyle,
  rowStyle,
  cellStyle,
  columnGap = 0,
}: CommonTableProps) {
  const columns: CommonTableColumn[] = headers.map((header) =>
    typeof header === "string" ? { header } : header,
  );
  const gridTemplateColumns = columns
    .map((column) => column.width || DEFAULT_WIDTH)
    .join(" ");

  const alignItems = (
    align?: CommonTableColumn["align"],
  ): CSSProperties["justifyContent"] =>
    align === "right"
      ? "flex-end"
      : align === "center"
        ? "center"
        : "flex-start";

  return (
    <div
      className={`w-full overflow-x-auto rounded-[9px] bg-white p-[6px] ${className}`}
      style={style}
    >
      <div style={{ minWidth }}>
        <div
          className={`grid items-center rounded-[6px_6px_0_0] bg-[#efeeec] text-[9px] font-medium uppercase text-[#55504c] ${headerClassName}`}
          style={{
            gridTemplateColumns,
            columnGap,
            minHeight: 35,
            ...headerStyle,
          }}
        >
          {columns.map((column) => (
            <div
              key={column.header}
              className="min-w-0 px-5"
              style={{ textAlign: column.align || "left" }}
            >
              {column.header}
            </div>
          ))}
        </div>

        {data.length === 0 ? (
          <div className="flex min-h-[180px] items-center justify-center px-5 text-center text-[11px] text-[#77716d]">
            {emptyMessage}
          </div>
        ) : (
          data.map((row, rowIndex) => (
            <div
              key={rowKeys?.[rowIndex] ?? rowIndex}
              className={`grid min-h-[59px] items-center border-b border-[#ddd9d6] last:border-b-0 text-[11.5px] ${rowClassName}`}
              style={{
                gridTemplateColumns,
                columnGap,
                ...rowStyle,
              }}
            >
              {columns.map((column, columnIndex) => (
                <div
                  key={`${rowKeys?.[rowIndex] ?? rowIndex}-${column.header}`}
                  className={`min-w-0 px-5 ${cellClassName}`}
                  style={{
                    textAlign: column.align || "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: alignItems(column.align),
                    ...cellStyle,
                  }}
                >
                  {row[columnIndex] ?? "-"}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

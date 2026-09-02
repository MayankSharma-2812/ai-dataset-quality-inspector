import { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function DataPreviewTable({ rawCsvText, fileName }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;

  const { headers, rows, types } = useMemo(() => {
    if (!rawCsvText) return { headers: [], rows: [], types: {} };

    const lines = rawCsvText.trim().split("\n").filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [], types: {} };

    const parsedHeaders = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
    const parsedRows = lines.slice(1).map(line => {
      // Split with simple comma handling
      return line.split(",").map(cell => cell.trim().replace(/^["']|["']$/g, ""));
    });

    // Infer types
    const inferredTypes = {};
    parsedHeaders.forEach((header, idx) => {
      let isNumeric = true;
      let hasValue = false;
      for (let r = 0; r < Math.min(parsedRows.length, 20); r++) {
        const val = parsedRows[r]?.[idx];
        if (val !== undefined && val !== "") {
          hasValue = true;
          if (isNaN(Number(val))) {
            isNumeric = false;
            break;
          }
        }
      }
      inferredTypes[header] = hasValue && isNumeric ? "number" : "string";
    });

    return { headers: parsedHeaders, rows: parsedRows, types: inferredTypes };
  }, [rawCsvText]);

  const filteredRows = useMemo(() => {
    if (!searchTerm) return rows;
    return rows.filter(row =>
      row.some(cell => String(cell).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [rows, searchTerm]);

  const paginatedRows = filteredRows.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  if (!rawCsvText || headers.length === 0) {
    return (
      <div className="glass-card">
        <div className="empty-state">
          <span className="empty-state__icon">📄</span>
          <div className="empty-state__title">No Dataset Preview Available</div>
          <p className="empty-state__text">Upload a dataset or load demo data to view raw rows and schema types.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card__header">
        <div className="glass-card__icon glass-card__icon--blue">📑</div>
        <div>
          <div className="glass-card__title">Dataset Explorer & Schema Inspector</div>
          <div className="glass-card__subtitle">
            Previewing <strong>{fileName || "dataset.csv"}</strong> ({rows.length} total rows, {headers.length} columns)
          </div>
        </div>
      </div>

      {/* Filter and Schema Bar */}
      <div className="table-controls">
        <div className="search-bar">
          <span className="search-bar__icon">🔎</span>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search within dataset rows..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
        </div>

        <div className="table-meta">
          Showing {filteredRows.length > 0 ? page * rowsPerPage + 1 : 0}–{Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length} rows
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="data-table__th data-table__th--idx">#</th>
              {headers.map((header) => (
                <th key={header} className="data-table__th">
                  <div className="th-content">
                    <span className="th-title">{header}</span>
                    <span className={`type-badge type-badge--${types[header] || "string"}`}>
                      {types[header] || "string"}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="data-table__tr">
                <td className="data-table__td data-table__td--idx">
                  {page * rowsPerPage + rowIdx + 1}
                </td>
                {headers.map((_, colIdx) => {
                  const cell = row[colIdx];
                  const isEmpty = cell === undefined || cell === "" || cell === null;
                  return (
                    <td
                      key={colIdx}
                      className={`data-table__td ${isEmpty ? "data-table__td--null" : ""}`}
                    >
                      {isEmpty ? <span className="null-indicator">NULL</span> : cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination__btn"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            ← Previous
          </button>
          <span className="pagination__label">
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="pagination__btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          >
            Next →
          </button>
        </div>
      )}
    </motion.div>
  );
}

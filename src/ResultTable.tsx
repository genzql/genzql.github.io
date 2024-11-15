import React from "react";

interface ResultTableProps {
  result: any[] | null;
}

const ResultTable: React.FC<ResultTableProps> = ({ result }) => {
  console.log("result", result);
  if (!result || result.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>SQL Result:</h2>
      <div style={{ maxWidth: "100%", overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            tableLayout: "auto",
            margin: "0 auto",
          }}
        >
          <thead>
            <tr>
              {result[0] &&
                Object.keys(result[0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      border: "1px solid orange",
                      padding: "8px",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {result.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{ border: "1px solid orange", padding: "8px" }}
                  >
                    {typeof value === "string" || typeof value === "number"
                      ? value
                      : String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;

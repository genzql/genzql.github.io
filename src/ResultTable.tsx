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
    <div style={{ marginTop: "20px" }}>
      <h2>SQL Result:</h2>
      <div>{result}</div>
    </div>
  );
};

export default ResultTable;

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";

const SQLEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div style={{ width: "500px", maxWidth: "800px", margin: "0 auto" }}>
      <CodeMirror
        value={value}
        height="300px"
        extensions={[sql()]}
        onChange={onChange}
        theme="dark"
        placeholder="Enter your SQL code here..."
        style={{ textAlign: "left" }}
      />
    </div>
  );
};

export default SQLEditor;

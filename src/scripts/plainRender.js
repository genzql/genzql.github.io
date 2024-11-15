// import { renderRoot } from "../plainRenderer";
// import baseSqlRenderer from "../../renderers/basesql/renderer";
import { createAst } from "../converter/createAst.js";
import { renderNode } from "../converter/plainRenderer.js";
import fs from "fs";

const argv = {
  parsed: "asts/select_from.ast",
  source: "examples/select_from.sql",
  ast: "asts/select_from.json",
  out: "zqlout/select_from.zql",
};

const parsed = fs.readFileSync(argv.parsed).toString();
const source = fs.readFileSync(argv.source).toString();
const root = createAst(parsed, source);
fs.writeFileSync(argv.ast, JSON.stringify(root, undefined, 2));

const zql = renderNode(root, {});
fs.writeFileSync(argv.out, zql);

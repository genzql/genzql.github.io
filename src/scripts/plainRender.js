// import { renderRoot } from "../plainRenderer";
// import baseSqlRenderer from "../../renderers/basesql/renderer";
import { createAst } from "../converter/createAst.js";
import fs from "fs";

const argv = {
  parsed: "asts/select_from.ast",
  source: "examples/select_from.sql",
  out: "asts/select_from.json",
};

const parsed = fs.readFileSync(argv.parsed).toString();
const source = fs.readFileSync(argv.source).toString();
const ast = createAst(parsed, source);
fs.writeFileSync(argv.out, JSON.stringify(ast, undefined, 2));

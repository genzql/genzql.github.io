import { createAst } from "../converter/createAst";
import { renderNode } from "../converter/renderer";
import zqlRenderer from "../renderers/zql/renderer";
import * as fs from "fs";

const argv = {
  parsed: "./asts/select_from.ast",
  source: "./examples/select_from.sql",
  ast: "./asts/select_from.json",
  out: "./zqlout/select_from.zql",
};

const parsed = fs.readFileSync(argv.parsed).toString();
const source = fs.readFileSync(argv.source).toString();
const root = createAst(parsed, source);
fs.writeFileSync(argv.ast, JSON.stringify(root, undefined, 2));

const zql = renderNode(root, zqlRenderer);
fs.writeFileSync(argv.out, zql);

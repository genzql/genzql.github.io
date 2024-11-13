const Parser = require("tree-sitter");
const BaseSql = require("./build/Release/parser.node");

const parser = new Parser();
parser.setLanguage(BaseSql);

const sourceCode = `
  SELECT 1;
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());

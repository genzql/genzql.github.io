// export type AstNode = {
//   name: string;
//   source: string;
//   children: AstNode[];
// };

const NEWLINE = "\n";
const EMPTY_CHAR = "";

const OPEN_PAREN = "(";
const CLOSE_PAREN = ")";

const CLOSE_SQUARE = "]";

const NAME_SEP = " [";
const RANGE_SEP = " - [";
const LOCATION_SEP = ", ";

function parseElement(line) {
  const content = line.trim().slice(1);
  const [nameAndStart, rawEnd] = content.split(RANGE_SEP);
  const [name, rawStart] = nameAndStart.split(NAME_SEP);
  const start = rawStart.split(CLOSE_SQUARE)[0].split(LOCATION_SEP);
  const end = rawEnd.split(CLOSE_SQUARE)[0].split(LOCATION_SEP);
  const element = {
    name,
    start: {
      line: start[0],
      char: start[1],
    },
    end: {
      line: end[0],
      char: end[1],
    },
  };
  return element;
}

function getCumulativeCharsByLine(source) {
  const lines = source.split(NEWLINE);
  let totalChars = 0;
  const cumulativeCharsByLine = [];
  for (const line of lines) {
    cumulativeCharsByLine.push(totalChars);
    totalChars += line.length;
  }
  return cumulativeCharsByLine;
}

function getRangeForSource(element, cumulativeCharsByLine) {
  const start = cumulativeCharsByLine[element.start.line] + element.start.char;
  const end = cumulativeCharsByLine[element.end.line] + element.end.char;
  return { start, end };
}

function extractSource(element, source, cumulativeCharsByLine) {
  const { start, end } = getRangeForSource(element, cumulativeCharsByLine);
  const segment = source.slice(start, end);
  return segment;
}

function parseNode(line, source, cumulativeCharsByLine) {
  const element = parseElement(line);
  return {
    name: element.name,
    source: extractSource(element, source, cumulativeCharsByLine),
    children: [],
  };
}

function getNumberOfLevelsResolved(line) {
  const squareParts = line.split(CLOSE_SQUARE);
  const closeParens = squareParts[squareParts.length - 1];
  const pops = closeParens
    .split(EMPTY_CHAR)
    .filter((c) => c === CLOSE_PAREN).length;
  const levels = pops - 1;
  return Math.max(levels, 0);
}

function findChildren(parent, records) {
  const children = [];
  const rest = [];
  let hasChildren = true;
  for (const record of records) {
    if (record.level <= parent.level) {
      hasChildren = false;
    }
    if (hasChildren) {
      children.push(record);
    } else {
      rest.push(record);
    }
  }
  return [children, rest];
}

function accumulateTreeLevel(dfsNodes) {
  if (dfsNodes.length === 0) {
    return [];
  }
  if (dfsNodes.length === 1) {
    return [dfsNodes[0].node];
  }

  const level = [];
  let remaining = dfsNodes;
  while (remaining.length > 0) {
    const [root, ...tree] = remaining;
    if (tree.length > 0) {
      const [children, rest] = findChildren(root, tree);
      const level = accumulateTreeLevel(children);
      root.node.children = level;
      remaining = rest;
    }
    level.push(root.node);
  }
  return level;
}

export function createAst(parsed, source) {
  const parsedLines = parsed.split(NEWLINE);
  const cumulativeCharsByLine = getCumulativeCharsByLine(source);
  const dfsNodes = [];
  let level = 0;
  for (const rawLine of parsedLines) {
    // Process node.
    const line = rawLine.trim();
    const node = parseNode(line, source, cumulativeCharsByLine);
    const isOpen = line.startsWith(OPEN_PAREN);
    const isClosed = line.endsWith(CLOSE_PAREN);
    const isLeaf = isOpen && isClosed;
    const isParent = isOpen && !isClosed;
    const levelsResolved = getNumberOfLevelsResolved(line);

    // Add node to array in depth-first search order.
    dfsNodes.push({ node, level, isParent, isLeaf });

    // Update level number.
    if (isParent) {
      level += 1;
    }
    level -= levelsResolved;
  }

  const rootLevel = accumulateTreeLevel(dfsNodes);
  const root = rootLevel[0];
  return root;
}

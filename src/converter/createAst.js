// export type AstNode = {
//   name: string;
//   source: string;
//   children: AstNode[];
// };

const NEWLINE = "\n";
const SPACE = " ";
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
      line: parseInt(start[0], 10),
      char: parseInt(start[1], 10),
    },
    end: {
      line: parseInt(end[0], 10),
      char: parseInt(end[1], 10),
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
    // Add one for the newline character.
    // The last line does not get counted because we only store
    // cumulative characters before each line.
    totalChars += line.length + 1;
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
  const { name, start, end } = element;
  return {
    name: name,
    range: { start, end },
    source: extractSource(element, source, cumulativeCharsByLine),
    children: [],
  };
}

function addWhitespaceNodes(siblings) {
  if (siblings.length === 0) {
    return [];
  }
  const allNodes = [siblings[0]];
  for (let i = 1; i < siblings.length; i++) {
    const previousNode = siblings[i - 1];
    const node = siblings[i];
    const lineDiff = node.range.start.line - previousNode.range.end.line;
    const sameLineCharDiff =
      node.range.start.char - previousNode.range.end.char;
    if (lineDiff === 0) {
      if (sameLineCharDiff > 0) {
        allNodes.push({
          name: "space",
          source: Array(sameLineCharDiff).fill(SPACE).join(EMPTY_CHAR),
          children: [],
        });
      }
    } else {
      allNodes.push({
        name: "newline",
        source: Array(lineDiff).fill(NEWLINE).join(EMPTY_CHAR),
        children: [],
      });
    }
    allNodes.push(node);
  }
  return allNodes;
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

function accumulateTreeLevel(dfsNodes) {
  if (dfsNodes.length === 0) {
    return [];
  }
  if (dfsNodes.length === 1) {
    return [dfsNodes[0].node];
  }

  const firstNode = dfsNodes[0];
  const currentLevel = firstNode.level;
  const levelNodes = [];
  let currentParent = null;
  let currentDescendants = [];
  for (let i = 0; i < dfsNodes.length; i++) {
    const node = dfsNodes[i];
    if (node.level === currentLevel) {
      if (currentParent != null) {
        currentParent.children = accumulateTreeLevel(currentDescendants);
        levelNodes.push(currentParent);
        currentDescendants = [];
      }
      currentParent = node.node;
    } else {
      currentDescendants.push(node);
    }
  }
  if (currentParent != null) {
    currentParent.children = accumulateTreeLevel(currentDescendants);
    levelNodes.push(currentParent);
    currentDescendants = [];
  }
  return addWhitespaceNodes(levelNodes);
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

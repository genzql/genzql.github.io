function renderDefault(node, rendererMap) {
  if (node.children.length > 0) {
    return node.children.map((c) => renderNode(c, rendererMap)).join("");
  }
  return node.source;
}

export function renderNode(node, rendererMap) {
  const render = rendererMap[node.name];
  if (!render) {
    return renderDefault(node, rendererMap);
  }
  return render(node);
}

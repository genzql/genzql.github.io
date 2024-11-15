export function renderNode(node, rendererMap) {
  if (node.children.length > 0) {
    return node.children.map((c) => renderNode(c, rendererMap)).join("");
  }

  const render = rendererMap[node.name];
  if (render) {
    return render(node);
  }

  return node.source;
}

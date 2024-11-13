export function renderRoot(root, rendererMap) {
  const render = rendererMap[root.name];
  if (!render) {
    throw new Error(`No renderer found for node: ${root.name}`);
  }
  return render(root);
}

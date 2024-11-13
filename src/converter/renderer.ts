export type AstNode = {
  name: string;
  source: string;
  children: AstNode[];
};

export type RenderFn = (node: AstNode) => string;

export type RendererMap = {
  [key: string]: RenderFn;
};

export function renderRoot(root: AstNode, rendererMap: RendererMap): string {
  const render = rendererMap[root.name];
  if (!render) {
    throw new Error(`No renderer found for node: ${root.name}`);
  }
  return render(root);
}

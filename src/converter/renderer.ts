import { AstNode } from "./createAst";

export type RenderFn = (node: AstNode) => string;

export type RendererMap = {
  [key: string]: RenderFn;
};

export function renderNode(node: AstNode, rendererMap: RendererMap): string {
  if (node.children.length > 0) {
    return node.children.map((c) => renderNode(c, rendererMap)).join("");
  }

  const render = rendererMap[node.name];
  if (render) {
    return render(node);
  }

  return node.source;
}

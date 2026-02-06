import { TextMatchTransformer, TRANSFORMERS } from '@lexical/markdown'
import { $createImageNode, $isImageNode, ImageNode } from './nodes/ImageNode'

export const IMAGE: TextMatchTransformer = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node)) {
      return null
    }
    return `![${node.getAltText()}](${node.getSrc()})`
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, altText, src] = match
    const imageNode = $createImageNode({ src, altText })
    textNode.replace(imageNode)
  },
  trigger: ')',
  type: 'text-match',
}

export const EDITOR_TRANSFORMERS = [...TRANSFORMERS, IMAGE]

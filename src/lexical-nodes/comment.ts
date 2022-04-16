import { TextNode, NodeKey, EditorConfig, LexicalNode, LexicalCommand, $getSelection, createCommand, $setSelection, $isElementNode, ElementNode, DOMConversionMap, DOMConversionOutput, RangeSelection } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { addClassNamesToElement } from '@lexical/utils'
import { useEffect } from 'react';

export interface Comment {
  userName: string,
  time: Date,
  content: string,
}

export interface CommentInstance {
  uuid: string
  comments?: Comment[]
}

class CommentNode extends ElementNode {
  __commentInstance: CommentInstance;

  static getType(): string {
    return 'link';
  }

  static clone(node: CommentNode): CommentNode {
    return new CommentNode(node.__commentInstance, node.__key);
  }

  constructor(commentInstance: CommentInstance, key?: NodeKey) {
    super(key);
    this.__commentInstance = commentInstance;
  }

  createDOM<EditorContext>(config: EditorConfig<EditorContext>): HTMLElement {
    const element = document.createElement('span');

    element.setAttribute('data-comment-instance', JSON.stringify(this.__commentInstance))

    addClassNamesToElement(element, config.theme.link);

    return element;
  }

  updateDOM<EditorContext>(prevNode: CommentNode, dom: HTMLElement, config: EditorConfig<EditorContext>): boolean {
    const commentSpan: HTMLSpanElement = dom;

    const [prevInstance, currentInstance]= [JSON.stringify(prevNode.__commentInstance), JSON.stringify(this.__commentInstance)]

    if (prevInstance !== currentInstance) commentSpan.setAttribute('data-comment-instance', currentInstance)

    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      a: (node: Node) => ({
        conversion: convertCommentSpan,
        priority: 1,
      }),
    };
  }

  getComment(): CommentInstance {
    const self = this.getLatest();
    return (self as CommentNode).__commentInstance
  }

  setComment(commentInstance: CommentInstance): void {
    const writable = this.getWritable();
    (writable as CommentNode).__commentInstance = commentInstance;
  }

  insertNewAfter(selection: RangeSelection): null | ElementNode {
    const element = this.getParentOrThrow().insertNewAfter(selection);

    if ($isElementNode(element)) {
      const commentNode = $createCommentNode(this.__commentInstance);

      (element as ElementNode)?.append(commentNode);

      return commentNode;
    }

    return null;
  }

  canInsertTextBefore(): false {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  canBeEmpty(): false {
    return false;
  }

  isInline(): true {
    return true;
  }
}

function convertCommentSpan(domNode: Node): DOMConversionOutput {
  let node = null;

  if (domNode instanceof HTMLSpanElement) {
    const commentInstance = domNode.getAttribute('data-comment-instance')

    if (commentInstance) {
      const jsonCommentInstance = JSON.parse(commentInstance as string)

      node = $createCommentNode(jsonCommentInstance);
    }
  }

  return {node};
}

export function $createCommentNode(commentInstance: CommentInstance): CommentNode {
  return new CommentNode(commentInstance);
}

export function $isCommentNode(node: LexicalNode): boolean {
  return node instanceof CommentNode;
}

export {
  CommentNode,
}

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@nextui-org/react'
import { v4 as uuidv4 } from 'uuid'
import { FiMessageCircle } from 'react-icons/fi'

import { $getRoot, $getSelection, $isRangeSelection, CommandListenerLowPriority, EditorState, SELECTION_CHANGE_COMMAND, RangeSelection, TextNode, ElementNode } from 'lexical';
import { $isAtNodeEnd } from "@lexical/selection"

import LexicalComposer from '@lexical/react/LexicalComposer';
import LexicalPlainTextPlugin from '@lexical/react/LexicalPlainTextPlugin';
import LexicalContentEditable from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import './styles/Lexical.scss'
import { CommentInstance, CommentNode, SET_COMMENT_COMMAND } from '../lexical-nodes';
import CommentPlugin, { $isCommentNode } from '../lexical-nodes/comment';
import { initialEditorState } from '../mocks'
import { useRecoilState, useSetRecoilState } from 'recoil';
import { activeCommentState, allCommentInstancesState } from '../store/commentStore';

const LowPriority: CommandListenerLowPriority = 1;

const theme = {
  // Theme styling goes here
  // ...
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    // console.log(root, selection, JSON.stringify(editorState));
    // console.log(JSON.stringify(editorState));
  });
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

interface EditorProps {
  className?: string
}

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}


const DummyCommentPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  const [isComment, setIsComment] = useState<boolean>(false)

  const setActiveCommentInstanceUuid = useSetRecoilState(activeCommentState)

  const setAllCommentInstances = useSetRecoilState(allCommentInstancesState)

  const setActiveStates = useCallback(() => {
    editor.update(() => {
      const state = editor.getEditorState()

      state.read(() => {
        const commentInstances: CommentInstance[] = []

        state._nodeMap.forEach((node, key, map) => {
          node.__type === CommentNode.getType()

          const commentInstance = (node as CommentNode).__commentInstance || {}

          if (commentInstance.uuid) commentInstances.push(commentInstance)
        })

        setAllCommentInstances(commentInstances)
      })

      const selection = $getSelection()

      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection as RangeSelection)

        const parent = node.getParent()

        let commentNode: CommentNode | undefined

        if ($isCommentNode(node)) commentNode = node as CommentNode
        else if (parent && $isCommentNode(parent)) commentNode = parent as CommentNode

        if (commentNode) {
          setIsComment(true)
          const activeCommentInstanceUuid = commentNode.__commentInstance.uuid
          setActiveCommentInstanceUuid(activeCommentInstanceUuid)
        } else {
          setIsComment(false)
          setActiveCommentInstanceUuid("")
        }
      }
    })
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, e) => {
        setActiveStates()
        return false
      },
      LowPriority
    )
  })

  const setDummyComment = () => {
    const dummyCommentInstance: CommentInstance = {
      uuid: uuidv4(),
      comments: [
        {
          content: "First Comment",
          time: Date.now(),
          userName: 'sereneinserenade'
        }
      ]
    }

    editor.dispatchCommand(SET_COMMENT_COMMAND, dummyCommentInstance)
  }

  return (
    <section className='toolbar flex items-center gap-1rem'>
      <Button auto color="gradient" rounded bordered={!isComment} onClick={setDummyComment}>
        <FiMessageCircle />
      </Button>

      {isComment ? "Inside CommentNode 💬" : "Not Inside CommentNode ❌"} 
    </section>
  )
}

function Editor({ className }: EditorProps) {
  const initialConfig = {
    theme,
    onError,
  };

  return (
    <section className={(className || "") + " lexical-container"}>
      <LexicalComposer initialConfig={{ ...initialConfig, nodes: [CommentNode] }}>

        <DummyCommentPlugin />

        <LexicalPlainTextPlugin
          contentEditable={<LexicalContentEditable spellcheck={false} />}
          placeholder={<div className='placeholder'>Enter some text...</div>}
          initialEditorState={initialEditorState}
        />

        <LexicalOnChangePlugin onChange={onChange} />

        <HistoryPlugin />

        <MyCustomAutoFocusPlugin />

        <CommentPlugin />

      </LexicalComposer>
    </section>
  );
}

export {
  Editor,
}

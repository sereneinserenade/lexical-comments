import { useCallback, useEffect, useState } from 'react';
import { Button, Container, FormElement, Text, Textarea } from '@nextui-org/react'
import { v4 as uuidv4 } from 'uuid'
import { FiMessageCircle } from 'react-icons/fi'

import { $getRoot, $getSelection, $isRangeSelection, CommandListenerLowPriority, EditorState, SELECTION_CHANGE_COMMAND, RangeSelection, TextNode, ElementNode, $setSelection } from 'lexical';
import { $isAtNodeEnd } from "@lexical/selection"

import LexicalComposer from '@lexical/react/LexicalComposer';
import LexicalPlainTextPlugin from '@lexical/react/LexicalPlainTextPlugin';
import LexicalContentEditable from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import './styles/Lexical.scss'
import { CommentInstance, CommentNode, SET_COMMENT_COMMAND } from '../lexical-nodes';
import CommentPlugin, { $isCommentNode, UPDATE_COMMENT_COMMAND } from '../lexical-nodes/comment';
import { initialEditorState } from '../mocks'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { activeCommentState, allCommentInstancesState, lastUpdatedCommentInstanceState } from '../store/commentStore';

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
    // const root = $getRoot();
    // const selection = $getSelection();

    // console.log(root, selection, JSON.stringify(editorState));
    console.log(JSON.stringify(editorState));
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


const CommentStatePlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  const [isComment, setIsComment] = useState<boolean>(false)

  const [activeCommentInstance, setActiveCommentInstance] = useRecoilState(activeCommentState)

  const setAllCommentInstances = useSetRecoilState(allCommentInstancesState)

  const [inputContent, setInputContent] = useState("")

  useEffect(() => {
    if (!activeCommentInstance) return

    const copyActiveCommentInstance: CommentInstance = JSON.parse(JSON.stringify(activeCommentInstance))

    const state = editor.getEditorState()

    state.read(() => {
      state._nodeMap.forEach((node) => {
        if ($isCommentNode(node) && (node as CommentNode).__commentInstance.uuid === activeCommentInstance.uuid) {
          const [prevCommentInstance, thisCommentInstance] = [JSON.stringify((node as CommentNode).__commentInstance), JSON.stringify(activeCommentInstance)]
          if (prevCommentInstance !== thisCommentInstance) editor.dispatchCommand(UPDATE_COMMENT_COMMAND, copyActiveCommentInstance)
        }
      })
    })
  }, [activeCommentInstance])

  const setActiveStates = useCallback(() => {
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
        const activeCommentInstance: CommentInstance = JSON.parse(JSON.stringify(commentNode.__commentInstance))
        setActiveCommentInstance(activeCommentInstance)
      } else {
        setIsComment(false)
        setActiveCommentInstance(undefined)
      }
    }
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

  return (
    <section className='toolbar flex items-center gap-1rem'>
      <Text color={isComment ? 'primary' : 'error'} b css={{ fontSize: '1.2rem' }}>
        {isComment ? "It's Inside CommentNode 💬 ✅" : "Not Inside CommentNode ❌"}
      </Text>
    </section>
  )
}

const AddCommentPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  const [inputContent, setInputContent] = useState("I love lexical!!!")

  const addComment = () => {
    if (!inputContent) return

    editor.update(() => {
      const sel = $getSelection()
      const textContent = sel?.getTextContent() || ""

      const dummyCommentInstance: CommentInstance = {
        uuid: uuidv4(),
        textContent,
        comments: [
          {
            content: inputContent,
            time: 'just now',
            userName: 'sereneinserenade'
          }
        ]
      }

      editor.dispatchCommand(SET_COMMENT_COMMAND, dummyCommentInstance)

      setInputContent("")
    })
  }

  const onKeyboardEvent = (event: React.KeyboardEvent<FormElement>) => event.code === 'Enter' && event.metaKey && addComment()

  return (
    <section className='toolbar'>
      <Textarea
        value={inputContent}
        onInput={e => setInputContent((e.target as HTMLTextAreaElement).value)}
        onKeyDown={(e) => onKeyboardEvent(e)}
        autoFocus={true}
        width='50ch'
        animated={true}
      />

      <Button color="secondary" auto onClick={addComment} css={{ marginTop: '2ch' }}> Add New Comment (⌘/Ctrl + ↵) </Button>
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

        <CommentStatePlugin />

        <LexicalPlainTextPlugin
          contentEditable={<LexicalContentEditable spellcheck={false} />}
          placeholder={<div className='placeholder'>Enter some text...</div>}
          initialEditorState={initialEditorState}
        />

        <LexicalOnChangePlugin onChange={onChange} />

        <HistoryPlugin />

        <MyCustomAutoFocusPlugin />

        <CommentPlugin />

        <AddCommentPlugin />

      </LexicalComposer>

      <section style={{ marginTop: '2rem' }} className="flex flex-col gap-1rem">
        <Text h3 css={{ textGradient: "45deg, $purple500 -20%, $pink500 100%" }} >
          If you like/love what I'm doing, consider 🌟ing the repository, I and the Open Source Community appreciate it ❤️.
        </Text>

        <div>
          <h3>
            Made possible thanks these techs.
          </h3>

          <code>
            {
              `"@lexical/react": "^0.2.1",
"@nextui-org/react": "^1.0.8-beta.5",
"lexical": "^0.2.1",
"react": "^18.0.0",
"react-dom": "^18.0.0",
"react-icons": "^4.3.1",
"recoil": "^0.7.2",
"sass": "^1.50.0",
"uuid": "^8.3.2"

"typescript": "^4.6.3",
"vite": "^2.9.2"`
            }
          </code>
        </div>
      </section>
    </section>
  );
}

export {
  Editor,
}

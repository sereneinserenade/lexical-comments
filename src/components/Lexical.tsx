import { useEffect } from 'react';
import { Button } from '@nextui-org/react'
import { v4 as uuidv4 } from 'uuid'

import { $getRoot, $getSelection, EditorState } from 'lexical';

import LexicalComposer from '@lexical/react/LexicalComposer';
import LexicalPlainTextPlugin from '@lexical/react/LexicalPlainTextPlugin';
import LexicalContentEditable from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import './styles/Lexical.scss'
import { CommentInstance, CommentNode, SET_COMMENT_COMMAND } from '../lexical-nodes';
import CommentPlugin from '../lexical-nodes/comment';
import { initialEditorState } from '../mocks'

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

const DummyCommentPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  const setDummyComment = () => {
    const dummyCommentInstance: CommentInstance = {
      uuid: uuidv4(),
      comments: [
        {
          content: "First Comment",
          time: new Date(),
          userName: 'sereneinserenade'
        }
      ]
    }

    editor.dispatchCommand(SET_COMMENT_COMMAND, dummyCommentInstance)
  }

  return (
    <section className='toolbar'>
      <Button bordered color="secondary" auto onClick={setDummyComment}>
        Add comment
      </Button>
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

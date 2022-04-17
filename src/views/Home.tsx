import React, { useEffect, useState } from 'react';
import { Button, FormElement, Link, Textarea } from '@nextui-org/react'
import { useRecoilState, useRecoilValue } from 'recoil';

import { Editor } from '../components'
import { activeCommentState, allCommentInstancesState, lastUpdatedCommentInstanceState } from '../store/commentStore';

import './styles/Home.scss'
import { Comment, CommentInstance } from '../lexical-nodes';

interface Props {

}

export const Home: React.FC<Props> = () => {
  const [allCommentInstances, setAllCommentInstances] = useRecoilState(allCommentInstancesState)

  const [activeCommentInstance, setActiveCommentInstance] = useRecoilState(activeCommentState)

  const [inputContent, setInputContent] = useState("")

  const addComment = () => {
    if (!inputContent) return

    const newComment: Comment = {
      content: inputContent,
      time: 'just now',
      userName: 'sereneinserenade',
    }

    const activeComment: CommentInstance = JSON.parse(JSON.stringify(activeCommentInstance))

    activeComment.comments.push(JSON.parse(JSON.stringify(newComment)))

    setActiveCommentInstance(activeComment)

    setInputContent("")
  }

  const onKeyboardEvent = (event: React.KeyboardEvent<FormElement>) => event.code === 'Enter' && event.metaKey && addComment()

  return (
    <section className='home container' aria-label='home'>
      <Editor className='editor' />
      <section className='comments' aria-label='comments-section'>
        {
          allCommentInstances.map((instance) => {
            return (
              instance && <article
                key={instance.uuid}
                className={`comment-instance flex flex-col gap-1rem ${instance.uuid === activeCommentInstance?.uuid && 'active'}`}
              >
                {instance.textContent && <h4>"{instance.textContent}"</h4>}

                {
                  instance.comments?.map((comment, i) => {
                    return (
                      <div key={`${instance.uuid}_${i}`}>
                        <Link target="_blank" href={`https://github.com/${comment.userName}`}>{comment.userName}</Link> 
                        <span className='font-s'> &nbsp;{comment.time}</span>

                        <div>
                          {comment.content}
                        </div>
                      </div>
                    )
                  })
                }

                {
                  instance.uuid === activeCommentInstance?.uuid && <section className='' aria-label='input-section'>
                    <Textarea
                      fullWidth
                      value={inputContent}
                      onInput={e => setInputContent((e.target as HTMLTextAreaElement).value)}
                      onKeyDown={(e) => onKeyboardEvent(e)}
                      css={{ 'mt': '1rem' }}
                    />

                    <Button color="secondary" auto onClick={addComment} css={{ marginTop: '2ch' }}> Add Comment (⌘/Ctrl + ↵) </Button>
                  </section>
                }
              </article>
            )
          })
        }
      </section>
    </section>
  )
}

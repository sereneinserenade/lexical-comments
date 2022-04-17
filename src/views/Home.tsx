import React, { useEffect, useState } from 'react';
import { Button, Textarea } from '@nextui-org/react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { format } from 'date-fns'


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
    const newComment: Comment = {
      content: inputContent,
      time: 'just now',
      userName: 'sereneinserenade',
    }

    const activeComment: CommentInstance = JSON.parse(JSON.stringify(activeCommentInstance)) 

    activeComment.comments = [...activeComment.comments, newComment]

    setActiveCommentInstance(activeComment)
  }

  return (
    <section className='home container' aria-label='home'>
      <Editor className='editor' />
      <section className='comments' aria-label='comments-section'>
        {
          allCommentInstances.map((instance) => {
            return (
              instance && <article
                key={instance.uuid}
                className={`comment-instance ${instance.uuid === activeCommentInstance?.uuid && 'active'}`}
              >
                {
                  instance.comments?.map((comment, i) => {
                    return (
                      <div key={`${instance.uuid}_${i}`}>
                        <span>
                          {/* <b>{comment.userName}</b> <span className='font-s'>{format(new Date(comment.time), 'PPpp')}</span> */}
                          <b>{comment.userName}</b> <span className='font-s'>{comment.time}</span>
                        </span>

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
                      css={{
                        'mt': '1rem'
                      }}
                    />

                    <Button auto css={{ 'mt': '1rem' }} onClick={addComment}> Add Comment </Button>
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

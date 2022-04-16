import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { Editor } from '../components'
import { activeCommentState, allCommentInstancesState } from '../store/commentStore';

import './styles/Home.scss'

interface Props {

}

export const Home: React.FC<Props> = () => {
  const allCommentInstances = useRecoilValue(allCommentInstancesState)

  const activeCommentInstanceUuid = useRecoilValue(activeCommentState)

  return (
    <section className='home container' aria-label='home'>
      <Editor className='editor' />
      <section className='comments' aria-label='comments-section'>
        {
          allCommentInstances.map((instance) => {
            return (
              instance && <article
                key={instance.uuid}
                className={`comment-instance ${instance.uuid === activeCommentInstanceUuid && 'active'}`}
              >
                {
                  instance.comments?.map((comment, i) => {
                    return (
                      <div key={`${instance.uuid}_${i}`}>
                        <span>
                          <b>{comment.userName}</b> {comment.time.toString()}
                        </span>

                        <div>
                          {comment.content}
                        </div>
                      </div>
                    )
                  })
                }
              </article>
            )
          })
        }
      </section>
    </section>
  )
}

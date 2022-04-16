import React from 'react';
import { Editor } from '../components'

import './styles/Home.scss'

interface Props {

}

export const Home: React.FC<Props> = () => {
  return (
    <section className='home container' aria-label='home'>
      <Editor className='editor' />
      <section className='comments'>
        Here will be comments
      </section>
    </section>
  )
}

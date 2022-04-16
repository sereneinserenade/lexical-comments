import { useState } from 'react'
import { NextUIProvider, createTheme, Tooltip } from '@nextui-org/react';
import { FiSun, FiMoon } from 'react-icons/fi'
import { RecoilRoot } from 'recoil'

import { Home } from './views'

import './App.css'

function App({ }) {
  const [isDark, setTheme] = useState<boolean>(false)

  const darkTheme = createTheme({ type: 'dark' })

  const lightTheme = createTheme({ type: 'light' })

  return (
    <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
      <RecoilRoot>
        <Home />

        <section
          onClick={() => setTheme(!isDark)}
          className='theme-switcher-section'
          aria-label='theme-switcher-section'
        >
          <Tooltip content={isDark ? 'Light Theme' : 'Dark Theme'} placement="left">
            {isDark ? <FiSun /> : <FiMoon />}
          </Tooltip>
        </section>
      </RecoilRoot>
    </NextUIProvider>
  )
}

export default App

import { useState } from 'react'
import { NextUIProvider, createTheme, Tooltip, Switch } from '@nextui-org/react';
import { FiSun, FiMoon } from 'react-icons/fi'
import { RecoilRoot } from 'recoil'

import { Home } from './views'

import './App.css'

function App({ }) {
  const [isDark, setIsDark] = useState<boolean>(false)

  const darkTheme = createTheme({ type: 'dark' })

  const lightTheme = createTheme({ type: 'light' })

  return (
    <NextUIProvider theme={isDark ? darkTheme : lightTheme}>
      <RecoilRoot>
        <Home />

        <section
          onClick={() => setIsDark(!isDark)}
          className='theme-switcher-section flex items-center gap-1rem'
          aria-label='theme-switcher-section'
        >
          <Switch checked={isDark} onChange={(e) => setIsDark(e.target.checked)} iconOff={<FiSun />} iconOn={<FiMoon />}></Switch>
        </section>
      </RecoilRoot>
    </NextUIProvider>
  )
}

export default App

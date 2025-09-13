import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store/store.js'
import router from './routes/index.jsx'
import './index.css'
import './styles/index.scss'
import { ThemeProvider } from './common/theme/ThemeContext'
import { AnimatePresence } from 'framer-motion'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AnimatePresence mode="wait">
            <RouterProvider
              router={router}
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            />
          </AnimatePresence>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App

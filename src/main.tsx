import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Home, Editor } from './routes'
import './index.css'

// use legacy render mode bec: https://github.com/chrisjpatty/flume/issues/173
// this is not supported in react 18 anymore
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="editor/:integrationId" element={<Editor />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
)

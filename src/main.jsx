import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router"
import App from './App.jsx'
import {Provider} from "react-redux"
import globalStore from "./store/globalStore.js"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={globalStore}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)

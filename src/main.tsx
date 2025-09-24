import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { Store } from './redux/store.ts'
import { CustomProvider } from 'rsuite'
import 'rsuite/DateRangePicker/styles/index.css';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store} >
      <CustomProvider theme='light' >
    <App />
      </CustomProvider>
    </Provider>
  </StrictMode>,
)

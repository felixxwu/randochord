import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Spinner } from './components/Spinner'

const App = React.lazy(() => import('./App'))

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Suspense fallback={<Spinner />}>
            <App />
        </Suspense>
    </React.StrictMode>
)

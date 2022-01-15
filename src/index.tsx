import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react'

import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'

import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react'

import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import App from 'containers/App'
import reportWebVitals from './reportWebVitals'
import store, { persistor } from './store'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/material-icons'
import '@fontsource/material-icons-outlined'

if (process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 0.1,
    })
}

const instance = createInstance({
    urlBase: 'https://matomo.ekata.io',
    siteId: Number(process.env.REACT_APP_MATOMO_SITE_ID),
    disabled: process.env.NODE_ENV !== 'production', // optional, false by default. Makes all tracking calls no-ops if set to true.
})

// NOTE: Matomo event idea: login, register success, reset password,
// forgot password, verify email, project generation, payout address creation,
// api key, signature secret generation

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <PersistGate loading={null} persistor={persistor}>
                    <MatomoProvider value={instance}>
                        <App />
                    </MatomoProvider>
                </PersistGate>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

serviceWorkerRegistration.unregister()

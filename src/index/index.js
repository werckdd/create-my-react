import React from 'react'
import ReactDOM from 'react-dom'
import createStore from './store/createStore'
import { AppContainer } from 'react-hot-loader'
import App from './components/App'
import './styles/main.scss'

// Store Initialization
// ------------------------------------
export const store = createStore(window.__INITIAL_STATE__)


if (__DEV__) {

    let render = Component => {
        ReactDOM.render(
            <AppContainer>
                <Component store={store} />
            </AppContainer>
            , document.getElementById('react-container'))
    }

    // Hot Module Replacement API
    if (module.hot) {
        module.hot.accept();
    }

    if (!__TEST__) render(App)

} else {

    let render = (Component) => {

        ReactDOM.render(
            <Component store={store} />,
            document.getElementById('react-container')
        )
    }

    if (!__TEST__) render(App)
}


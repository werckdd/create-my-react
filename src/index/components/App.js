import React from 'react'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import logo from '../../../public/logo.svg';
import './App.css';

class App extends React.Component {
   
    shouldComponentUpdate() {
        return false
    }

    render() {
        const { store } = this.props

        return (
            <Provider store={store}>
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h2>Welcome to React</h2>
                    </div>
                    <p className="App-intro">
                        To get started, edit <code>src/App.js</code> and save to reload.
                    </p>
                </div>
            </Provider>
        )
    }
}

App.propTypes = {
    store: PropTypes.object
}

export default App
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import Root from 'pages/Root'
import './index.css'
import store from 'modules/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

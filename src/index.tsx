import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './index.css';
import './style.css';
import { App } from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from 'Store';
import { TokenUrl, UserId, InstanceLocator } from 'config';
const {
  ChatkitProvider,
  TokenProvider,
} = require("@pusher/chatkit-client-react");

const tokenProvider = new TokenProvider({
  url: TokenUrl,
});

ReactDOM.render(
  <Provider store={store}>
    {UserId ? <ChatkitProvider
      instanceLocator={InstanceLocator}
      tokenProvider={tokenProvider}
      userId={UserId}
    >
      <App />
    </ChatkitProvider> : <App />}

  </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import 'animate.css/animate.min.css';
import 'normalize.css/normalize.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from 'Store';
import 'tachyons/css/tachyons.min.css';
import 'typeface-josefin-sans/index.css';
import 'typeface-open-sans/index.css';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';
import './style.css';
import './i18n';
import { Loading } from 'components/Loading';

const PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY as string;
const stripePromise = loadStripe(PUBLIC_KEY);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <React.Suspense fallback={<Loading />}>
            <App />
          </React.Suspense>
        </BrowserRouter>
      </Elements>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// serviceWorkerDev();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

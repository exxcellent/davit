import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { HashRouter as BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { Davit } from './app/Davit';
import { store } from './app/store';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { languages } from './translations/languages';

// import { BrowserRouter } from 'react-router-dom';
// TODO: if we rollout to english countries, this must be redefined (changing the locale "de" to "en" already works)
/* support variables for languages */
// const locale = navigator.language;
// DE
const locale = 'de';
// EN
// const locale = 'en';
const localeData = languages[locale];

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider locale={locale} messages={localeData}>
            {/* TODO: remove # from url */}
            <BrowserRouter>
                <Davit />
            </BrowserRouter>
        </IntlProvider>
    </Provider>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';

import 'antd/dist/antd.css';
import './assets/styles/index.scss';
// import './assets/styles/_ant-overrides.scss';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

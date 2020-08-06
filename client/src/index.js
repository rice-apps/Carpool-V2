import './index.css'

import React, { Component } from "react"
import {render} from 'react-dom'

// import { Router } from 'react-router';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import { Routes } from './components/Routes';
import App from './App';
import Profile from "./Pages/Profile/index"

// Setup history
import { createBrowserHistory } from 'history';

// Setup Toast for Notifications
import { ToastProvider } from 'react-toast-notifications'

// Import apollo client for graphql
import { client } from './apollo';
import { ApolloProvider } from '@apollo/client'

export const history = createBrowserHistory();

render(
    <ApolloProvider client={client}>
        <Router history={history}>
            <Switch>
                <Route exact path="/profile" component={Profile}>
                    
                </Route>
            </Switch>
            <ToastProvider>
                <App />
            </ToastProvider>
        </Router>
    </ApolloProvider>, 
    document.querySelector('#app')
);
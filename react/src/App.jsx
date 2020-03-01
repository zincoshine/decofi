import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import {ThemeProvider} from 'styled-components'
import {theme} from 'rimble-ui'

import routes from 'routes';

const App = () => (
    <div
        style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
    }}>
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    {routes.map(route => (
                        <Route
                            key={route.name}
                            path={route.path}
                            exact={route.exact}
                            component={route.component}
                        />
                    ))}
                </Switch>
            </Router>
        </ThemeProvider>
    </div>
);

export default App;

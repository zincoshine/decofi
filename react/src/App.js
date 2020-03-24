import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import ConnectionBanner from '@rimble/connection-banner';
import NetworkIndicator from '@rimble/network-indicator';
import { ThemeProvider, Box, Card } from "rimble-ui";

import routes from 'routes';
import RimbleWeb3 from 'utilities/RimbleWeb3';
import Header from 'components/Header';
import MainMenu from 'components/MainMenu';
import WalletBlock from 'components/WalletBlock';

const config = {
    accountBalanceMinimum: 0.0001,
    requiredNetwork: 42
};

const App = () => (
            <ThemeProvider>
                <RimbleWeb3 config={config}>
                    <RimbleWeb3.Consumer>
                        {({
                              needsPreflight,
                              validBrowser,
                              userAgent,
                              web3,
                              account,
                              accountBalance,
                              accountBalanceLow,
                              initAccount,
                              rejectAccountConnect,
                              userRejectedConnect,
                              accountValidated,
                              accountValidationPending,
                              rejectValidation,
                              userRejectedValidation,
                              validateAccount,
                              connectAndValidateAccount,
                              modals,
                              network,
                              transaction,
                              web3Fallback,
                              daiBalance,
                          }) => (
                            <Card>
                                <Header
                                    account={account}
                                    accountBalance={accountBalance}
                                    daiBalance={daiBalance}
                                    accountBalanceLow={accountBalanceLow}
                                    initAccount={initAccount}
                                    rejectAccountConnect={rejectAccountConnect}
                                    userRejectedConnect={userRejectedConnect}
                                    accountValidated={accountValidated}
                                    accountValidationPending={accountValidationPending}
                                    rejectValidation={rejectValidation}
                                    userRejectedValidation={userRejectedValidation}
                                    validateAccount={validateAccount}
                                    connectAndValidateAccount={connectAndValidateAccount}
                                    modals={modals}
                                    network={network}
                                />

                                <Router>
                                    <MainMenu />

                                    <Box maxWidth={'640px'} mx={'auto'} p={3} >
                                        <ConnectionBanner
                                            currentNetwork={network.current.id}
                                            requiredNetwork={config.requiredNetwork}
                                            onWeb3Fallback={web3Fallback}
                                        />
                                    </Box>

                                    <Card maxWidth={'640px'} mx={'auto'} p={3} px={4}>
                                        <NetworkIndicator
                                            currentNetwork={network.current.id}
                                            requiredNetwork={network.required.id}
                                        />
                                    </Card>

                                    <WalletBlock
                                        account={account}
                                        accountBalance={accountBalance}
                                        accountBalanceLow={accountBalanceLow}
                                        accountValidated={accountValidated}
                                        connectAndValidateAccount={connectAndValidateAccount}
                                        daiBalance={daiBalance}
                                    />

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

                            </Card>
                        )}
                    </RimbleWeb3.Consumer>
                </RimbleWeb3>
            </ThemeProvider>
);

export default App;

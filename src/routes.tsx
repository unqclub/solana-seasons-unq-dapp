import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { AppLayout } from './components/Layout';
import { AccountsProvider } from './contexts/accounts';
import { ConnectionProvider } from './contexts/connection';
import { MarketProvider } from './contexts/market';
import { WalletProvider } from './contexts/wallet';
import { ClubsView, FaucetView, HomeView } from './views';
import { CreateClubView } from './views/clubs/create-club';
import { ClubDetailsView } from './views/clubs/details';
import { ConfirmTradeView } from './views/confirm-trade';

export function Routes() {
  return (
    <>
      <HashRouter basename={"/"}>
        <ConnectionProvider>
          <WalletProvider>
            <AccountsProvider>
              <MarketProvider>
                <AppLayout>
                  <Switch>
                    <Route exact path="/" component={() => <HomeView />} />
                    <Route exact path="/faucet" children={<FaucetView />} />
                    <Route
                      exact
                      path="/clubs"
                      component={() => <ClubsView />}
                    />
                    <Route
                      exact
                      path="/clubs/create"
                      component={() => <CreateClubView />}
                    />
                    <Route
                      path="/clubs/:id"
                      children={({ match }) => (
                        <ClubDetailsView id={match?.params.id!} />
                      )}
                    />
                    <Route
                      path="/trade/:id"
                      children={({ match }) => (
                        <ConfirmTradeView
                          tradeAccountAddress={match?.params.id!}
                        />
                      )}
                    />
                  </Switch>
                </AppLayout>
              </MarketProvider>
            </AccountsProvider>
          </WalletProvider>
        </ConnectionProvider>
      </HashRouter>
    </>
  );
}

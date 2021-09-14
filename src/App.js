import React, { Suspense } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import routes from './routes';

const App = () => {
  return (
    <>
      <Suspense fallback={<h1>Loading</h1>}>
        <Switch>
          <Route path={routes.HERO.path} component={routes.HERO.component} />
          <Route to={routes.HOME.path} component={routes.HOME.component} />
        </Switch>
        <Redirect to={routes.HOME.path}></Redirect>
      </Suspense>
    </>
  );
};

export default App;

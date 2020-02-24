import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Form from "./screens/Form";

export default function routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact={true} component={Form} />
      </Switch>
    </BrowserRouter>
  );
}

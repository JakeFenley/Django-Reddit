import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Header from "./layouts/Header";
import Login from "./accounts/Login";
import Register from "./accounts/Register";
import Subreddit from "./Subreddit";
import CreatePost from "./CreatePost";

export default function Wrapper() {
  return (
    <div className="wrapper">
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/createpost" component={CreatePost} />
        <Route path="/r/:subreddit" component={Subreddit} />
      </Switch>
    </div>
  );
}
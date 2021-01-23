import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import Header from "./layouts/Header";
import Login from "./accounts/Login";
import Register from "./accounts/Register";
import Subreddit from "./Subreddit";
import CreatePost from "./posts/pages/CreatePost";
import Post from "./posts/pages/Post";
import CreateSubreddit from "./CreateSubreddit";

export default function Wrapper() {
  return (
    <div className="wrapper">
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/createpost" component={CreatePost} />
        <Route exact path="/createSubreddit" component={CreateSubreddit} />
        <Route path="/r/:subreddit/:post" component={Post} />
        <Route path="/r/:subreddit" component={Subreddit} />
      </Switch>
    </div>
  );
}

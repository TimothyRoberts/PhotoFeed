import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import axios from "axios";

import withAuth from "./withAuth";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

import Upload from "./withAuthComponents/Upload";
import EditImage from "./withAuthComponents/EditImage";
import PostsList from "./withAuthComponents/PostsList";

class App extends Component {
  constructor() {
    super();
    this.state = {loggedIn: false, user: {_id: ''}};
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }

  login(user) {
    this.setState({loggedIn: true, user: user});
  }

  // Removes cookie from logged in user
  logout(props) {
    axios
      .get("api/logout")
      .then(res => {
        this.setState({ loggedIn: false });
        props.history.push("/login");
      })
      .catch(err => console.log(err));
    return null;
  }

  render() {
    console.log(this.state);
    return (
      <div>

      <nav className="uk-navbar-container uk-navbar" >
          <div className="uk-navbar-left">
              <ul className="uk-navbar-nav">
                  <li className="uk-active"><Link to="/">Home</Link></li>
                  {this.state.loggedIn && <li><Link to={`/list/${this.state.user._id}`}>My Images</Link></li>}
                  <li><Link to={`/upload/${this.state.user._id}`}>Upload</Link></li>
                  {!this.state.loggedIn && <li><Link to="/login">Login</Link></li>}
                  {!this.state.loggedIn && <li><Link to="/register">Register</Link></li>}
                  {this.state.loggedIn && <li><Link to="/logout">Logout</Link></li>}
              </ul>
          </div>
      </nav>
        <ul>

        </ul>

        <Switch>
          // Components available to any user
          <Route path="/" exact component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/login" render={(props) => <Login {...props} handleLogin={this.login} />} />
          <Route path="/logout" render={this.logout} />

          // Components that require a log in to access
          <Route path="/list/:id" component={withAuth(PostsList)} />
          <Route path="/edit/:id" component={withAuth(EditImage)} />
          <Route path="/upload/:id" component={withAuth(Upload)} />
        </Switch>
      </div>
    );
  }
}

export default App;

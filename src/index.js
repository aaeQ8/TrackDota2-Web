import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LiveMatchesList from "./live.js";
import PlayersList from "./players.js";
import { Matches } from "./matches.js";

class TopNavBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      navCollapsed: true,
    };
  }

  _onToggleNav = () => {
    this.setState({ navCollapsed: !this.state.navCollapsed });
  };

  render() {
    return (
      <Router forceRefresh={true}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <h1 className="navbar-brand">trackdota2</h1>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            onClick={this._onToggleNav}
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={
              (this.state.navCollapsed ? "collapse" : "") + " navbar-collapse"
            }
            id="navbarNavAltMarkup"
          >
            <div className="navbar-nav">
              <Link className="nav-item nav-link active" to="/live">
                Live games
              </Link>
              <Link className="nav-item nav-link active" to="/recent">
                Recent Matches
              </Link>
              <Link className="nav-item nav-link active" to="/players">
                Players
              </Link>
              <Link className="nav-item nav-link active" to="/linked">
                Linked matches
              </Link>
            </div>
          </div>
        </nav>
        <Switch>
          <Route exact path="/recent">
            <Matches matches_to_fetch="recent" header="Recent" />
          </Route>
          <Route path="/linked">
            <Matches matches_to_fetch="linked" header="Linked matches" />
          </Route>
          <Route path="/players">
            <PlayersList />
          </Route>
          <Route path="/live">
            <LiveMatchesList />
          </Route>
          <Route path="/"></Route>
          <LiveMatchesList />
        </Switch>
      </Router>
    );
  }
}

class MainApp extends React.Component {
  render() {
    return (
      <div className="bg-dark container-fluid">
        <TopNavBar />
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <MainApp />
  </Router>,
  document.getElementById("root")
);

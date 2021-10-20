import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LiveMatchesList from "./live.js";
import PlayersList from "./players.js";
import { Matches, RecentMatches } from "./matches.js";

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
          <Link className="navbar-brand" to="/">
            <span style={{'color': '  #ffd700'}}>TrackDota2</span>
          </Link>
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
                Live
              </Link>
              <Link className="nav-item nav-link active" to="/recent">
                Recent
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
            <RecentMatches />
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
          <Route path="/">
            <MainView />
          </Route>
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
        <hr />
      </div>
    );
  }
}

class MainView extends React.Component {
  render() {
    return (
      <div className="container">
        <hr />
        <p className="container" style={{ color: "white" }}>
          <span style={{ color: "orange" }}>Live</span> - This fetches
          Live matches from opendota and very recently completed games but some
          games are misclassifed as live due to a bug
        </p>
        <p className="container" style={{ color: "white" }}>
          <span style={{ color: "orange" }}>Recent</span> - This fetches
          recently completed and processed matches
        </p>
        <p className="container" style={{ color: "white" }}>
          <span style={{ color: "orange" }}>Players</span> - This is
          a list of players being tracked (pro players in general)
        </p>
        <p className="container" style={{ color: "white" }}>
          <span style={{ color: "orange" }}>Linked matches</span> - This is
          a list of matches that were found on youtube
        </p>
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

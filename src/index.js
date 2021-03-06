import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LiveMatchesList from "./live.js";
import PlayersList from "./players.js";
import { RecentMatches, LinkedMatches } from "./matches.js";

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
            <span style={{ color: "  #ffd700" }}>TrackDota2</span>
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
              <Link className="nav-item nav-link active" to="/about">
                About
              </Link>
            </div>
          </div>
        </nav>
        <Switch>
          <Route exact path="/recent">
            <RecentMatches />
          </Route>
          <Route path="/linked">
            <LinkedMatches />
          </Route>
          <Route path="/players">
            <PlayersList />
          </Route>
          <Route path="/live">
            <LiveMatchesList />
          </Route>
          <Route path="/about">
            <AboutPage />
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

class AboutPage extends React.Component {
  render() {
    return (
      <div className="container">
        <hr />
        <p className="container" style={{ color: "white" }}>
          This project/web app was mainly created for fun. <br />
          The source code is hosted on my{" "}
          <a
            className="orange-link"
            rel="noreferrer"
            target="_blank"
            href="https://github.com/aaeQ8"
          >
            Github
          </a>{" "}
          under MIT license.
          <br />
          If you have any suggestions or want to request any feature then simply
          make a request on Github or contact me:
          <br />
          email: aaeQ8i@gmail.com
          <br />
          reddit:{" "}
          <a
            className="orange-link"
            rel="noreferrer"
            target="_blank"
            href="https://reddit.com/u/aaeQ8"
          >
            {" "}
            u/aaeQ8{" "}
          </a>
        </p>
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
          <span style={{ color: "orange" }}>Live</span> - This fetches Live
          matches from opendota and very recently completed games but some games
          are misclassifed as live due to a bug
        </p>
        <p className="container" style={{ color: "white" }}>
          <span style={{ color: "orange" }}>Recent</span> - This fetches
          recently completed and processed matches
        </p>
        <p className="container" style={{ color: "white" }}>
          <span style={{ color: "orange" }}>Players</span> - This is a list of
          players being tracked (pro players in general)
        </p>
        <p className="container" style={{ color: "white" }}>
          <span style={{ color: "orange" }}>Linked matches</span> - This is a
          list of matches that were found on youtube
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

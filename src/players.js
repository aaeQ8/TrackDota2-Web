import React from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Matches } from "./matches.js";

export default class PlayersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { players_list: null };
  }

  componentDidMount() {
    this.fetchPlayersList();
  }

  fetchPlayersList() {
    fetch("https://d2zromn1qdgyf0.cloudfront.net/players_list.json")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ players_list: data });
      });
  }

  getRoutes() {
    if (this.state.players_list !== null) {
      var rows = [];
      for (var i = 0; i < this.state.players_list.length; i++) {
        rows.push(
          <Route
            key={this.state.players_list[i]["player_id"]}
            path={"/players/" + this.state.players_list[i]["player_id"]}
          >
            <Matches
              header={this.state.players_list[i]["player_name"]}
              matches_to_fetch="player"
              player_name={this.state.players_list[i]["player_name"]}
              player_id={this.state.players_list[i]["player_id"]}
            />
          </Route>
        );
      }
      return rows;
    }
  }

  renderPlayerNames() {
    if (this.state.players_list !== null) {
      var rows = [];
      for (var i = 0; i < this.state.players_list.length; i++) {
        rows.push(
          <PlayerItem
            key={this.state.players_list[i]["player_id"]}
            sig_heroes={this.state.players_list[i]["sig_heroes"]}
            player_name={this.state.players_list[i]["player_name"]}
            twitch={this.state.players_list[i]["twitch_link"]}
            player_id={this.state.players_list[i]["player_id"]}
          />
        );
      }
      return rows;
    }
  }

  render() {
    return (
      <Router forceRefresh={true}>
        <Switch>
          {this.getRoutes()}
          <Route>
            <div className="container">
              <table className="table table-striped table-dark">
                <thead>
                  <tr>
                    <td> player_name </td>
                    <td> signature heroes </td>
                    <td> twitch link </td>
                  </tr>
                </thead>
                <tbody className="">{this.renderPlayerNames()}</tbody>
              </table>
            </div>
          </Route>
        </Switch>
      </Router>
    );
  }
}

class PlayerItem extends React.Component {
  renderSigHeroes() {
    if (this.props.sig_heroes !== null) {
      var cols = [];
      for (var i = 0; i < this.props.sig_heroes.length; i++) {
        cols.push(
          <img
            alt="hero"
            key={this.props.sig_heroes[i]}
            src={
              "https://d2zromn1qdgyf0.cloudfront.net/heroes_mini_icons/" +
              this.props.sig_heroes[i] +
              ".png"
            }
          />
        );
      }
      return cols;
    }
  }

  render() {
    return (
      <tr>
        <td>
          {" "}
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to={"/players/" + this.props.player_id}
          >
            <span className="player-name"> {this.props.player_name} </span>{" "}
          </Link>
        </td>
        <td> {this.renderSigHeroes()} </td>
        <td>
          {" "}
          <span> {this.props.twitch}</span>{" "}
        </td>
      </tr>
    );
  }
}

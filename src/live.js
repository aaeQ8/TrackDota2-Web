import React from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { FilterBarLive } from "./filters.js";

export default class LiveMatchesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: null, items_org: null };
  }

  componentDidMount() {
    this.fetchLiveMatches();
  }

  fetchLiveMatches() {
    fetch("https://api.opendota.com/api/live")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ items: [...data] });
        this.setState({ items_org: [...data] });
      });
  }

  updateLiveMatches() {
    fetch("https://api.opendota.com/api/live")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ items: [...data] });
        this.setState({ items_org: [...data] });
      });
  }

  renderMatchItems() {
    if (this.state.items !== null) {
      var rows = [];
      for (var i = 0; i < this.state.items.length; i++) {
        rows.push(
          <LiveMatchRow
            match_data={this.state.items[i]}
            key={this.state.items[i]["match_id"]}
          />
        );
      }
      return rows;
    }
  }

  render() {
    return (
      <div className="bg-dark container-fluid">
        <div className="container">
          <h1 style={{ color: "orange" }}> Live</h1>
          <hr />
          <FilterBarLive
            items_org={this.state.items_org}
            updateItems={(new_items) => this.setState({'items': new_items})}
            updateLiveMatches={this.updateLiveMatches.bind(this)}
          />
          <hr />
          {this.renderMatchItems()}
        </div>
      </div>
    );
  }
}

class LiveMatchRow extends React.Component {
  renderHeroIcons(start_index, team) {
    if (this.props.match_data != null) {
      var cols = [];
      for (var i = start_index; i < start_index + 5; i++) {
        if (i >= this.props.match_data["players"].length) {
          return cols;
        }
        cols.push(
          <LiveHeroPreviewIcon
            key={this.props.match_data["players"][i]["account_id"]}
            player={this.props.match_data["players"][i]}
            team={team}
          />
        );
      }
      return cols;
    }
  }
  fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
  }
  render() {
    var result = this.fmtMSS(this.props.match_data["game_time"]);
    return (
      <div className="live-portrait row">
        {this.renderHeroIcons(0, "RAD")}
        <div className="text-center col-sm-2">
          <h5 className="score-preview">
            {this.props.match_data["radiant_score"]} -{" "}
            {this.props.match_data["dire_score"]}
          </h5>
          <h5 className="duration-preview">{result}</h5>
          <h5 className="duration-preview">
            {time_ago(parseInt(this.props.match_data["activate_time"] * 1000))}
          </h5>
          <h6 className="score-preview">{this.props.match_data["match_id"]}</h6>
        </div>
        {this.renderHeroIcons(5, "DIRE")}
        <div className="row-sm-2 p-0 m-0">
          <LivePlayerNamesView
            complete={this.props.match_data["deactivate_time"]}
            mmr={this.props.match_data["average_mmr"]}
            spectators={this.props.match_data["spectators"]}
            players={this.props.match_data["players"]}
          />
        </div>
      </div>
    );
  }
}

class LiveHeroPreviewIcon extends React.Component {
  render() {
    var img_src;
    if (this.props.player["hero_id"] !== 0) {
      img_src =
        "https://d2zromn1qdgyf0.cloudfront.net/heroes_icons/" +
        this.props.player["hero_id"] +
        ".png";
    } else {
      img_src = process.env.PUBLIC_URL + "/question-mark.png";
    }

    return (
      <figure
        style={{ color: "white" }}
        className="d-none d-lg-block text-center col-sm-1"
      >
        <img alt="" className="img-fluid" src={img_src} />
      </figure>
    );
  }
}

class LivePlayerNamesView extends React.Component {
  renderNames() {
    if (this.props.players != null) {
      var names = [];
      for (var i = 0; i < this.props.players.length; i++) {
        if ("is_pro" in this.props.players[i]) {
          names.push(
            <span key={this.props.players[i]["account_id"]}>
              <img
                alt=" "
                src={
                  "https://d2zromn1qdgyf0.cloudfront.net/heroes_mini_icons/" +
                  this.props.players[i]["hero_id"] +
                  ".png"
                }
              />
              <Link
                style={{ textDecoration: "none" }}
                className="player-name-link"
                to={"/players/" + this.props.players[i]["account_id"]}
              >
                <span className="player-name">
                  {this.props.players[i]["name"]}
                </span>
              </Link>
            </span>
          );
        }
      }
      if (names.length === 0) return <span> No pro players found </span>;
      return names;
    }
  }

  render() {
    var status;
    var color;
    if (this.props.complete === 0) {
      status = "Live";
      color = "#7aeb7a";
    } else {
      status = "Complete";
      color = "#ffb733";
    }

    return (
      <p
        style={{ color: "white", backgroundColor: "#515151" }}
        className="row-sm-2"
      >
        {this.renderNames()}
        <span className="mmr-spec">
          {" "}
          <span style={{ color: color }}> {status} </span> / {this.props.mmr}{" "}
          MMR / {this.props.spectators} Spectators{" "}
        </span>
      </p>
    );
  }
}

function time_ago(time) {
  switch (typeof time) {
    case "number":
      break;
    case "string":
      time = +new Date(time);
      break;
    case "object":
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, "seconds", 1], // 60
    [120, "1 minute ago", "1 minute from now"], // 60*2
    [3600, "minutes", 60], // 60*60, 60
    [7200, "1 hour ago", "1 hour from now"], // 60*60*2
    [86400, "hours", 3600], // 60*60*24, 60*60
    [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
    [604800, "days", 86400], // 60*60*24*7, 60*60*24
    [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
    [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
    [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
    [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
    [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = "ago",
    list_choice = 1;

  if (seconds === 0) {
    return "Just now";
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = "from now";
    list_choice = 2;
  }
  var i = 0,
    format;
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == "string") return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
    }
  return time;
}

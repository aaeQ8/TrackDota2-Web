import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { FilterBar } from "./filters.js";
import { LoadingMatches, NoMoreGames } from "./status.js";
import "./index.css";

export class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      zero_games_found: null,
      items: null,
      items_org: null,
      last_key: null,
      fetch_more: true,
      max_items: 500,
    };
  }

  componentDidMount() {
    if (this.props.matches_to_fetch === "recent") {
      this.fetchRecentMatches();
      this.fetchMoreMatches = this.fetchRecentMatches.bind(this);
    } else if (this.props.matches_to_fetch === "player") {
      this.fetchRecentPlayerMatches();
      this.fetchMoreMatches = this.fetchMoreRecentPlayerMatches.bind(this);
    } else if (this.props.matches_to_fetch === "linked") {
      this.fetchLinkedMatches();
      this.fetchMoreMatches = this.fetchMoreLinkedMatches.bind(this);
    }
  }

  fetchLinkedMatches() {
    fetch(
      "https://lb6ojeony6.execute-api.ca-central-1.amazonaws.com/prod/linked"
    )
      .then((response) => response.json())
      .then((data) => {
        if ("body" in data) {
          this.setState({ items: [...data["body"]["Responses"]["matches"]] });
          this.setState({
            items_org: [...data["body"]["Responses"]["matches"]],
          });
        } else this.setState({ zero_games_found: true });
        if ("last_key" in data) this.setState({ last_key: data["last_key"] });
        else {
          this.setState({ fetch_more: false });
        }
      });
  }

  fetchMoreLinkedMatches() {
    if (this.state.last_key !== null && this.state.fetch_more === true) {
      var last_key = "?last_key=" + this.state.last_key;
      fetch(
        "https://lb6ojeony6.execute-api.ca-central-1.amazonaws.com/prod/linked" +
          last_key
      )
        .then((response) => response.json())
        .then((data) => {
          if (this.state.items !== null) {
            this.setState({
              items: this.state.items.concat(
                data["body"]["Responses"]["matches"]
              ),
            });
            this.setState({
              items_org: this.state.items_org.concat(
                data["body"]["Responses"]["matches"]
              ),
            });
            if (this.state.items_org.length >= this.state.max_items)
              this.setState({ fetch_more: false });
          } else {
            this.setState({ items: [...data["body"]["Responses"]["matches"]] });
            this.setState({
              items_org: [...data["body"]["Responses"]["matches"]],
            });
          }
          if ("last_key" in data) this.setState({ last_key: data["last_key"] });
          else {
            this.setState({ last_key: null });
            this.setState({ fetch_more: false });
          }
        });
    }
  }

  fetchRecentPlayerMatches() {
    fetch(
      "https://lb6ojeony6.execute-api.ca-central-1.amazonaws.com/prod/player?player_id=" +
        this.props.player_id
    )
      .then((response) => response.json())
      .then((data) => {
        if ("body" in data) {
          this.setState({ items: data["body"]["Responses"]["matches"] });
          this.setState({ items_org: data["body"]["Responses"]["matches"] });
        } else this.setState({ zero_games_found: true });
        if ("last_key" in data) this.setState({ last_key: data["last_key"] });
        else {
          this.setState({ fetch_more: false });
        }
      });
  }

  fetchMoreRecentPlayerMatches() {
    if (this.state.last_key !== null && this.state.fetch_more === true) {
      var last_key = "&last_key=" + this.state.last_key;
      fetch(
        "https://lb6ojeony6.execute-api.ca-central-1.amazonaws.com/prod/player?player_id=" +
          this.props.player_id +
          last_key
      )
        .then((response) => response.json())
        .then((data) => {
          if (this.state.items !== null) {
            this.setState({
              items: this.state.items.concat(
                data["body"]["Responses"]["matches"]
              ),
            });
            this.setState({
              items_org: this.state.items_org.concat(
                data["body"]["Responses"]["matches"]
              ),
            });
            if (this.state.items.length >= 500)
              this.setState({ fetch_more: false });
          } else {
            this.setState({ items: data["body"]["Responses"]["matches"] });
            this.setState({ items_org: data["body"]["Responses"]["matches"] });
          }
          if ("last_key" in data) this.setState({ last_key: data["last_key"] });
          else {
            this.setState({ last_key: null });
            this.setState({ fetch_more: false });
          }
        });
    }
  }

  fetchRecentMatches() {
    var last_key;
    var date;
    if (this.state.last_key === null && this.state.date === null) {
      last_key = "?=" + new Date().toISOString().split("T")[0];
    } else if (this.state.last_key !== null) {
      last_key = "?last_key=" + this.state.last_key;
    } else {
      last_key = "?date=" + this.state.date;
    }
    fetch(
      "https://lb6ojeony6.execute-api.ca-central-1.amazonaws.com/prod/recent_matches" +
        last_key
    )
      .then((response) => response.json())
      .then((data) => {
        if (this.state.items !== null) {
          this.setState({
            items: this.state.items.concat(data["body"]["Items"]),
          });
          this.setState({
            items_org: this.state.items_org.concat(data["body"]["Items"]),
          });

          if (this.state.items.length >= this.state.max_items)
            this.setState({ fetch_more: false });
        } else {
          this.setState({ items: data["body"]["Items"] });
          this.setState({ items_org: data["body"]["Items"] });
        }
        if ("LastEvaluatedKey" in data["body"])
          this.setState({
            last_key: data["body"]["LastEvaluatedKey"]["activate_time_id"],
          });
        else {
          this.setState({ last_key: null });
          if (this.state.date === null) date = new Date();
          else date = new Date(this.state.date);
          date.setDate(date.getDate() - 1);
          this.setState({ date: date.toISOString().split("T")[0] });
        }
      });
  }

  renderMatchItems() {
    if (this.state.items != null) {
      var rows = [];
      for (var i = 0; i < this.state.items.length; i++) {
        if (this.state.items[i]["players"].length === 10)
          rows.push(
            <MatchPreviewRow
              match_json={this.state.items[i]}
              key={this.state.items[i]["matchid"]}
            />
          );
      }
      return rows;
    }
  }

  render() {
    var len;
    if (this.state.items === null) len = 0;
    else len = this.state.items.length;
    if (this.props.header !== null)
      return (
        <div className="bg-dark container-fluid">
          <div className="container">
            <h1 style={{ color: "orange" }}> {this.props.header} </h1>
            <hr />
            <FilterBar
              items_org={this.state.items_org}
              updateItems={(new_items, fetch_more) => {
                this.setState({ fetch_more: fetch_more });
                this.setState({ items: new_items });
              }}
            />
            <hr />
            <InfiniteScroll
              className="container"
              dataLength={len}
              endMessage={<NoMoreGames />}
              next={this.fetchMoreMatches}
              hasMore={this.state.fetch_more}
              loader={
                <div className="fill" style={{ textAlign: "center" }}>
                  <LoadingMatches />
                </div>
              }
            >
              {this.renderMatchItems()}
            </InfiniteScroll>
          </div>
        </div>
      );
  }
}

export class MatchPreviewRow extends React.Component {
  renderHeroIcons(start_index, team) {
    if (this.props.match_json != null) {
      var cols = [];
      for (var i = start_index; i < start_index + 5; i++) {
        cols.push(
          <HeroPreviewIcon
            key={
              this.props.match_json["players"][i]["player_details"]["hero_id"]
            }
            player={this.props.match_json["players"][i]}
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
    var winnerColor;
    if (this.props.match_json["winner"] === "radiant")
      winnerColor = "lightgreen";
    else winnerColor = "#FF7F7F";
    var result = this.fmtMSS(this.props.match_json["duration"]);
    var m;
    if ("yt_links" in this.props.match_json)
      m = this.props.match_json["yt_links"];
    else m = [];
    return (
      <div className="live-portrait row">
        {this.renderHeroIcons(0, "RAD")}
        <div className="text-center col-sm-2">
          <h5 className="score-preview">
            {this.props.match_json["rad_score"]} -{" "}
            {this.props.match_json["dire_score"]}
          </h5>
          <h5 className="duration-preview">{result}</h5>
          <h6 className="duration-preview">
            {" "}
            {this.props.match_json["average_mmr"]} MMR
          </h6>
          <h6 className="duration-preview">
            {time_ago(
              new Date(parseInt(this.props.match_json["activate_time"] * 1000))
            )}
          </h6>
          <h5 style={{ color: winnerColor, display: "inline" }}>
            {" "}
            {this.props.match_json["winner"].toUpperCase()} Win{" "}
          </h5>
        </div>
        {this.renderHeroIcons(5, "DIRE")}
        <div className="row-sm-2 p-0 m-0">
          <PlayerNamesView
            links={m}
            players={this.props.match_json["players"]}
          />
        </div>
      </div>
    );
  }
}

class HeroPreviewIcon extends React.Component {
  render() {
    return (
      <figure
        style={{ color: "white" }}
        className="d-none d-lg-block text-center col-sm-1"
      >
        <img
          alt=""
          className="img-fluid"
          src={
            "https://d2zromn1qdgyf0.cloudfront.net/heroes_icons/" +
            this.props.player["player_details"]["hero_id"] +
            ".png"
          }
        />
        <figcaption className="KDA">
          <span style={{ color: "#90ee90" }}>
            {this.props.player["stats"]["kills"]}
          </span>
          /
          <span style={{ color: "#FF7F7F" }}>
            {this.props.player["stats"]["deaths"]}
          </span>
          /
          <span style={{ color: "#ADD8E6" }}>
            {this.props.player["stats"]["assists"]}
          </span>
        </figcaption>
        <ItemsPreviewList items={this.props.player["items"]} />
      </figure>
    );
  }
}

class ItemsPreviewList extends React.Component {
  renderItemIcons() {
    if (this.props.items != null) {
      var cols = [];
      for (var i = 0; i < this.props.items.length; i++) {
        if (this.props.items[i] !== 0)
          cols.push(
            <img
              alt=""
              key={i}
              style={{maxHeight: " 28px",
                maxWidth: "28px"}}
              className="d-none d-xl-block img-fluid p-0 m-0"
              src={
                "https://d2zromn1qdgyf0.cloudfront.net/items_icons/" +
                this.props.items[i] +
                ".png"
              }
            />
          );
      }
      return cols;
    }
  }

  render() {
    return <div className="row p-0 m-0">{this.renderItemIcons()}</div>;
  }
}

class PlayerNamesView extends React.Component {
  renderYtLinks() {
    var youtube_link = "https://www.youtube.com/watch?v=";
    if (this.props.links !== null) {
      var yt_links = [];
      for (var i = 0; i < this.props.links.length; i++) {
        yt_links.push(
          <a
            className="mmr-spec"
            key={this.props.links[i]}
            href={youtube_link + this.props.links[i]}
          >
            <img
              alt="yt"
              style={{
                maxHeight: " 32px",
                maxWidth: "32px",
                background: "transparent",
              }}
              src={process.env.PUBLIC_URL + "/yt_icon.png"}
            />
          </a>
        );
      }
      return yt_links;
    }
  }

  renderNames() {
    if (this.props.players !== null) {
      var names = [];
      for (var i = 0; i < this.props.players.length; i++) {
        if (this.props.players[i]["player_details"]["is_pro"] === "1") {
          names.push(
            <span key={this.props.players[i]["player_details"]["hero_id"]}>
              <img
                alt="hero"
                src={
                  "https://d2zromn1qdgyf0.cloudfront.net/heroes_mini_icons/" +
                  this.props.players[i]["player_details"]["hero_id"] +
                  ".png"
                }
              />
              <Link
                style={{ textDecoration: "none" }}
                className="player-name-link"
                to={
                  "/players/" +
                  this.props.players[i]["player_details"]["player_id"]
                }
              >
                <span
                  className="player-name"
                  key={this.props.players[i]["player_details"]["player_id"]}
                >
                  {this.props.players[i]["player_details"]["player_name"]}
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
    return (
      <p style={{ backgroundColor: "#515151" }} className="row-sm-2">
        {this.renderNames()}
        {this.renderYtLinks()}
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

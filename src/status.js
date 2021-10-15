import React from "react";

export class NoMoreGames extends React.Component {
  render() {
    return (
      <div className="bg-dark container-fluid">
        <h1 style={{ color: "white" }}> No more games to display </h1>
      </div>
    );
  }
}

export class LoadingMatches extends React.Component {
  render() {
    return (
      <div>
        <h4 style={{ color: "white" }}> fetching matches</h4>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"> </span>
        </div>
      </div>
    );
  }
}

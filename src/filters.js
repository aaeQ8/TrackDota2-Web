import React from "react";

export class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search_words: "" };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSelect(event) {
    console.log(this.props.sortItems);
    this.props.sortItems(event.target.value);
    this.props.updateSortval(event.target.value);
  }

  handleChange(event) {
    this.setState({ search_words: event.target.value });
    if (event.target.value === "") {
      this.props.searchItems(event.target.value);
      this.props.updateSearch(event.target.value);
    }
  }
  handleSubmit(event) {
    this.props.searchItems(this.state.search_words);
    this.props.updateSearch(this.state.search_words);
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <input
            type="text"
            placeholder="Search for a player"
            onChange={this.handleChange}
            className="form-control bg-secondary"
          />
        </div>
        <div className="col-auto">
          <button onClick={this.handleSubmit} className="btn btn-secondary">
            {" "}
            Search{" "}
          </button>
        </div>
        <div className="col-auto">
          <select
            value={this.props.sort_val}
            onChange={this.handleSelect}
            style={{ color: "white" }}
            className="form-select bg-secondary"
            aria-label="Default select example"
          >
            <option value="activate_time_id">Date</option>
            <option value="average_mmr">MMR</option>
          </select>
        </div>
      </div>
    );
  }
}

export class FilterBarLive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search_words: "",
      show_val: "all",
      sort_val: "activate_time",
    };
    this.handleSortSelect = this.handleSortSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowSelect = this.handleShowSelect.bind(this);
  }

  handleSortSelect(event) {
    this.setState({ sort_val: event.target.value });
    this.props.update(
      this.state.search_words,
      this.state.show_val,
      event.target.value
    );
  }

  handleShowSelect(event) {
    this.setState({ show_val: event.target.value });
    this.props.update(
      this.state.search_words,
      event.target.value,
      this.state.sort_val
    );
  }

  handleChange(event) {
    this.setState({ search_words: event.target.value });
    if (event.target.value === "") {
      this.props.update(
        event.target.value,
        this.state.show_val,
        this.state.sort_val
      );
    }
  }
  handleSubmit(event) {
    this.props.update(
      this.state.search_words,
      this.state.show_val,
      this.state.sort_val
    );
  }
  handleUpdate(event) {
    this.props.updateMatches(
      this.state.search_words,
      this.state.show_val,
      this.state.sort_val
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <input
            type="text"
            value={this.state.search_words}
            placeholder="Search for a player"
            onChange={this.handleChange}
            className="form-control bg-secondary"
          />
        </div>
        <div className="col-auto">
          <button onClick={this.handleSubmit} className="btn btn-secondary">
            {" "}
            Search{" "}
          </button>
        </div>
        <div className="col-auto">
          <button
            onClick={this.handleUpdate.bind(this)}
            className="btn btn-secondary"
          >
            {" "}
            Update{" "}
          </button>
        </div>
        <div className="col-auto">
          <select
            value={this.state.show_val}
            onChange={this.handleShowSelect}
            style={{ color: "white" }}
            className="form-select bg-secondary"
            aria-label="Default select example"
          >
            <option value="all">All</option>
            <option value="live">Live only</option>
            <option value="complete">Complete only</option>
          </select>
        </div>
        <div className="col-auto">
          <select
            value={this.state.sort_val}
            onChange={this.handleSortSelect}
            style={{ color: "white" }}
            className="form-select bg-secondary"
            aria-label="Default select example"
          >
            <option value="activate_time">Date</option>
            <option value="average_mmr">MMR</option>
            <option value="spectators">Spectators</option>
          </select>
        </div>
      </div>
    );
  }
}

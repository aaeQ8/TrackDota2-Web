import React from "react";

export class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { search_words: "", sort_val: "activate_time_id" };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidUpdate(prevProps) {
    if (
      this.props.items_org !== null &&
      this.props.items_org !== undefined &&
      prevProps.items_org !== this.props.items_org
    ) {
      var new_items = this.filterItems(
        this.state.search_words,
        this.state.sort_val
      );
      var fetch_more;
      if (this.state.search_words === "") fetch_more = true;
      else fetch_more = false;

      this.props.updateItems(new_items, fetch_more);
    }
  }

  handleSelect(event) {
    this.setState({ sort_val: event.target.value });
    if (this.props.items_org !== null && this.props.items_org !== undefined) {
      var new_items = this.filterItems(
        this.state.search_words,
        event.target.value
      );
      var fetch_more;
      if (this.state.search_words === "") fetch_more = true;
      else fetch_more = false;
      this.props.updateItems(new_items, fetch_more);
    }
  }

  handleChange(event) {
    this.setState({ search_words: event.target.value });
    if (
      event.target.value === "" &&
      this.props.items_org !== null &&
      this.props.items_org !== undefined
    ) {
      var new_items = this.filterItems(event.target.value, this.state.sort_val);
      this.props.updateItems(new_items, true);
    }
  }
  handleSubmit(event) {
    if (this.props.items_org !== null && this.props.items_org !== undefined) {
      var new_items = this.filterItems(
        this.state.search_words,
        this.state.sort_val
      );
      console.log(new_items);
      var fetch_more;
      if (this.state.search_words === "") fetch_more = true;
      else fetch_more = false;
      this.props.updateItems(new_items, fetch_more);
    }
  }

  _search(search_words) {
    var items = [];
    if (search_words === "") {
      items = [...this.props.items_org];
    } else {
      this.props.items_org.forEach((element) => {
        element.players.forEach((player) => {
          if (
            player.player_details.player_name
              .toLowerCase()
              .startsWith(search_words.toLowerCase())
          ) {
            items.push(element);
          }
        });
      });
    }
    return items;
  }

  _sortItems(items, sort_val) {
    function mycomparator(a, b) {
      return a[sort_val] < b[sort_val] ? 1 : -1;
    }

    return [...items].sort(mycomparator);
  }

  filterItems(search_words, sort_val) {
    var items;
    items = this._search(search_words);
    items = this._sortItems(items, sort_val);
    return items;
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <input
            value={this.state.search_words}
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
            value={this.state.sort_val}
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

  componentDidUpdate(prevProps) {
    console.log("called", this.props.items_org);
    if (
      this.props.items_org !== null &&
      this.props.items_org !== undefined &&
      prevProps.items_org !== this.props.items_org
    ) {
      var new_items = this.filterItems(
        this.props.items_org,
        this.state.search_words,
        this.state.show_val,
        this.state.sort_val
      );
      this.props.updateItems(new_items);
    }
  }

  _search(items_org, search_words) {
    var items = [];
    if (search_words === "") {
      items = [...items_org];
    } else {
      items_org.forEach((element) => {
        element.players.forEach((player) => {
          if ("name" in player)
            if (
              player.name.toLowerCase().startsWith(search_words.toLowerCase())
            ) {
              items.push(element);
            }
        });
      });
    }
    return items;
  }

  _sortItems(items, sort_val) {
    function mycomparator(a, b) {
      return a[sort_val] < b[sort_val] ? 1 : -1;
    }

    return [...items].sort(mycomparator);
  }

  _showItems(items, show_val) {
    var items_to_show = [];
    if (show_val === "all") items_to_show = [...items];
    else if (show_val === "live") {
      items.forEach((element) => {
        if (element.deactivate_time === 0) items_to_show.push(element);
      });
    } else if (show_val === "complete") {
      items.forEach((element) => {
        if (element.deactivate_time !== 0) items_to_show.push(element);
      });
    }
    return items_to_show;
  }

  filterItems(items_org, search_words, show_val, sort_val) {
    var items;
    items = this._search(this.props.items_org, search_words);
    items = this._showItems(items, show_val);
    items = this._sortItems(items, sort_val);
    return items;
  }

  handleSortSelect(event) {
    this.setState({ sort_val: event.target.value });
    if (this.props.items_org !== null && this.props.items_org !== undefined) {
      var new_items = this.filterItems(
        this.props.items_org,
        this.state.search_words,
        this.state.show_val,
        event.target.value
      );

      this.props.updateItems(new_items);
    }
  }

  handleShowSelect(event) {
    this.setState({ show_val: event.target.value });
    if (this.props.items_org !== null && this.props.items_org !== undefined) {
      var new_items = this.filterItems(
        this.props.items_org,
        this.state.search_words,
        event.target.value,
        this.state.sort_val
      );
      this.props.updateItems(new_items);
    }
  }

  handleChange(event) {
    this.setState({ search_words: event.target.value });
    if (
      this.props.items_org !== null &&
      this.props.items_org !== undefined &&
      event.target.value === ""
    ) {
      var new_items = this.filterItems(
        this.props.items_org,
        event.target.value,
        this.state.show_val,
        this.state.sort_val
      );

      this.props.updateItems(new_items);
    }
  }

  handleSubmit(event) {
    if (this.props.items_org !== null && this.props.items_org !== undefined) {
      var new_items = this.filterItems(
        this.props.items_org,
        this.state.search_words,
        this.state.show_val,
        this.state.sort_val
      );
      this.props.updateItems(new_items);
    }
  }
  handleUpdate(event) {
    if (this.props.items_org !== null && this.props.items_org !== undefined) {
      this.props.updateLiveMatches();
    }
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

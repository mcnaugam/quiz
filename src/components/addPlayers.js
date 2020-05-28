import React, { Component } from "react";
import "../css/quiz.css";

class AddPlayers extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      players: [],
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = (e) => {
    this.props.history.push({
      pathname: "/game",
      state: { players: this.state.players },
    });
  };
  onAdd = (e) => {
    e.preventDefault();
    this.state.players.push(this.state.name);
    this.setState({ players: this.state.players, name: "" });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col s4 offset-s4">
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Add players</b> below
              </h4>
            </div>
          </div>
        </div>
        <div className="row inner-div">
          <div className="col s4 offset-s4">
            <form noValidate onSubmit={this.onSubmit}>
              <div class="row">
                <div className="input-field col s8">
                  <input
                    onChange={this.onChange}
                    value={this.state.name}
                    id="name"
                    type="text"
                  />
                  <label htmlFor="name">Name</label>
                </div>
                <div className="col s4">
                  <button
                    style={{
                      width: "150px",
                      borderRadius: "3px",
                      letterSpacing: "1.5px",
                      marginTop: "1rem",
                    }}
                    onClick={this.onAdd}
                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div
                className="col s12 offset-s4"
                style={{ paddingLeft: "11.250px" }}
              >
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable green accent-3"
                >
                  Start game
                </button>
              </div>
            </form>
            <div className="col s12">
              <div style={{ position: "absolute" }}>
                <PlayerList players={this.state.players} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class PlayerList extends Component {
  render() {
    const listItems = this.props.players.map((player, i) => (
      <li key={i}>{player}</li>
    ));

    return (
      <div>
        <h5>Players</h5>
        <ul>{listItems}</ul>
      </div>
    );
  }
}

export default AddPlayers;

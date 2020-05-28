import React, { Component } from "react";
import "../css/quiz.css";
import { SET1 } from "../data/questions";
import correct from "../data/14876504_correct_by_robotsound_preview.mp3";
import wrong from "../data/23205030_game-show-buzzer-wrong-answer_by_floraphonic_preview.mp3";
import FlipMove from "react-flip-move";
import classnames from "classnames";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

class Game extends Component {
  constructor() {
    super();
    this.state = {
      players: [],
      playerScores: [],
      originalOrderPlayerScores: [],
      misses: [],
      questions: SET1,
      currentRound: 0,
      allOut: false,
      revealAllAnswers: false,
      currentPlayer: {
        name: "",
        score: 0,
        colour: "",
        questions: [],
        wrongAnswers: [],
      },
    };
    this.initialiseGame = this.initialiseGame.bind(this);
    this.shufflePlayers = this.shufflePlayers.bind(this);
    this.getColour = this.getColour.bind(this);
    this.updateResult = this.updateResult.bind(this);
    this.sortScores = this.sortScores.bind(this);
    this.advancePlayer = this.advancePlayer.bind(this);
    this.showAnswers = this.showAnswers.bind(this);
    this.nextRound = this.nextRound.bind(this);
    this.undoLastAnswer = this.undoLastAnswer.bind(this);
  }
  componentDidMount() {
    let players = this.props.location.state.players;
    this.setState(
      {
        players: players,
      },
      () => this.initialiseGame()
    );
  }

  allPlayersOut() {
    let outPlayers = 0;
    this.state.playerScores.forEach((player) => {
      if (player.wrongAnswers[this.state.currentRound] === 2) {
        outPlayers++;
      }
    });
    return outPlayers === this.state.playerScores.length;
  }

  undoLastAnswer() {
    if (this.state.result) {
      const result = this.state.result;
      const player = this.state.result.player;

      let scoreChangeValue = "";

      if (result.outcome === "wrong") {
        player.score = player.score + 10;
        scoreChangeValue = "+10";
        player.wrongAnswers[this.state.currentRound] =
          player.wrongAnswers[this.state.currentRound] - 1;
      } else if (result.outcome === "correct") {
        player.score = player.score - result.score;
        scoreChangeValue = "-" + result.score;
      }

      this.state.misses.pop();

      this.setState(
        {
          scoreChange: {
            name: player.name,
            value: scoreChangeValue,
          },
          result: result,
          currentPlayer: player,
        },
        () => {
          this.sortScores();
        }
      );
    }
  }

  advancePlayer() {
    if (!this.allPlayersOut()) {
      const currentPlayerName = this.state.currentPlayer.name;
      let currentIndex = this.state.originalOrderPlayerScores.findIndex(
        (player) => player.name === currentPlayerName
      );

      let nextIndex = -1;

      let found = false;
      while (!found) {
        nextIndex =
          currentIndex === 0
            ? this.state.originalOrderPlayerScores.length - 1
            : currentIndex - 1;

        if (
          this.state.originalOrderPlayerScores[nextIndex].wrongAnswers[
            this.state.currentRound
          ] < 2
        ) {
          found = true;
        }
        currentIndex = nextIndex;
      }

      this.setState({
        currentPlayer: this.state.originalOrderPlayerScores[nextIndex],
      });
    } else {
      this.setState({
        allOut: true,
      });
    }
  }

  showAnswers() {
    this.setState(
      {
        revealAllAnswers: true,
        answer: undefined,
      },
      () => this.forceUpdate()
    );
  }

  nextRound() {
    this.state.playerScores.forEach((player) => {
      player.wrongAnswers.push(0);
    });
    this.setState(
      {
        currentRound: this.state.currentRound + 1,
        revealAllAnswers: false,
        allOut: false,
        misses: [],
        originalOrderPlayerScores: [...this.state.playerScores],
        currentPlayer: this.state.playerScores[
          this.state.playerScores.length - 1
        ],
      },
      () => this.forceUpdate()
    );
  }

  updateResult(result) {
    console.log("start of update reslt");
    if (result.outcome !== "used") {
      var scoreChangeValue = "";
      if (result.outcome === "correct") {
        this.state.currentPlayer.score += result.score;
        scoreChangeValue = "+" + result.score;
      } else if (result.outcome === "wrong") {
        this.setState({
          misses: this.state.misses.concat(result),
        });
        this.state.currentPlayer.score -= 10;
        scoreChangeValue = "-" + 10;
        if (
          this.state.currentPlayer.wrongAnswers &&
          this.state.currentPlayer.wrongAnswers[this.state.currentRound]
        ) {
          this.state.currentPlayer.wrongAnswers[this.state.currentRound]++;
        } else {
          this.state.currentPlayer.wrongAnswers[this.state.currentRound] = 1;
        }
      }
      this.setState(
        {
          scoreChange: {
            name: this.state.currentPlayer.name,
            value: scoreChangeValue,
          },
          result: result,
        },
        () => {
          this.advancePlayer();
          this.sortScores();
        }
      );
    }
    console.log("end of update result");
  }

  sortScores() {
    const sortedScores = [...this.state.playerScores];
    sortedScores.sort((player1, player2) => player2.score - player1.score);
    this.setState(
      {
        playerScores: sortedScores,
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  getColour(i) {
    return ["red", "cyan", "green", "yellow", "orange"][i];
  }

  initialiseGame() {
    let playerScores = [];
    this.state.players.forEach((player, i) => {
      playerScores.push({
        name: player,
        score: 0,
        colour: this.getColour(i),
        wrongAnswers: [0],
      });
    });
    this.setState(
      {
        playerScores: playerScores,
        currentPlayer: playerScores[playerScores.length - 1],
      },
      () => {
        this.shufflePlayers();
      }
    );
  }

  shufflePlayers() {
    let newPlayerScores = this.state.playerScores,
      currentIndex = this.state.playerScores.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = newPlayerScores[currentIndex];
      newPlayerScores[currentIndex] = newPlayerScores[randomIndex];
      newPlayerScores[randomIndex] = temporaryValue;
    }
    this.setState(
      {
        playerScores: newPlayerScores,
        originalOrderPlayerScores: newPlayerScores,
      },
      () => this.forceUpdate()
    );
  }

  render() {
    const mainScreen =
      this.state.currentRound === this.state.questions.length ? (
        <div>
          <FinalResult playerScores={this.state.playerScores} />
        </div>
      ) : (
        <Round
          question={this.state.questions[this.state.currentRound]}
          currentRound={this.state.currentRound}
          playerScores={this.state.playerScores}
          updateResult={this.updateResult}
          currentPlayer={this.state.currentPlayer}
          allOut={this.state.allOut}
          revealAllAnswers={this.state.revealAllAnswers}
        />
      );
    return (
      <div>
        <div className="row">
          <div className="col s3">
            <Leaderboard
              playerScores={this.state.playerScores}
              currentPlayer={this.state.currentPlayer}
              scoreChange={this.state.scoreChange}
            />

            <Controls
              showAnswers={this.showAnswers}
              revealAllAnswers={this.state.revealAllAnswers}
              nextRound={this.nextRound}
              misses={this.state.misses}
              undoLastAnswer={this.undoLastAnswer}
            />
          </div>

          <div className="col s9">{mainScreen}</div>
        </div>
      </div>
    );
  }
}

function Controls(props) {
  let buttons = "";
  if (props.revealAllAnswers) {
    buttons = (
      <button
        style={{
          width: "150px",
          borderRadius: "3px",
          letterSpacing: "1.5px",
          marginTop: "1rem",
        }}
        onClick={() => props.nextRound()}
        className="btn btn-large waves-effect waves-light hoverable green accent-3"
      >
        Next round
      </button>
    );
  } else {
    buttons = (
      <div>
        <div>
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem",
            }}
            onClick={() => props.undoLastAnswer()}
            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
          >
            Undo
          </button>
        </div>
        <div>
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem",
            }}
            onClick={() => endRound()}
            className="btn btn-large waves-effect waves-light hoverable red accent-3"
          >
            End round
          </button>
        </div>
      </div>
    );
  }

  const endRound = () => {
    confirmAlert({
      title: "End round?",
      message: "All answers will be revealed",
      buttons: [
        {
          label: "Yes",
          onClick: () => props.showAnswers(),
        },
        {
          label: "Cancel",
          onClick: () => console.log("canceled"),
        },
      ],
    });
  };

  const missesList = props.misses.map((miss, i) => (
    <div key={i}>
      {miss.player.name}: {miss.guess}
    </div>
  ));

  return (
    <div>
      <div
        style={{
          marginTop: "50px",
          height: "100px",
        }}
      >
        <h5>Misses</h5>
        {missesList}
      </div>
      <div
        style={{
          marginTop: "150px",
        }}
      >
        {buttons}
      </div>
    </div>
  );
}

function FinalResult(props) {
  const listItems = props.playerScores.map((player, i) => (
    <div key={player.name} className="row">
      <div
        className={classnames({
          "col s1": true,
        })}
        style={{
          minHeight: "25px",
          backgroundColor: player.colour,
        }}
      ></div>

      <div
        className="col s4"
        style={{
          margin: "auto",
        }}
      >
        {player.name}
      </div>

      <div
        className="col s1"
        style={{
          margin: "auto",
        }}
      >
        {player.score}
      </div>
    </div>
  ));
  return (
    <React.Fragment>
      <h5>Final Result</h5>
      <div
        style={{
          marginLeft: "15px",
          marginTop: "15px",
        }}
      >
        <FlipMove duration="2000">{listItems}</FlipMove>
      </div>
    </React.Fragment>
  );
}

class Leaderboard extends Component {
  render() {
    const listItems = this.props.playerScores.map((player, i) => (
      <div key={player.name} className="row">
        <div
          className={classnames({
            "col s1": true,
          })}
          style={{
            minHeight: "25px",
            backgroundColor: player.colour,
          }}
        ></div>

        <div
          className="col s4"
          style={{
            margin: "auto",
          }}
        >
          {player.name}
        </div>

        <div
          className="col s1"
          style={{
            margin: "auto",
          }}
        >
          {player.score}
        </div>
        <div
          className="col s1"
          style={{
            margin: "auto",
          }}
        >
          {this.props.scoreChange &&
            this.props.scoreChange.name === player.name &&
            this.props.scoreChange.value}
        </div>
      </div>
    ));
    return (
      <React.Fragment>
        <h5>Leaderboard</h5>
        <div
          style={{
            marginLeft: "15px",
            marginTop: "15px",
          }}
        >
          <FlipMove duration="2000">{listItems}</FlipMove>
        </div>
      </React.Fragment>
    );
  }
}

class Round extends Component {
  constructor() {
    super();
    this.state = {
      guess: "",
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.getResult = this.getResult.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.question) {
      this.setState(
        {
          question: newProps.question,
        },
        () => this.forceUpdate()
      );
    }
    if (newProps.currentRound !== this.props.currentRound) {
      this.setState(
        {
          answer: undefined,
        },
        () => this.forceUpdate()
      );
    }
    // if (this.props.revealAllAnswers) {
    //   this.setState(
    //     {
    //       revealAllAnswers: this.props.revealAllAnswers,
    //     },
    //     () => this.forceUpdate()
    //   );
    // }
  }

  playAudio(audio) {
    audio.play();
  }

  onSubmit(e) {
    e.preventDefault();
    const result = this.getResult(this.state.guess);

    if (result.outcome === "wrong") {
      const wrongAudio = new Audio(wrong);
      this.playAudio(wrongAudio);
      this.setState({
        guess: "",
      });
    } else if (result.outcome === "used") {
      this.setState({
        guess: "",
      });
    } else if (result.outcome === "correct") {
      const correctAudio = new Audio(correct);
      this.playAudio(correctAudio);
      this.setState(
        {
          answer: result.answer,
          guess: "",
        },
        () => this.forceUpdate()
      );
    }

    this.props.updateResult(result);
    console.log("end of on submit");
  }

  getResult(guess) {
    const answer = this.state.question.answers.find((answer) =>
      answer.answer.toLowerCase().includes(guess.toLowerCase())
    );

    let result = {};

    if (answer && !answer.hasOwnProperty("used")) {
      answer.used = false;
      const position = this.state.question.answers.indexOf(answer);

      result.outcome = "correct";
      result.score = this.state.question.answers.length - position;

      answer.player = this.props.currentPlayer;
      answer.position = position;
      result.player = this.props.currentPlayer;

      result.answer = JSON.parse(JSON.stringify(answer));
    } else if (answer && answer.hasOwnProperty("used")) {
      result.outcome = "used";
    } else {
      result.outcome = "wrong";
      result.player = this.props.currentPlayer;
      result.guess = guess;
    }
    return result;
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    const question = this.props.question;

    const currentPlayerFragment = this.props.allOut ? (
      <span style={{ color: "red" }}>ALL OUT</span>
    ) : (
      <span>{this.props.currentPlayer.name}</span>
    );

    const playerGuessFragment = this.props.allOut ? (
      <span style={{ color: "red" }}>ALL OUT</span>
    ) : (
      <button
        style={{
          width: "150px",
          borderRadius: "3px",
          letterSpacing: "1.5px",
          marginTop: "1rem",
        }}
        type="submit"
        className={
          "btn btn-large waves-effect waves-light hoverable " +
          this.props.currentPlayer.colour +
          " accent-3"
        }
      >
        {this.props.currentPlayer.name}
      </button>
    );

    return (
      <div>
        <div>
          <FlipMove duration="2000">
            <div key={question.theme}>
              <h5>{question.theme}</h5>
            </div>
            <div key={question.question}>
              <h6>{question.question}</h6>
            </div>
            <div key={question.condition}>
              <h6>{question.condition}</h6>
            </div>
          </FlipMove>
        </div>

        <div>
          <div className="row">
            <div className="col s12" style={{ marginTop: "10px" }}>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="input-field col s2">
                  <input
                    onChange={this.onChange}
                    value={this.state.guess}
                    id="guess"
                    type="text"
                  />
                  <label htmlFor="guess">Guess</label>
                </div>
                <div className="col s2">{playerGuessFragment}</div>
              </form>
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <AnswerFields
              numAnswers={this.props.question.answers.length}
              submittedAnswer={this.state.answer}
              revealAllAnswers={this.props.revealAllAnswers}
              question={this.props.question}
            />
          </div>
        </div>
      </div>
    );
  }
}

class AnswerFields extends Component {
  constructor() {
    super();
    this.state = {
      answers: [],
    };
  }

  componentDidMount() {
    const numAnswers = this.props.numAnswers;
    const newAnswers = [];
    for (let i = 0; i < numAnswers; i++) {
      newAnswers.push({});
    }
    this.setState({
      answers: newAnswers,
    });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.question.condition !== this.props.question.condition) {
      const numAnswers = newProps.numAnswers;
      const newAnswers = [];
      for (let i = 0; i < numAnswers; i++) {
        newAnswers.push({});
      }
      this.setState(
        {
          answers: newAnswers,
        },
        () => this.forceUpdate()
      );
    }
    if (newProps.submittedAnswer) {
      const answer = newProps.submittedAnswer;
      const newAnswers = this.state.answers;
      newAnswers[answer.position] = answer;
      this.setState({
        answers: newAnswers,
      });
    }
    if (newProps.revealAllAnswers) {
      let newAnswers = [];
      this.state.answers.forEach((answer, i) => {
        if (!answer.player) {
          let unguessedAnswer = this.props.question.answers[i];
          unguessedAnswer.used = true;
          let player = {
            name: "TEST",
            colour: "#e6e9fc",
          };
          unguessedAnswer.player = player;
          newAnswers.push(unguessedAnswer);
        } else {
          newAnswers.push(answer);
        }
        this.setState(
          {
            answers: newAnswers,
          },
          () => this.forceUpdate()
        );
      });
    }
  }

  render() {
    const answerFields = [];

    this.state.answers.forEach((answer, i) => {
      answerFields.push(
        <AnswerField key={i + this.props.question.condition} answer={answer} />
      );
    });

    return (
      <div>
        <FlipMove duration="2000">{answerFields}</FlipMove>
      </div>
    );
  }
}

class AnswerField extends Component {
  constructor() {
    super();
    this.state = {
      answerText: " ",
    };
  }

  render() {
    const answer = this.props.answer;
    let text = "";
    let backgroundColour = "#e6e9fc";
    if (answer && answer.player) {
      if (answer.hasOwnProperty("answer")) {
        text = text + answer.answer;
        if (answer.hasOwnProperty("value")) {
          text = text + ": " + answer.value;
        }
      }
      backgroundColour = answer.player.colour || "#e6e9fc";
    }
    return (
      <React.Fragment>
        <div
          className="row"
          style={{
            marginTop: "0px",
            marginBottom: "0px",
          }}
        >
          <div
            className="col s4"
            style={{
              textAlign: "center",
              marginBottom: "9px",
              minHeight: "25px",
              border: "1px solid grey",
              backgroundImage:
                "linear-gradient(to right, " +
                backgroundColour +
                ", white," +
                backgroundColour +
                ")",
            }}
          >
            <b text> {text} </b>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Game;

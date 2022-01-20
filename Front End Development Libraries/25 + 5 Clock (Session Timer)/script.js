class Options extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "options" }, /*#__PURE__*/
      React.createElement("strong", null, "Timer options:"), /*#__PURE__*/
      React.createElement("div", { id: "break-option" }, /*#__PURE__*/
      React.createElement("p", { id: "break-label" }, "Break length"), /*#__PURE__*/
      React.createElement("button", { id: "break-increment", type: "button" }, /*#__PURE__*/React.createElement("i", { className: "fas fa-angle-up" })), /*#__PURE__*/
      React.createElement("button", { id: "break-decrement", type: "button" }, /*#__PURE__*/React.createElement("i", { className: "fas fa-angle-down" })), /*#__PURE__*/
      React.createElement("p", { id: "break-length" }, this.props.breakLength)), /*#__PURE__*/

      React.createElement("div", { id: "session-option" }, /*#__PURE__*/
      React.createElement("p", { id: "session-label" }, "Session length"), /*#__PURE__*/
      React.createElement("button", { id: "session-increment", type: "button" }, /*#__PURE__*/React.createElement("i", { className: "fas fa-angle-up" })), /*#__PURE__*/
      React.createElement("button", { id: "session-decrement", type: "button" }, /*#__PURE__*/React.createElement("i", { className: "fas fa-angle-down" })), /*#__PURE__*/
      React.createElement("p", { id: "session-length" }, this.props.sessionLength))));



  }}


class Controls extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "controls" }, /*#__PURE__*/
      React.createElement("button", { id: "start_stop", type: "button" },
      this.props.running ? /*#__PURE__*/
      React.createElement("i", { id: "btn_i-stop", className: "fas fa-stop" }) : /*#__PURE__*/
      React.createElement("i", { id: "btn_i-start", className: "fas fa-play" })), /*#__PURE__*/


      React.createElement("button", { id: "reset", type: "button", title: "Reset timer options" }, /*#__PURE__*/React.createElement("i", { className: "fas fa-undo-alt" }))));


  }}


class Display extends React.Component {
  render() {
    let secLeft = this.props.secLeft;
    let time = new Date();
    time.setTime(secLeft * 1000); // use milisecond
    let timeLeft;
    secLeft == 60 * 60 ? timeLeft = "60:00" : timeLeft = time.toISOString().substring(14, 19); // else would display (1:)00:00

    return /*#__PURE__*/(
      React.createElement("div", { id: "display" }, /*#__PURE__*/
      React.createElement("h1", { id: "timer-label" }, "Timer: ", this.props.timerLabel), /*#__PURE__*/
      React.createElement("p", { id: "time-left" }, timeLeft), /*#__PURE__*/
      React.createElement("audio", { id: "beep", src: "https://upload.wikimedia.org/wikipedia/commons/4/42/Beep_alarm_clock.ogg" })));


  }}


class SessionTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: BREAK_LENGTH,
      sessionLength: SESSION_LENGTH,
      timerName: "Session",
      intervalId: null,
      timeLeft: SESSION_LENGTH * 60 // seconds
    };

    this.setOption = this.setOption.bind(this);
    this.controlTimer = this.controlTimer.bind(this);
    this.countdown = this.countdown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  setOption(opt) {
    this.setState(state => {
      let breakLen = state.breakLength;
      let sessionLen = state.sessionLength;
      switch (opt) {// limit 1–60
        case "break-increment":
          breakLen < 60 ? breakLen += 1 : breakLen;
          break;
        case "break-decrement":
          breakLen > 1 ? breakLen -= 1 : breakLen;
          break;
        case "session-increment":
          sessionLen < 60 ? sessionLen += 1 : sessionLen;
          break;
        case "session-decrement":
          sessionLen > 1 ? sessionLen -= 1 : sessionLen;
          break;}

      return {
        breakLength: breakLen,
        sessionLength: sessionLen,
        timerName: "Session",
        timeLeft: sessionLen * 60 };

    });
  }

  controlTimer(action) {
    switch (action) {
      case "start_stop":
        this.setState(state => {
          const opts = document.querySelectorAll("#options button");
          if (state.intervalId) {// if timer is running (intervalId not null)
            opts.forEach(el => el.removeAttribute("disabled")); // enable settings
            clearInterval(state.intervalId); // then pause
            return { intervalId: null };
          } else
          {
            opts.forEach(el => el.setAttribute("disabled", true));
            let newInterval = setInterval(() => this.countdown(), 1000);
            return { intervalId: newInterval };
          }
        });
        break;
      case "reset":
        this.setState(state => {
          if (state.intervalId) {
            this.controlTimer("start_stop");
          }
          document.getElementById("beep").load();
          return {
            breakLength: BREAK_LENGTH,
            sessionLength: SESSION_LENGTH,
            timerName: "Session",
            timeLeft: SESSION_LENGTH * 60 };

        });
        break;}

    // END controlTimer()
  }

  countdown() {
    this.setState(state => {
      const timeLeft = state.timeLeft;
      if (timeLeft > 0) {
        return { timeLeft: timeLeft - 1 };
      } else
      if (timeLeft <= 0) {// switch between break and session timer
        document.getElementById("beep").play();
        if (state.timerName == "Session") {
          return {
            timerName: "Break",
            timeLeft: state.breakLength * 60 };

        }
        return {
          timerName: "Session",
          timeLeft: state.sessionLength * 60 };

      }
    });
  }

  handleClick(e) {
    const isBtn = e.target.nodeName === "BUTTON"; // note: <i> should have pointer-events:none
    if (!isBtn) {
      return;
    }
    const btnId = e.target.id;
    switch (e.target.parentElement.id) {
      case "controls":
        this.controlTimer(btnId);
        break;
      default:
        this.setOption(btnId);}

  }

  componentDidMount() {
    document.addEventListener("click", this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
  }

  render() {
    const running = Number.isInteger(this.state.intervalId);
    return /*#__PURE__*/(
      React.createElement("div", { id: "session-timer" }, /*#__PURE__*/
      React.createElement(Display, { timerLabel: this.state.timerName, secLeft: this.state.timeLeft }), /*#__PURE__*/
      React.createElement(Controls, { running: running }), /*#__PURE__*/
      React.createElement(Options, { breakLength: this.state.breakLength, sessionLength: this.state.sessionLength })));


  }
  // END <SessionTimer />
}

const BREAK_LENGTH = 5;
const SESSION_LENGTH = 25;

ReactDOM.render( /*#__PURE__*/React.createElement(SessionTimer, null), document.getElementById("app-container"));
class DrumKey extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("button", { id: this.props.name, className: "drum-pad", type: "button" },
      this.props.trigger, /*#__PURE__*/
      React.createElement("audio", { id: this.props.trigger, className: "clip", src: this.props.url })));


  }}


class DrumPad extends React.Component {
  render() {
    const drumKeys = audioSrc.map((audio) => /*#__PURE__*/
    React.createElement(DrumKey, { key: audio.trigger, name: audio.name, trigger: audio.trigger, url: audio.url }));

    return /*#__PURE__*/(
      React.createElement("div", { class: "drum-pad-container" },
      drumKeys));


  }}


class Controls extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "controls" }, /*#__PURE__*/
      React.createElement("div", { id: "display" }, this.props.display), /*#__PURE__*/
      React.createElement("label", { for: "volume" }, "Volume", /*#__PURE__*/

      React.createElement("input", { id: "volume", type: "range", min: "0", max: "1", step: "0.01", name: "volume" }))));



  }}


class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
      timeoutId: null };

    this.playAudio = this.playAudio.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clear = this.clear.bind(this);
  }

  playAudio(trigger) {
    const audio = document.getElementById(trigger);
    const drumPad = audio.parentElement;
    this.setState({
      display: drumPad.id.replace(/-/g, " ") });

    audio.play();
    drumPad.classList.add("active-drum-pad");
    setTimeout(() => drumPad.classList.remove("active-drum-pad"), 100);
  }

  changeVolume() {
    const currentVolume = document.getElementById("volume").value;
    this.setState({
      display: "Volume: " + Math.round(currentVolume * 100) });

    document.getElementsByClassName("clip").forEach(audio => audio.volume = currentVolume);
    this.clear();
  }

  handleClick(e) {
    const isDrumKey = e.target.classList.contains("drum-pad");
    if (!isDrumKey) {
      return;
    }
    this.playAudio(e.target.innerText);
  }

  handleKeyPress(e) {
    if (e.code.includes("Key")) {
      const keyPressed = e.code[3];
      const validKeys = "QWEASDZXC";
      if (validKeys.includes(keyPressed)) {
        this.playAudio(keyPressed);
      }
    }
  }

  handleChange(e) {
    if (e.target.id === "volume") {
      this.changeVolume();
    }
  }

  clear() {
    clearTimeout(this.state.timeoutId);
    const newTimeoutId = setTimeout(() => this.setState({ display: "" }), 1000);
    this.setState({ timeoutId: newTimeoutId });
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKeyPress);
    document.addEventListener("input", this.handleChange);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("keydown", this.handleKeyPress);
    document.removeEventListener("input", this.handleChange);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "drum-machine" }, /*#__PURE__*/
      React.createElement("h1", null, "Drum Machine"), /*#__PURE__*/
      React.createElement(Controls, { display: this.state.display }), /*#__PURE__*/
      React.createElement(DrumPad, null), /*#__PURE__*/
      React.createElement("footer", null, "Drum samples from ", /*#__PURE__*/React.createElement("a", { href: "https://sampleswap.org", target: "_blank" }, "SampleSwap"), ".")));


  }
  // END DrumMachine
}

const audioSrc = [
{
  name: "Kick",
  trigger: "Q",
  url: "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/64[kb]kick1.wav.mp3" },

{
  name: "Tomtom",
  trigger: "W",
  url: "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/35[kb]tom1.wav.mp3" },

{
  name: "High-Tom",
  trigger: "E",
  url: "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/21[kb]hightom.wav.mp3" },

{
  name: "Snare",
  trigger: "A",
  url: "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/11[kb]snare.wav.mp3" },

{
  name: "Open-Hihat",
  trigger: "S",
  url: "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/55[kb]open_hh.wav.mp3" },

{
  name: "Closed-Hihat",
  trigger: "D",
  url: "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/8[kb]cl_hihat.wav.mp3" },

{
  name: "Rimshot",
  trigger: "Z",
  url: "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/5[kb]rimshot.wav.mp3" },

{
  name: "Crash-Cymbal",
  trigger: "X",
  url: "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/196[kb]crashcym.wav.mp3" },

{
  name: "Cowbell",
  trigger: "C",
  url: "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/DRUM%20MACHINES/808%20Basic/33[kb]cowbell.wav.mp3" }

// END audioSrc
];

let displayText = [];

ReactDOM.render( /*#__PURE__*/React.createElement(DrumMachine, null), document.getElementById("app"));
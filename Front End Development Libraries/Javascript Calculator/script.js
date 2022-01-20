class Keypad extends React.Component {
  render() {
    const keyDef = [
    {
      type: "memory-keys",
      keys: {
        "clear": "AC",
        "clear-entry": "CE",
        "answer": "Ans" } },


    {
      type: "num-keys",
      keys: {
        "seven": "7",
        "eight": "8",
        "nine": "9",
        "four": "4",
        "five": "5",
        "six": "6",
        "one": "1",
        "two": "2",
        "three": "3",
        "zero": "0",
        "decimal": "." } },


    {
      type: "operator-keys",
      keys: {
        "divide": "/",
        "multiply": "×",
        "subtract": "–",
        "add": "+",
        "equals": "=" } }];




    const btns = keyDef.map(group => {
      const keys = group.keys;
      const groupBtns = Object.keys(keys).map((i) => /*#__PURE__*/
      React.createElement("button", { key: i, id: i, value: keys[i] }, keys[i]));

      return /*#__PURE__*/(
        React.createElement("div", { key: group.type, id: group.type },
        groupBtns));


    });

    return /*#__PURE__*/(
      React.createElement("div", { id: "calc-keypad" },
      btns));


  }
  // END <Keypad />
}

class Display extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "calc-display" }, /*#__PURE__*/
      React.createElement("div", { id: "formula" }, this.props.formula), /*#__PURE__*/
      React.createElement("div", { id: "display", title: "Click to copy!" }, this.props.display)));


  }}


class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "0",
      display: "0",
      formula: "",
      ans: "0",
      DISPLAY_LIMIT: 12 // characters ("." exclusive)
    };
    this.memoryAction = this.memoryAction.bind(this);
    this.inputNum = this.inputNum.bind(this);
    this.inputOperator = this.inputOperator.bind(this);
    this.output = this.output.bind(this);
    this.alert = this.alert.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  memoryAction(action) {
    switch (action) {
      case "AC":
        this.setState({
          input: "0",
          display: "0",
          formula: "",
          ans: "0" });

        break;
      case "CE":
        this.setState(state => {
          return {
            input: "0",
            display: "0",
            formula: state.formula.replace(/[\d\.]+$/, "") };

        });
        break;
      case "Ans":
        this.inputNum(this.state.ans);}

  }

  inputNum(num) {
    this.setState(state => {
      let oldInput = state.input;
      if (/[+–×/]/.test(oldInput) || oldInput === "=") {
        oldInput = "0";
      }
      let newInput = oldInput;
      switch (num) {
        case ".":
          if (/\./.test(oldInput)) {
            break;
          }
        default:
          oldInput === "0" && num != "." ?
          newInput = num :
          (newInput + num).replace(/\D/g, "").length > state.DISPLAY_LIMIT ?
          this.alert("INPUT LIMIT", { display: addNumSep(newInput) }) : newInput += num;}

      let newFormula;

      state.input === "=" ?
      newFormula = newInput :
      newFormula = state.formula.replace(/[\d\.]+$|(?<=[+–×/])$|^$/, Number(newInput));

      return {
        input: newInput,
        display: addNumSep(newInput),
        formula: newFormula };

    });
    // END inputNum()
  }

  inputOperator(operator) {
    this.setState(state => {
      let newFormula;

      state.input === "=" ?
      newFormula = state.ans :
      newFormula = state.formula;

      switch (operator) {
        case "–":
          if (/(?<![+–×/])[+–×/]$/.test(state.formula)) {
            newFormula += operator;
            break;
          }
        default:
          /[^+–×/]$|^$/.test(state.formula) ?
          newFormula += operator :
          newFormula = newFormula.replace(/[+–×/]+$/, operator);}

      return {
        input: operator,
        display: operator,
        formula: newFormula };

    });
  }

  output() {
    this.setState(state => {
      if (state.input === "=") {
        return;
      }
      const formula = state.formula.replace(/–/g, "-").replace(/×/g, "*");
      try {
        let answer = eval(formula);
        while (answer.toString().replace(/\D/g, "").length > state.DISPLAY_LIMIT) {
          answer = parseFloat(answer);
          if (/\.\d{7,}/.test(answer)) {
            answer = answer.toFixed(6);
            continue;
          }
          answer = answer.toExponential(0);
        }
        return {
          input: "=",
          display: addNumSep(answer),
          formula: state.formula + "=",
          ans: answer.toString() };

      }
      catch {
        this.alert("CALC ERROR", {
          input: "0",
          display: "0",
          formula: "" });

      }
    });
    // END output()
  }

  alert(info, stateAfter) {
    this.setState({ display: info });
    setTimeout(() => this.setState(stateAfter), 1000);
  }

  handleClick(e) {
    const isBtn = e.target.nodeName === "BUTTON";
    if (!isBtn) {
      if (e.target.id == "display") {
        navigator.clipboard.writeText(this.state.display);
        let note = document.getElementById("note");
        const oldNote = note.textContent;
        note.textContent = "Copied to clipboard!";
        setTimeout(() => note.textContent = oldNote, 1000);
      }
    }
    const btnVal = e.target.value;
    switch (e.target.parentElement.id) {
      case "memory-keys":
        this.memoryAction(btnVal);
        break;
      case "num-keys":
        this.inputNum(btnVal);
        break;
      case "operator-keys":
        btnVal === "=" ?
        this.output() :
        this.inputOperator(btnVal);
        break;}

  }

  handleKey(e) {
    const key = e.key;
    if ("0123456789.".includes(key)) {
      this.inputNum(key);
    } else
    {
      switch (key) {
        case "Enter":
          this.output();
          break;}
      ;
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClick);
    document.addEventListener("keydown", this.handleKey);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { id: "calculator" }, /*#__PURE__*/
      React.createElement("div", { id: "note" }, "Click to copy the number on display"), /*#__PURE__*/
      React.createElement(Display, { display: this.state.display, formula: this.state.formula }), /*#__PURE__*/
      React.createElement(Keypad, null))));



  }
  // END <Calculator />
}

function addNumSep(num) {
  return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

ReactDOM.render( /*#__PURE__*/React.createElement(Calculator, null), document.getElementById("app"));
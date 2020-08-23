class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      answer: 0,
      steps_store: "",
      steps_display: "",
      is_decimal: false,
      is_operator: false,
      
      //Ready for next input
      new_input: false
    };
    this.reset = this.reset.bind(this);
    this.add_number = this.add_number.bind(this);
    this.add_decimal = this.add_decimal.bind(this);
    this.add_percent = this.add_percent.bind(this);
    this.evaluate = this.evaluate.bind(this);
    this.backspace = this.backspace.bind(this);
    
    //Operator functions
    this.addition = this.addition.bind(this);
    this.subtraction = this.subtraction.bind(this);
    this.multiplication = this.multiplication.bind(this);
    this.division = this.division.bind(this);
  }
  
  evaluate() {
    try {
      var s = math.eval(this.state.steps_store);
    }
    catch(err) {
      var s = "Syntax Error"
    }
    
    console.log(s);
    this.setState({
      answer: s,
      steps_store: this.state.steps_display,
      steps_display: s,
      new_input: true
    });
  }
  
  backspace() {
    var temp1 = this.state.steps_display.slice(0, -1);
    var temp2 = this.state.steps_store.slice(0, -1);
    this.setState({
      steps_display: temp1,
      steps_store: temp2
    });
  }
  
  reset() {
    this.setState({
      answer: 0,
      steps_display: "0",
      steps_store: "0",
      is_decimal: false,
      is_operator: false,
      new_input: true
    });
  }
  
  add_number(number) {
    console.log("input number");
    if(this.state.new_input == true){
      this.setState((prevState) => ({ 
        answer: 0,
        steps_display: number,
        steps_store: number,
        new_input: false,
        is_operator: false
      }));
    } else {
      this.setState({
        steps_store: (this.state.steps_store.toString() + number).replace(/\[0]0+/g, '0'),
        steps_display: (this.state.steps_display.toString() + number).replace(/\[0]0+/g, '0'),
        is_operator: false
      });
    }
  }
  
  add_decimal() {
    if(this.state.is_decimal == true){

    } else {
      this.setState({
        steps_store: this.state.steps_store.concat("."),
        steps_display: this.state.steps_display.concat("."),
        is_decimal: true
      });
    }
  }
  
  add_percent() {
    this.setState({
      steps_store: this.state.steps_store.concat("/100"),
      steps_display: this.state.steps_display.concat("%")
    });
  }
  
  addition() {
    if(this.state.is_operator == true){
      var temp1 = this.state.steps_store.slice(0, -3) + " + ";
      var temp2 = this.state.steps_display.slice(0, -3) + " + ";
      this.setState({
        steps_store: temp1,
        steps_display: temp2
      })
      return;
    }
    if(this.state.new_input == true){
      this.setState((prevState) => ({ 
        steps_display: "Ans + ",
        steps_store: this.state.answer.toString().concat(" + "),
        new_input: false,
        is_decimal: false,
        is_operator: true
      }));
    } else {
      this.setState({
        steps_store: this.state.steps_store.concat(" + "),
        steps_display: this.state.steps_display.concat(" + "),
        is_decimal: false,
        is_operator: true
      });
    }
  }
  
  subtraction() {
    if(this.state.is_operator == true){
      var temp1 = this.state.steps_store.slice(0, -3) + " - ";
      var temp2 = this.state.steps_display.slice(0, -3) + " - ";
      this.setState({
        steps_store: temp1,
        steps_display: temp2
      })
      return;
    }
    if(this.state.is_operator == true){
      return;
    }
    if(this.state.new_input == true){
      this.setState((prevState) => ({ 
        steps_display: "Ans - ",
        steps_store: this.state.answer.toString().concat(" - "),
        new_input: false,
        is_decimal: false,
        is_operator: true
      }));
    } else {
      this.setState({
        steps_store: this.state.steps_store.concat(" - "),
        steps_display: this.state.steps_display.concat(" - "),
        is_decimal: false,
        is_operator: true
      });
    }
  }
  
  multiplication() {
    if(this.state.is_operator == true){
      var temp1 = this.state.steps_store.slice(0, -3) + " * ";
      var temp2 = this.state.steps_display.slice(0, -3) + " × ";
      this.setState({
        steps_store: temp1,
        steps_display: temp2
      })
      return;
    }
    if(this.state.new_input == true){
      this.setState((prevState) => ({ 
        steps_display: "Ans × ",
        steps_store: this.state.answer.toString().concat(" * "),
        new_input: false,
        is_decimal: false,
        is_operator: true
      }));
    } else {
      this.setState({
        steps_store: this.state.steps_store.concat(" * "),
        steps_display: this.state.steps_display.concat(" × "),
        is_decimal: false,
        is_operator: true
      });
    }
  }
  
  division() {
    if(this.state.is_operator == true){
      var temp1 = this.state.steps_store.slice(0, -3) + " / ";
      var temp2 = this.state.steps_display.slice(0, -3) + " ÷ ";
      this.setState({
        steps_store: temp1,
        steps_display: temp2
      })
      return;
    }
    if(this.state.new_input == true){
      this.setState((prevState) => ({ 
        steps_display: "Ans ÷ ",
        steps_store: this.state.answer.toString().concat(" / "),
        new_input: false,
        is_decimal: false,
        is_operator: true
      }));
    } else {
      this.setState({
        steps_store: this.state.steps_store.concat(" / "),
        steps_display: this.state.steps_display.concat(" ÷ "),
        is_decimal: false,
        is_operator: true
      });
    }
  }
  
  render() {
    return (
      <div>
        
        <div class="display">
          <div class="sub-counter">
            {this.state.steps_store}
          </div>
          <div class="counter" id="display">
            {this.state.steps_display}
          </div>
        </div>
        
        <div class="button-row">
          <div class="button func" id="clear" onClick={this.reset}>AC</div>
          <div class="button func" onClick={this.backspace}>⇤</div>
          <div class="button func" onClick={this.add_percent}>%</div>
          <div class="button func" id="divide" onClick={this.division}>÷</div>
        </div>
      
        <div class="button-row">
          <div class="button" id="seven" onClick={()=>this.add_number("7")}>7</div>
          <div class="button" id="eight" onClick={()=>this.add_number("8")}>8</div>
          <div class="button" id="nine" onClick={()=>this.add_number("9")}>9</div>
          <div class="button func" id="multiply" onClick={this.multiplication}>×</div>
        </div>
          
        <div class="button-row">
          <div class="button" id="four" onClick={()=>this.add_number("4")}>4</div>
          <div class="button" id="five" onClick={()=>this.add_number("5")}>5</div>
          <div class="button" id="six" onClick={()=>this.add_number("6")}>6</div>
          <div class="button func" id="subtract" onClick={this.subtraction}>-</div>
        </div>
        
        <div class="button-row">
          <div class="button" id="one" onClick={()=>this.add_number("1")}>1</div>
          <div class="button" id="two" onClick={()=>this.add_number("2")}>2</div>
          <div class="button" id="three" onClick={()=>this.add_number("3")}>3</div>
          <div class="button func" id="add" onClick={this.addition}>+</div>
        </div>
        
        <div class="button-row">
          <div class="button" id="zero" onClick={()=>this.add_number("0")}>0</div>
          <div class="button" id="decimal" onClick={this.add_decimal}>.</div>
          <div class="button">Ans</div>
          <div class="button submit" id="equals" onClick={this.evaluate}>=</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
	<App />,
  document.getElementById('app')
);

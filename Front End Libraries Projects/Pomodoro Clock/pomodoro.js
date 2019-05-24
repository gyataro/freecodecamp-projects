//Global variables
var time_length = 0;
var time_left = 0;
var time_elapsed = 0;

class Timer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      current_time: "Session",
      time_left: "25:00",
      break_length: 300,
      session_length: 1500,
      is_session: true,
      is_running: false
    }
    
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.timer_function = this.timer_function.bind(this)
    this.reset = this.reset.bind(this);
  }

  reset(){
    clearInterval(this.timer);
    time_length = 0;
    time_left = 0;
    time_elapsed = 0;
    this.setState({
      current_time: "Session",
      time_left: "25:00",
      break_length: 300,
      session_length: 1500,
      is_session: true,
      is_running: false
    });
    beep.currentTime = 0;
    beep.pause(); 
  }
  
  timer_function() {
    let start = Date.now();

    if(this.state.is_running == true){
      time_length = time_left;
      clearInterval(this.timer);
      this.setState({
        is_pause: true,
        is_running: false
      });
      return;
    } else if(this.state.is_pause == true) {
      this.setState({
        is_pause: false,
        is_running: true
      });
    } else {
      this.setState({
        is_running: true
      });
    }
    
    /* Timer works by continuously calculating time_left = break/session_length - time_elapsed, time elapsed is how many seconds
    since the button was pressed, or there is a switch between session and break */
    if(this.state.is_session == true && time_length <= 0){
      time_length = this.state.session_length;
    } else if(this.state.is_session == false && time_length <= 0) {
      time_length = this.state.break_length;
    }
    
    this.timer = setInterval( () => {
      //Avoids time drift by setting a reference point for the timer to calculate from
      time_elapsed = Date.now() - start;
      time_left = time_length - Math.floor(time_elapsed / 1000);
      console.log(time_length);
      console.log(time_left);
      
      if(time_left < 0){ 
        beep.play();
        setTimeout(function() {
          beep.currentTime = 0;
          beep.pause(); 
        }, 1000);
        this.setState(prevState => ({
          is_session: !prevState.is_session,
          current_time: !prevState.is_session ? 'Session' : 'Break'
        }));

        if(this.state.is_session == true){
          time_length = this.state.session_length;
        } else {
          time_length = this.state.break_length;
        }
        start = Date.now();
        return;
      }
      
      var time_left_secs = (time_left % 60);
      var time_left_mins = (Math.floor(time_left/60));
      
      if(time_left_secs < 10){
        time_left_secs = "0" + time_left_secs.toString();
      }
      if(time_left_mins < 10){
        time_left_mins = "0" + time_left_mins.toString();
      }
      
      this.setState({time_left: time_left_mins + ":" + time_left_secs});
    }, 100);
  }
  
  //Prevent memory leaks by clearing the interval before leaving
  componentWillUnmount(){
    clearInterval(this.timer)
  }
  
  increment(which_time){
    console.log()
    if(which_time == "session" && this.state.session_length < 3600){
      this.setState({
        session_length: this.state.session_length + 60,
        //Note: +1 is needed because session_length has not updated here, yet
        time_left: (this.state.session_length/60 + 1).toString() + ":00"
      });
    } else if(which_time == "break" && this.state.break_length < 3600) {
      this.setState({
        break_length: this.state.break_length + 60
      });
    }
  }
  
  decrement(which_time){
    if(which_time == "session" && this.state.session_length > 60){
      this.setState({
        session_length: this.state.session_length - 60,
        //Note: -1 is needed because session_length has not updated here, yet
        time_left: (this.state.session_length/60 -1).toString() + ":00"
      });
    } else if(which_time == "break" && this.state.break_length > 60) {
      this.setState({
        break_length: this.state.break_length - 60
      });
    }
  }
  
  render() {
    return(
      <div>
        <audio id="beep">
          <source src="https://goo.gl/65cBl1"/>
        </audio>
        <h1 id="title">Pomodoro Clock</h1>
        
        <div class="options">
          <div id="break-panel">
            <h3 id="break-label">Break Length</h3>
            <div id="break-length">{this.state.break_length/60}</div>
            <button id="break-decrement" onClick={()=>this.decrement("break")}>-</button>
            <button id="break-increment" onClick={()=>this.increment("break")}>+</button>
          </div>
        
          <div id="session-panel">
            <h3 id="session-label">Session Length</h3>
            <div id="session-length">{this.state.session_length/60}</div>
            <button id="session-decrement" onClick={()=>this.decrement("session")}>-</button>
            <button id="session-increment" onClick={()=>this.increment("session")}>+</button>
          </div>
          
          <div id="timer-label">{this.state.current_time}</div>
          <div id="time-left">{this.state.time_left}</div>
          <button id="start_stop" onClick={this.timer_function}>Start/Stop</button>
          <button id="reset" onClick={this.reset}>Reset</button>
        </div>
        
      </div>
    );
  }
  
}

ReactDOM.render(<Timer />, document.getElementById("app"));

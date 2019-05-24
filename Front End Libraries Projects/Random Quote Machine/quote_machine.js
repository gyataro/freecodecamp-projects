var quoteGLOBAL;

//Requests for another code, animate quotes and change background
$("#new-quote").click(function(){
  $("#text").fadeOut();
  $("#author").fadeOut();
  setTimeout(function(){
    $.getJSON('https://favqs.com/api/qotd', function(data) {
    quoteGLOBAL = data.quote.body;
    var text = `<sup><i class="fas fa-quote-left"></i></sup>  <i>${data.quote.body}</i><br><br>`
    var author = `- ${data.quote.author}`
    $("#text").html(text);
    $("#author").html(author);
    $("#text").fadeIn("slow");
    $("#author").fadeIn("slow");
    tweetQuote();
    granimInstance.changeState(getRndInteger(1, 3));    
    });
  }, 100);
});

//Get random number in range, both min and max included
function getRndInteger(min, max) {
  var gradSelect = Math.floor(Math.random() * (max - min + 1) ) + min;
  var gradSelectOutput = gradSelect.toString() + "-state";
  return gradSelectOutput;
}

//Background gradients
var granimInstance = new Granim({
    element: '.gradientBG',
    name: 'interactive-gradient',
    elToSetClassOn: '.gradientBG',
    direction: 'diagonal',
    isPausedWhenNotInView: true,
    stateTransitionSpeed: 500,
    states : {
        "default-state": {
            gradients: [
                ['#B3FFAB', '#12FFF7'],
            ],
            loop: false
        },
        "1-state": {
            gradients: [
                ['#4776E6', '#8E54E9'],
            ],
            loop: false
        },
        "2-state": {
            gradients: [ ['#FF4E50', '#F9D423'] ],
            loop: false
        }
    }
});

//Copies quote in API JSON data to clipboard
function copyQuoteToClipboard(){
    var tempElement = document.createElement("input");
    document.body.appendChild(tempElement);
    tempElement.setAttribute('value', quoteGLOBAL);
    tempElement.select();
    document.execCommand("copy");
    document.body.removeChild(tempElement);
}

//Assigns quote to tweet
function tweetQuote(){
    $("#tweet-quote").attr("href","https://twitter.com/intent/tweet?text=" + quoteGLOBAL + " %23quotes");
}







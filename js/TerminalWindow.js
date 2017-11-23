var TerminalWindow = (function (){

  var currentDirectory = '';
  var currentPrompt = 'toms-terminal:' + currentDirectory + '$';
  var mainObj = this;
  var blink = false;
  var focused = false;

var blinkCursor = function (){
    setTimeout(function () {
      if (blink && focused) {
        console.log(inputField.onfocus)
        mainObj.cursor.style.display = mainObj.cursor.style.display === 'none' ? 'inline' : 'none'
        blinkCursor();
      } else {
        mainObj.cursor.style.display = 'none';
      }
    }, 500);
  }

  var fileSystem = [
    'justFile.txt',
    'something_cool.txt',
    {directory1: 'nestedFile'}
  ];

  var functionObject = {
    help: (function(output){
      output.innerHTML= "Currently working commands are: <br><br>" + (Object.keys(functionObject)).join("<br>");
    }),
    ls: function(output){
      let items = '';
      for(var i in fileSystem){
        if (typeof fileSystem[i] === 'object') {
          items += Object.keys(fileSystem[i]) + '<br>';
        } else {
          items += fileSystem[i] + '<br>';
        }
      }
      output.innerHTML = items;
    },
    pwd: function(output){
      output.innerHTML= '/' + currentDirectory;
    },
    clear: function(){
      mainObj.results.innerHTML= '';
    },
    toggle: function(){
      if (mainObj.main.style.background === 'black') {
        mainObj.setBackgroundColor('white');
        mainObj.setFontColor('black');
        mainObj.cursor.style.background = 'black';
      } else {
        mainObj.setBackgroundColor('black');
        mainObj.setFontColor('white');
        mainObj.cursor.style.background = 'white';
      }
    },
    blink: function(){
      blink = blink === true ? false : true;
      blinkCursor();
    },
    echo: function(output, input){
      input.shift();
      let outputStr = input.join(" ");
      output.innerHTML = outputStr;
    },
    touch: function(output, input){
      console.log(input.length);
      if (input.length !== 2) {
        output.innerHTML = "Invalid filename";
      } else {
        fileSystem.push(input[1]);
      }
    },
    rm: function(output, input){
      if (input.length !== 2 || fileSystem.indexOf(input[1]) === -1) {
        output.innerHTML = "Invalid filename";
      } else {
        let index = fileSystem.indexOf(input[1]);
        fileSystem.splice(index, 1);
      }
    }
  };

  this.main = document.createElement('div');
  this.main.className = 'Terminal';


  this.innerWindow = document.createElement('div');
  this.innerWindow.className = 'innerWindow';
  this.results = document.createElement('div');
  this.results.innerHTML = 'Welcome to the terminal window. <br> Please type "help" for a list of commands. <br><br>'
  this.prompt = document.createElement('span');
  this.cursor = document.createElement('span');
  this.cursor.innerHTML = 'i';
  this.input = document.createElement('span');

  var inputField = document.createElement('input');
  inputField.style.opacity = '0';

  this.innerWindow.style.padding = '10px';

  this.prompt.innerHTML = currentPrompt;



  this.innerWindow.appendChild(this.results);
  this.innerWindow.appendChild(this.prompt);
  this.innerWindow.appendChild(this.input);
  this.innerWindow.appendChild(this.cursor);
  this.innerWindow.appendChild(inputField);

  this.main.appendChild(this.innerWindow);
  blinkCursor();


  inputField.onblur = function() {
    focused = false;
    mainObj.cursor.style.display = 'none'
  }

  inputField.onfocus = function() {
    focused = true;
    inputField.value = mainObj.input.textContent
    mainObj.cursor.style.display = 'inline'
  }

  this.main.onclick = function() {
    inputField.focus()
  }


  inputField.onkeydown = function(e) {
    if (e.which === 37 || e.which === 39 || e.which === 38 || e.which === 40 || e.which === 9) {
      e.preventDefault()
    } else if (e.which !== 13) {
      setTimeout(function() {
        mainObj.input.textContent = inputField.value
      }, 1)
    }
  }

  inputField.onkeyup = function(e) {
    if (e.which === 13) {
        let inputValue = inputField.value;
        let splitStr = inputValue.split(" ");

        var newResult = document.createElement('pre')
  			newResult.innerHTML = currentPrompt + inputValue;
  			mainObj.results.appendChild(newResult);
        inputField.value = "";
        mainObj.input.textContent = "";

        checkFunction(splitStr);
        scrollDown();
      }
  }

  checkFunction = function(input) {
    var newOutput = document.createElement('pre');
    functionObject[input[0]] ? functionObject[input[0]](newOutput, input) : returnError(newOutput, input);

    mainObj.results.appendChild(newOutput);
  }

  returnError = function(output, input){
    if (input[0] !== "") {
      output.innerHTML = '-bash: ' + input + ': command not found';
      mainObj.results.appendChild(output);
    }
  }

  scrollDown = function(){
    mainObj.main.scrollTop = mainObj.main.scrollHeight;
  }

  Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    console.log(s);
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

  this.setWidth = function(width){
    this.main.style.width = width;
  }
  this.setHeight = function(height){
    this.main.style.height = height;
  }
  this.setBackgroundColor = function(color){
    this.main.style.background = color;
  }
  this.setFontColor = function(color){
    this.main.style.color = color;
    this.cursor.style.background = color;
  }

  this.main.style.fontFamily = 'monospace', 'Monaco, Courier';
  this.main.style.fontSize = '12px';
  mainObj.cursor.style.display = 'none';
})

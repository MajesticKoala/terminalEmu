var TerminalWindow = (function (){

  var currentDirectory = '';
  var currentPrompt = 'toms-terminal:' + currentDirectory + '$';
  var mainObj = this;

  var fileSystem = {
    file1: '1stfile',
    file2: 'filfhfh',
    file3: 'xfthfxt',
    file4: 'rurssh',
    directory1: {
      nestedFile: 'nestedFile'
    },
  };

  var functionObject = {
    help: (function(output){
      output.innerHTML= "Currently working commands are: <br>ls: list all files and directories in current working directory <br>pwd: print working directory <br>clear: Clears terminal window";
    }),
    ls: function(output){
      let items = '';
      let fileItems = Object.keys(fileSystem);
      for(var i in fileItems){
          items += fileItems[i] + '<br>';
      }
      output.innerHTML = items;
    },
    pwd: function(output){
      output.innerHTML= '/' + currentDirectory;
    },
    clear: function(){
      mainObj.results.innerHTML= '';
    }
  };

  this.main = document.createElement('div');
  this.main.className = 'Terminal';


  this.innerWindow = document.createElement('div');
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

  this.cursor.style.background = 'white';

  this.innerWindow.appendChild(this.results);
  this.innerWindow.appendChild(this.prompt);
  this.innerWindow.appendChild(this.input);
  this.innerWindow.appendChild(this.cursor);
  this.innerWindow.appendChild(inputField);

  this.main.appendChild(this.innerWindow);

  inputField.onblur = function() {
    mainObj.cursor.style.display = 'none'
  }

  inputField.onfocus = function() {
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
      var newResult = document.createElement('pre')
			newResult.innerHTML = currentPrompt + inputValue;
			mainObj.results.appendChild(newResult);
      inputField.value = "";
      mainObj.input.textContent = "";

      checkFunction(inputValue);
    }
  }

  checkFunction = function(input) {
    var newOutput = document.createElement('pre');
    if (functionObject[input]) {
      functionObject[input](newOutput);
      mainObj.results.appendChild(newOutput);
    } else {
      newOutput.innerHTML = '-bash: ' + input + ': command not found';
      mainObj.results.appendChild(newOutput);
    }
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



  this.main.style.color = 'white';
  this.main.style.fontFamily = 'monospace', 'Monaco, Courier';
  this.main.style.fontSize = '12px';
  mainObj.cursor.style.display = 'none'

})

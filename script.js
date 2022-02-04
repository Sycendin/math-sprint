// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
// store player guess from right and wrong guesses
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';
// Scroll
let valueY = 0;

// Refresh splash page best scores
const bestScoresToDOM = () =>{
  bestScores.forEach((bestScore, index) =>{
    const bestScoreEL = bestScore;
    bestScoreEL.textContent = `${bestScoreArray[index].bestScore}s`
  });
}
// Check local storage for best scores and set it
const getSavedBestScores = () =>{
  if (localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores);
  }
  else{
    bestScoreArray = [
      {questions: 10, bestScore: finalTimeDisplay},
      {questions: 25, bestScore: finalTimeDisplay},
      {questions: 50, bestScore: finalTimeDisplay},
      {questions: 99, bestScore: finalTimeDisplay}
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  // Set best scores to dom
  bestScoresToDOM();
}

// Update best score array
const updateBestScore = () =>{
  bestScoreArray.forEach((score, index) =>{
    // Select the correct best score to update
    if (questionAmount == score.questions){
      // return the best score as a number with 1 decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      //  update if  the new final score is less than or replacing 0
      if (savedBestScore === 0 || savedBestScore > finalTime){
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  })
  // Update splash page
  bestScoresToDOM();
  // Save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}
//Reset Game
const playAgain = () =>{
  
  gamePage.addEventListener('click',startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = []
  playerGuessArray = []
  valueY = 0;
  playAgainBtn.hidden = true;

}

// Show score page
const showScorePage = () =>{
  //  show play again button after one second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}
// Format and display time in DOM to 1 decimal
const scoresToDom=()=>{
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent =`Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`
  finalTimeEl.textContent = `${finalTimeDisplay}s`
  // Update scores
  updateBestScore();
  // Scroll back to the top
  itemContainer.scrollTo({top: 0, behavior: "instant"});
  showScorePage();
}
// Stop timeer and process results then go to score page
const checkTime = () =>{
  if(playerGuessArray.length == questionAmount){
    clearInterval(timer);
    equationsArray.forEach((equation, index)=>{
      console.log(equation.evaluated === playerGuessArray[index])
      if (equation.evaluated === playerGuessArray[index]){

      }
      else{
        penaltyTime += 0.5;
      }
      
    });
    finalTime = timePlayed + penaltyTime;
    scoresToDom();
  
  }
}
// Add tenth of a second to timePlayed
const addTime = ()=>{
  timePlayed += 0.1;
  checkTime();
}
//Start timer when game page is clicked
const startTimer = () =>{
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  // remove event listener after it is first run
  gamePage.removeEventListener('click', startTimer);
}
// Scroll and store user selection in playerGuessArray

const select = (guessedTrue) =>{
  
  //Scroll 80px
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add guess to playerguessarray
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false')
}
// Display game page 
const showGamePage= () =>{
  gamePage.hidden = false;
  countdownPage.hidden = true;
}
// Get a random number up to a max number
const getRandomInt = (max) =>{
  return Math.floor(Math.random() * Math.floor(max));
}
// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  // call shuffle from shuffle.js to randomly shuffle array
  shuffle(equationsArray);

}

//Add equations to DOM
const equationsToDOM = () =>{
  equationsArray.forEach((equation)=>{
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation text
    const equationText = document.createElement('h1')
    equationText.textContent = equation.value
    //Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);

  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
  
}

//Get value from selected radio button
const getRadioValue = () =>{
  let radioValue;
  radioInputs.forEach((radioInput)=>{

    if(radioInput.checked){

      radioValue = radioInput.value;
      
    }
  })
  return radioValue;
}
// Show countdown counting down
const countdownStart = () =>{
  let count = 3;
  countdown.textContent = count
  const timeCountDown = setInterval(() => {
    count --;
    if (count === 0 ){
      countdown.textContent = 'GO!'
    }
    else if (count === -1){
      showGamePage();
      clearInterval(timeCountDown);
    } 
    else {
      countdown.textContent = count
    } 
  }, 1000);
  // setTimeout(() => {  countdown.textContent = '2'  }, 1000);
  // setTimeout(() => { countdown.textContent = '1' }, 2000);
  // setTimeout(() => {  countdown.textContent = 'GO!'}, 3000);
}
// Show countdown page after user selects level on splash page
const showCountdown = () =>{
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
  
}

// Form that decides the amount of questions
const selectQuestionAmount = (e) =>{
  e.preventDefault();
  questionAmount =getRadioValue();
  questionAmount !== undefined ? showCountdown() : '';
}

startForm.addEventListener('click', () =>{
  radioContainers.forEach((radioEl)=>{
    // Remove label styling
    radioEl.classList.remove('selected-label')
    // Add it back if the radio input is checked
    if (radioEl.children[1].checked){
      radioEl.classList.add('selected-label')
    }
  })
});

//Event listeners

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click',startTimer);

// On page load
getSavedBestScores()
const gameContainer = document.getElementById("game");
let firstClickedDiv = null;
let secondClickedDiv = null; 
let matchedCardsCount = 0;
let guessCount = 0;
let stopClicking = false;
let gameComplete = false;
let userName = null; 
let divClickedList = document.querySelectorAll('div.clicked')

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    
    //set data attribute to color && matched to false
    newDiv.setAttribute('color', color)
    newDiv.setAttribute('matched', false)

    
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
const colorBankObj = {
  red:    {hex: '#FF0000', matched: null, num: 0},
  blue:   {hex:'#0000FF', matched: null, num: 0},
  green:  {hex: '#00FF00', matched: null, num: 0},
  purple: {hex: '#A020F0', matched: null, num: 0}, 
  orange: {hex: '#FFA500', matched: null, num: 0 },
  defaultBg: '#ededf3',
  primaryBtnCol: '#74709e',
  clickedArr:[]
}

function resetDiv (...divParam) {
  for (let div of [...divParam]){
    setTimeout(() => {
      div.style.backgroundColor = colorBankObj.primaryBtnCol || '#74709e';
          div.classList.remove('clicked');
          firstClickedDiv = null;
          secondClickedDiv = null;
          stopClicking = false;
        }, 1000);
  }
}

function matchedDiv (div1, div2) {
  for (let div of [div1, div2]){
      div.setAttribute('matched', true);
      div.classList.remove('clicked');
      div.removeEventListener('click', handleCardClick)
    }
    firstClickedDiv = null;
    secondClickedDiv = null;
    matchedCardsCount += 2;
    matchedDiv.innerText = matchedCardsCount 
    stopClicking = false;
  }
  
  function handleCardClick (event) {
    guessCount++;
    if (stopClicking) return;
    if (event.target.classList.contains('clicked')) return; 
    
    let lastClickedCard = event.target;
    lastClickedCard.style.backgroundColor = lastClickedCard.classList[0];
    lastClickedCard.classList.add('clicked');
    divClickedList.length >= 2 ? stopClicking = true : stopClicking = false; 
    if (!stopClicking){   
      if (!firstClickedDiv || !secondClickedDiv){
        firstClickedDiv = firstClickedDiv || lastClickedCard;
        lastClickedCard ===  firstClickedDiv ? secondClickedDiv = null : secondClickedDiv = lastClickedCard;
    }
    
    if (firstClickedDiv && secondClickedDiv){
      stopClicking = true;
      // firstClickedDiv.className === secondClickedDiv.className ? 
      //   matchedDiv (firstClickedDiv, lastClickedCard) 
      // : 
      //   resetDiv(firstClickedDiv, secondClickedDiv);
      if (firstClickedDiv.className !== secondClickedDiv.className) 
        resetDiv(firstClickedDiv, secondClickedDiv);
      if (firstClickedDiv.className === secondClickedDiv.className){
        matchedDiv (firstClickedDiv, lastClickedCard);
      } 
    }
    updateScore()
  }
  
  if (matchedCardsCount === COLORS.length) {
    alert (' ALL CARDS MATCHED');
    gameComplete = true;
      saveScore();
    }
  }

  let newScore = document.querySelector('h1.score.guessCount')
  let matchCount = document.querySelector('h3.score.matchedCount')
  
  function updateScore () {
    newScore.innerText = `your score is ${guessCount}`;
    matchCount.innerText = `matched cards: ${matchedCardsCount}`
  }
  
  function saveScore () {
    if (gameComplete)
    {localStorage.setItem(`${userName}${guessCount}`, JSON.stringify({
    userName: userName,
    guessCount : guessCount,
    matchedCardsCount : matchedCardsCount 
  }))}
  }
  // when the DOM loads
createDivsForColors(shuffledColors);
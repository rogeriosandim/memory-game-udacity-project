// Global variables 
const clock = document.querySelector('.clock');
const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart');
const cardsOnDeck = document.querySelectorAll('.card');
const listOfCards = [...cardsOnDeck];

let scored = document.getElementsByClassName('scored');
let timer;
let startGame = false;

let cardsOpened = [];
let moves = 0;
let totalTimePlayed;

// This function is responsible to check if a method is iterative.
function isInteractive(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let card = {
// This method is responsible to remove or add classes on a card that has been selected.
    toggle(cardsSelected, classes) {
        if (isInteractive(cardsSelected)) {
            cardsSelected.forEach(cardSelected => {
                classes.forEach(classy => {
                    cardSelected.classList.toggle(classy);
                });
            });
        } else {
            classes.forEach(classy => {
                cardsSelected.classList.toggle(classy);
            });
        }
        gameServices.checkCards();
    }
};

const gameServices = {
// This method is responsible to start the clock
    clockStart() {
        let clockStart = new Date().getTime();
        timer = setInterval(function () {
            var now = new Date().getTime();
            var lapse = now - clockStart;

// Calculation the minutes and seconds.
            let minutes = Math.floor((lapse % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((lapse % (1000 * 60)) / 1000);

// Add 0 on the left once seconds and minutes are less than 10.
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }

            let currentTime = minutes + ":" + seconds;

            clock.innerHTML = currentTime;
        }, 750);
    },

// This method is responsible to increment movements once you select 2 cards.
    checkCards() {
        cardsOpened = document.querySelectorAll('.open');
        if (cardsOpened.length === 2) {
            moves++;
            this.updateScore();
            this.matchedCards();
        }
    },

// This method is responsible to check if two cards are a match.
    matchedCards() {
        let openCard = cardsOpened;
        const isMatch = cardsOpened[0].isEqualNode(openCard[1]);
        if (isMatch) {
            card.toggle(cardsOpened, ['open', 'match']);
        } else {
            totalTimePlayed = setTimeout(() => {
                card.toggle(openCard, ['unmatch', 'show']);
            }, 1000);
            card.toggle(cardsOpened, ['unmatch', 'open']);
        }
    },

// This method is responsible to define your score based on movements.
    updateScore() {
        const excellentScore = 12;
        const movesElement = document.querySelector('.moves');
        movesElement.innerHTML = moves;

        if (moves % excellentScore === 0 && moves !== 0 && scored.length > 2) {
            scored[scored.length - scored.length].classList.remove('scored');
            scored[scored.length - 1].classList.remove('scored');
        }
        if (moves === 30 && scored.length === 2) {
            scored[scored.length - scored.length].classList.remove('scored');
            scored[scored.length - 1].classList.remove('scored');
        }
    }
};

const inGameActions = {
// This method is responsible to suffle the cards.
    shuffleCards() {
        clock.innerHTML = "00:00";
        const cardsShuffled = shuffle(listOfCards);
        deck.innerHTML = '';
        gameServices.updateScore();
        cardsShuffled.forEach(element => {
            deck.appendChild(element);
        });
    },

// This method is responsible to iniciate the game once you click in any card.    
    initiateGame() {
        deck.addEventListener('click', event => {
            if (!startGame) {
                gameServices.clockStart();
                startGame = true;
            }
            selectedCard = event.target;
            if (selectedCard.nodeName == 'LI') {
                openedCard = selectedCard.className.includes('open');
                matchedCard = selectedCard.className.includes('match');
                if (!openedCard && !matchedCard) {
                    card.toggle(selectedCard, ['open', 'show']);
                    this.endGame();
                }
            }
        });
    },

// This method is responsible to restart the moves, the time and the score.
    restartGame() {
        const numberOfStars = document.getElementsByClassName('fa-star');
        moves = 0;
        startGame = false;
        clearInterval(timer);
        clearTimeout(totalTimePlayed);
        cardsOnDeck.forEach(card => {
            card.className = 'card';
        });
        for (let star of numberOfStars) {
            star.classList.add('scored');
        }
        inGameActions.shuffleCards();
    },

// This method is responsible to check if all the matches were found.
    endGame() {
        const matchedCards = document.getElementsByClassName('match');
// In case you found all the matches you will the game. 
        if (matchedCards.length === 16) {
            clearInterval(timer);
            showScore({
                resultTitle: 'CONGRATULATIONS!',
                classTitle: 'winning',
                resultMessage: 'You could find all the matches!'
            })
        }
// In case that moves are iqual to 30 the game is over.
        if (moves === 30) {
            clearInterval(timer);
            showScore({
                resultTitle: 'GAME OVER!',
                classTitle: 'game-over',
                resultMessage: 'You could not find all the matches!'
            })
        }
    }
};

// Global variables for the score result modal.
const result = document.querySelector('.result');
const title = result.querySelector('.title');
const message = result.querySelector('.message');
const movesScore = result.querySelector('.moves-score');
const timerScore = result.querySelector('.timer-score');
const restartButton = result.querySelector('.button');

// this function is responsible to show the score result modal.
function showScore({ resultTitle, classTitle, resultMessage }) {
    result.classList.add('show');
    title.innerHTML = resultTitle;
    title.classList = classTitle;
    message.innerHTML = resultMessage;
    movesScore.innerHTML = moves;
    timerScore.innerHTML = clock.innerHTML;
    restartButton.addEventListener('click', event => {
        result.classList.remove('show');
        inGameActions.restartGame();
    });
}

inGameActions.shuffleCards();
inGameActions.initiateGame();

restart.addEventListener('click', inGameActions.restartGame);
const clock = document.querySelector('.clock');
const deck = document.querySelector('.deck');
const restart = document.querySelector('.restart');
const cardsOnDeck = document.querySelector('.card');
const listOfCards = [...cardsOnDeck];

let scored = document.getElementsByClassName('scored');
let timer;
let startGame = false;

let cardsOpened = [];
let moves = 0;
let totalTimePlayed;

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
    toggle(cardsSelected, classes) {
        if (isInteractive(cardsSelected)) {
            cardsSelected.forEach(cardSelected => {
                classes.forEach(classy => {
                    cardSelected.classList.toggle(classy);
                });
            });
        } else {
            classes.forEach(classy => {
                cardSelected.classList.toggle(classy);
            });
        }
        gameServices.checkCards();
    }
};

const gameServices = {
    clockStart() {
        let clockStart = new Date().getTime();
        timer = setInterval(function () {
            var now = new Date().getTime();
            var lapse = now - clockStart;

            let minutes = Math.floor((lapse % 60));
            let seconds = Math.floor((lapse % 60));

            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            let currentTime = minutes + ":" + seconds;
            clock.innerHTML = currentTime;
        }, 750);
    },

    checkCards() {
        cardsOpened = document.querySelectorAll('.opened');
        if (cardsOpened.length === 2) {
            moves++;
            this.matchedCards();
            this.updateScore();
        }
    },

    matchedCards() {
        let openCard = cardsOpened;
        const isMatch = cardsOpened[0].isEqualNode(openCard[1]);
        if (isMatch) {
            card.toggle(cardsOpened, ['open', 'match']);
        } else {
            totalTimePlayed = setTimeout(() => {
                card.toggle(cardsOpened, ['unmatch', 'show']);
            }, 1000);
            card.toggle(cardsOpened, ['unmatch', 'show']);
        }
    },

    updateScore() {
        const excellentScore = 16;
        const movesElement = document.querySelector('.moves');
        movesElement.innerHTML = moves;

        if (moves % excellentScore === 0 && moves !== 0 && starsScored.length > 2) {
            starsScored[starsScored.length - starsScored.length].classList.remove('scored');
            starsScored[starsScored.length - 1].classList.remove('scored');
        }
    }
};

const inGameActions = {
    shuffleCards() {
        const cardsShuffled = shuffle(listOfCards);
        deck.innerHTML = '';
        gameServices.updateScore();
        cardsShuffled.forEach(element => {
            deck.appendChild(element);
        });
    },

    initiateGame() {
        clock.innerHTML = "00:00"
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

    endGame() {
        const matchedCards = document.getElementsByClassName('match');
        if (matchedCards.length === 16) {
            clearInterval(timer);
        }
    },

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
    }
}
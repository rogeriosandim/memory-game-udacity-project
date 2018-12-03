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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

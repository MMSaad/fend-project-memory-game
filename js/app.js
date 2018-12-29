window.onload = function(){

console.log("Document ready");

/*
 * Create a list that holds all of your cards
 */
var moves = 0;
var cards = [];
var openCards = [];
var cardTypes = ["diamond","paper-plane-o","anchor","bolt","cube","leaf","bicycle","bomb"];


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
const deck = document.querySelector(".deck");
const movesSpan = document.querySelector(".moves");
const starsScore = document.querySelector('.stars');
document.querySelector('.restart').addEventListener('click',startGame);


function startGame(){
    moves = 0;
    let looper = 0;
cards = [];
for(const type in cardTypes){
    
    for(let i =0 ;i<2;i++){    
        const newCard = {
            type:cardTypes[type],
            open:false,
            match:false,
            id:"card"+looper
        };
        //console.log(newCard);
        cards.push(newCard);
        looper++;
    }
}
cards = shuffle(cards);
renderDeck(cards);

}

function renderDeck(cards){
    while(deck.firstChild){
        deck.removeChild(deck.firstChild);
    }
    for(const card in cards){
        const item = document.createElement("li");
        item.classList.add("card");
        item.setAttribute("id",cards[card].id);
        const icon = document.createElement("i");
        icon.classList.add("fa");
        icon.classList.add("fa-"+cards[card].type);
        item.appendChild(icon);
        item.addEventListener("click",cardClicked,true);
        deck.appendChild(item);
    }
    updateMoves();
}

startGame();






function cardClicked(e){
    //To ignore clicks of non cards
    if(!e.target.classList.contains('card')){
        return;
    }
    console.log(e.target.classList);
    var cardElement = document.querySelector("#"+e.target.id);
    if(cardElement.classList.contains("match") || cardElement.classList.contains("open")){
        return;
    }
    var card = _.find(cards,function(c){ return c.id == e.target.id});
    if(card == undefined || card.match === true){
        return;
    }

    //Valid Mov;
    moves++;
    updateMoves();
    

    

    if(openCards.length == 2){
        for(const i in openCards){
            let openCard = openCards[i];
            openCard.classList.remove("show");
            openCard.classList.remove("open");
        }
        openCards = [];
    }
    if(openCards.length == 1){
        var otherCard = _.find(cards,function(c){
            return c.id == openCards[0].id;
        });
        console.log(otherCard);
        if(otherCard.type == card.type){
            card.match = true;
            otherCard.match = true;
            openCards[0].classList.add("match");
            cardElement.classList.add("match");
            openCards = [];
            checkGameFinished();
            return;
        }
    }
    if(openCards.length <2){
        
        cardElement.classList.add("show");
        cardElement.classList.add("open");
        openCards.push(cardElement);
    }
    
}

function updateMoves(){
    movesSpan.innerText = moves;
    updateStarsScore();
}

function updateStarsScore(){
    let solvedItemsCount = _.filter(cards,function(c){
        return c.match == true
    }).length;
    let stars = 3;
    const percentage = (solvedItemsCount+16)/moves;
    console.log(percentage);
    
    if(percentage < 0.75){
        stars = 2;
    }
    if(percentage < 0.5){
        stars = 1;
    }
    

    updateStartsUi(stars);
}

function updateStartsUi(stars){
    while(starsScore.firstChild){
        starsScore.removeChild(starsScore.firstChild);
    }
    for(var i=0;i<stars;i++){
        //<li><i class="fa fa-star"></i></li>
        const child = document.createElement('li');
        const star = document.createElement('i');
        star.classList.add('fa');
        star.classList.add('fa-star');
        child.appendChild(star);
        starsScore.appendChild(child);
    }
}


function checkGameFinished(){
    var remainingCards = _.filter(cards,function(c){
        return c.match == false
    });
    if(remainingCards.length == 0){
        //Game is Finished
        console.log("Game is Finished");
    }
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


};
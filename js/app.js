window.onload = function(){

console.log("Document ready");

/*
 * Create a list that holds all of your cards
 */
var cards = [];
var openCards = [];
var cardTypes = ["diamond","paper-plane-o","anchor","bolt","cube","leaf","bicycle","bomb"];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
let looper = 0;
console.log(cardTypes);
for(const type in cardTypes){
    for(let i =0 ;i<2;i++){    
        const newCard = {
            type:cardTypes[type],
            open:false,
            match:false,
            id:"card"+looper
        };
        console.log(newCard);
        cards.push(newCard);
        looper++;
    }
}
cards = shuffle(cards);
const deck = document.querySelector(".deck");

/* <li class="card match">
<i class="fa fa-bomb"></i>
</li>
<li class="card open show">
<i class="fa fa-bolt"></i>
</li> */

for(const card in cards){
    console.log(cards[card]);
    const item = document.createElement("li");
    item.classList.add("card");
    item.setAttribute("id",cards[card].id);
    const icon = document.createElement("i");
    icon.classList.add("fa");
    icon.classList.add("fa-"+cards[card].type);
    item.appendChild(icon);
    item.addEventListener("click",cardClicked);
    deck.appendChild(item);
}

function cardClicked(e){
    console.log(e.target.id);
    var card = document.querySelector("#"+e.target.id);
    if(openCards.length <2){
        
        card.classList.add("show");
        card.classList.add("open");
        openCards.push(card);
    }
    if(openCards.length ==2){
        setTimeout(function(){
            console.log("Close them");
        },500);
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
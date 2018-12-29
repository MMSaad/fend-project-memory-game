window.onload = function () {

    /***
     * Create Game object
     */
    var game = {
        /**
         * Player current game moves
         */
        moves: 0,

        /**
         * Deck cards
         */
        cards: [],

        /**
         * Deck open cards
         */
        openCards: [],

        /**
         * Game cards types
         */
        cardTypes: ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"]
    };

    /***
     * UI Element references
     */
    const deck = document.querySelector(".deck");
    const movesSpan = document.querySelector(".moves");
    const starsScore = document.querySelector('.stars');
    document.querySelector('.restart').addEventListener('click', game.start);

    /*
     * Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page
     */


    /**
     * Game start/restart
     */
    game.start = function () {
        //Reset game moves
        game.moves = 0;

        //reset game cards
        game.cards = [];

        let looper = 0;
        
        for (const type in game.cardTypes) {

            for (let i = 0; i < 2; i++) {
                const newCard = {
                    type: game.cardTypes[type],
                    open: false,
                    match: false,
                    id: "card" + looper
                };
                game.cards.push(newCard);
                looper++;
            }
        }
        game.cards = _.shuffle(game.cards);
        game.renderDeck(game.cards);
    };



    /**
     * Render Deck UI Cards
     * @param {any} cards Game Cards
     */
    game.renderDeck = function (cards) {

        //Clear old cards
        while (deck.firstChild) {
            deck.removeChild(deck.firstChild);
        }

        //Render game cards
        for (const card in game.cards) {

            // Create card icon based on card type
            const cardIcon = document.createElement("i");
            cardIcon.classList.add("fa");
            cardIcon.classList.add("fa-" + cards[card].type);

            //Create card element
            const cardElement = document.createElement("li");
            cardElement.classList.add("card");
            cardElement.setAttribute("id", cards[card].id);
            cardElement.appendChild(cardIcon);

            //Handle card click listener
            cardElement.addEventListener("click", game.cardClicked, true);

            //Append card to deck
            deck.appendChild(cardElement);
        }
        game.updateMoves();
    };

    /***
     * Update Game player moves
     */
    game.updateMoves = function () {
        movesSpan.innerText = game.moves;
        game.updateStarsScore();
    };

    /***
     * Update player score rating
     */
    game.updateStarsScore = function () {
        let solvedItemsCount = _.filter(game.cards, function (c) {
            return c.match == true
        }).length;
        let stars = 3;
        const percentage = (solvedItemsCount + 16) / game.moves;
        console.log(percentage);

        if (percentage < 0.75) {
            stars = 2;
        }
        if (percentage < 0.5) {
            stars = 1;
        }
        game.updateStartsUi(stars);
    }

    /**
     * Update Play score rating UI
     * @param {any} stars Current calculated stars based on player moves
     */
    game.updateStartsUi = function (stars) {
        while (starsScore.firstChild) {
            starsScore.removeChild(starsScore.firstChild);
        }
        for (var i = 0; i < stars; i++) {
            const child = document.createElement('li');
            const star = document.createElement('i');
            star.classList.add('fa');
            star.classList.add('fa-star');
            child.appendChild(star);
            starsScore.appendChild(child);
        }
    };

    /**
     * Check if game finished
     * show popup to congrate the player with option to restart the game
     */
    game.checkGameFinished = function () {
        var remainingCards = _.filter(game.cards,
            function (c) {
                return c.match == false
            });
        if (remainingCards.length == 0) {
            //Game is Finished
            console.log("Game is Finished");
        }
    };

    /**
     * Add Player move
     */
    game.addMove = function() {
        game.moves++;
        game.updateMoves();
    }

    game.cardClicked = function(e) {

        //To ignore clicks of non cards
        if (!e.target.classList.contains('card')) {
            return;
        }

        var cardElement = document.querySelector("#" + e.target.id);
        //ignore clicks on matched or open cards
        if (cardElement.classList.contains("match") || cardElement.classList.contains("open")) {
            return;
        }

        var card = _.find(game.cards, function (c) { return c.id == e.target.id });
        if (card == undefined || card.match === true) {
            return;
        }

        //Update play game moves
        game.addMove();
        game.updateMoves();




        if (game.openCards.length == 2) {
            for (const i in game.openCards) {
                let openCard = game.openCards[i];
                openCard.classList.remove("show");
                openCard.classList.remove("open");
            }
            game.openCards = [];
        }


        if (game.openCards.length == 1) {
            var otherCard = _.find(game.cards, function (c) {
                return c.id == game.openCards[0].id;
            });
            console.log(otherCard);
            if (otherCard.type == card.type) {
                card.match = true;
                otherCard.match = true;
                game.openCards[0].classList.add("match");
                cardElement.classList.add("match");
                game.openCards = [];
                game.checkGameFinished();
                return;
            }
        }
        if (game.openCards.length < 2) {
            cardElement.classList.add("show");
            cardElement.classList.add("open");
            game.openCards.push(cardElement);
        }

    }


    game.start();






    


    


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
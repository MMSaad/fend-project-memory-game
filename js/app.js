window.onload = function () {

    /***
     * UI Element references
     */
    const deck = document.querySelector(".deck");
    const movesSpan = document.querySelector(".moves");
    const starsScore = document.querySelector(".stars");
    const modal = document.getElementById("myModal");
    const stats = document.getElementById("stats");
    const timer = document.querySelector(".timer");



    //Sound files
    const clap = document.getElementById("clap");
    const tada = document.getElementById("tada");
    const fail = document.getElementById("fail");
    const winner = document.getElementById("winner");

    //Load sound files
    clap.load();
    tada.load();
    fail.load();
    winner.load();


    /***
     * Create Game object
     */
    const  game = {
        /**
         * Player current game moves
         */
        moves: 0,

        /**
         * Player score stars
         */
        stars: 0,

        /**
         * Deck cards
         */
        cards: [],

        /**
         * Deck open cards
         */
        openCards: [],

        /**
         * Does game is running or not
         */
        running: false,

        /**
         * Game Elapsed time
         */
        startDate: undefined,

        /**
         * Timer Handler/Id to clear interval function
         */
        timerHandler: undefined,

        /**
         * Game cards types
         */
        cardTypes: ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"]
    };

    /**
     * Reset the game
     */
    game.restart = function () {
        toggleModal();
        game.start();
    };

    /**
     * Game start
     */
    game.start = function () {



        timer.innerHTML = "00:00";
        game.running = true;
        game.startDate = moment.now();

        //Reset game moves
        game.moves = 0;
        game.updateMoves();
        //reset game cards
        game.cards = [];
        let iterator = 0;
        for (const cardType of game.cardTypes) {
            for (let i = 0; i < 2; i++) {
                const newCard = {
                    type: cardType,
                    open: false,
                    match: false,
                    id: `card${iterator}`
                };
                game.cards.push(newCard);
                iterator++;
            }
        }

        game.timerHandler = setInterval(game.timer, 1000, 1000);
        game.cards = _.shuffle(game.cards);
        game.renderDeck();
    };

    game.timer = function () {
        if (game.running === true) {
            const formattedDate = moment(moment.now() - game.startDate).format("mm:ss");
            timer.innerHTML = `${formattedDate}`;
        }
    };


    /**
     * Render Deck UI Cards
     * @param {any} cards Game Cards
     */
    game.renderDeck = function () {

        //Clear old cards
        while (deck.firstChild) {
            deck.removeChild(deck.firstChild);
        }

        //Render game cards
        for (const card of game.cards) {

            //Create card element
            const cardElement = document.createElement("li");
            
            //setup card element's classes
            cardElement.classList.add("card", "animated");

            //Add card icon
            cardElement.innerHTML = `<i class="fa fa-${card.type}" /> `;

            //Set element id to be used for access cards items
            cardElement.setAttribute("id", card.id);

            //Handle card click listener
            cardElement.addEventListener("click", game.cardClicked);

            //Append card to deck
            deck.appendChild(cardElement);
        }
        
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
        if(game.moves <= 10){
        game.stars = 3;
        }else if(game.moves <= 14){
            game.stars = 2
        }else{
            game.stars = 1;
        }
        game.updateStartsUi();
    }

    /**
     * Update Play score rating UI
     */
    game.updateStartsUi = function () {
        while (starsScore.firstChild) {
            starsScore.removeChild(starsScore.firstChild);
        }
        for (let i = 0; i < game.stars; i++) {
            const child = document.createElement("li");
            child.innerHTML = `<i class="fa fa-star" />`;
            starsScore.appendChild(child);
        }
    };

    /**
     * Check if game finished
     * show popup to congratulate the player with option to restart the game
     */
    game.checkGameFinished = function () {
        const remainingCards = _.filter(game.cards,
            function (c) {
                return c.match === false;
            });
        if (remainingCards.length === 0) {
            //Game is Finished
            game.running = false;


            //Stop timer
            window.clearInterval(game.timerHandler);


            const formtedDate = moment(moment.now() - game.startDate).format("mm:ss");
            stats.innerText = `With ${game.moves} Moves , ${formtedDate} time and ${game.stars} Stars`;
            toggleModal();
            winner.play();
        }
    };


    /**
     * Toggle Winner modal visibility
     */
    function toggleModal() {
        modal.classList.toggle("visible");
    }

    /**
     * Add Player"s game move
     */
    game.addMove = function () {
        game.moves++;
        game.updateMoves();
    };

    /**
     * On Deck card click
     * @param {any} e Card element
     */
    game.cardClicked = function (e) {

        //To ignore clicks of non cards
        if (!e.target.classList.contains("card")) {
            return;
        }

        const cardElement = e.target;

        //ignore clicks on matched or open cards
        if (cardElement.classList.contains("match") || cardElement.classList.contains("open")) {
            return;
        }

        //Check if card exists in cards array
        const card = _.find(game.cards, function (c) { return c.id === e.target.id });
        if (card == undefined || card.match === true) {
            return;
        }

       





        // if there"s one card open check if it"s match with new card
        if (game.openCards.length === 1) {


            // get other opened card
            const otherCard = _.find(game.cards, function (c) {
                return c.id === game.openCards[0].id;
            });
            if (otherCard.type === card.type) {
                card.match = true;
                otherCard.match = true;
                game.matchCardElements(game.openCards[0], cardElement);
                return;
            } else {
                game.unmatchCardElements(game.openCards[0], cardElement);
                return;
            }
        }

        // Show clicked card with animation
        cardElement.classList.add("show");
        cardElement.classList.add("open");
        cardElement.classList.toggle("flipInY");

        // Add clicked card to open cards array
        game.openCards.push(cardElement);

        // play clap sound
        clap.play();

    };

    /**
     * Hide unmatched cards with animation and sound
     * @param {any} firstCard the first - old - card
     * @param {any} secondCard the second - new - card
     */
    game.unmatchCardElements = function (firstCard, secondCard) {

        // mark second card visible
        secondCard.classList.add("show", "open");

        //Remove flip-in animation from first/old card
        firstCard.classList.remove("flipInY");

        // Shake both cards
        firstCard.classList.add("shake");
        secondCard.classList.add("shake");

        //hide both cards

        setTimeout(function() {
            firstCard.classList.remove("show", "open","shake");
            secondCard.classList.remove("show", "open","shake");
            },
            1000);

        game.openCards = [];
        fail.play();
         
         //Update play game moves
         game.addMove();
    };

    /**
     * Match two cards
     * @param {any} firstCard the first - old - card
     * @param {any} secondCard the second - new - card
     */
    game.matchCardElements = function (firstCard, secondCard) {

        //Set cards as matched
        firstCard.classList.add("match");
        secondCard.classList.add("match");

        //Remove old animation
        firstCard.classList.toggle("flipInY");

        //Add tada animation
        secondCard.classList.toggle("tada");
        firstCard.classList.toggle("tada");

        //reset open cards
        game.openCards = [];

        //play tada sound
        tada.play();

        //Update play game moves
        game.addMove();

        //check if game finished
        game.checkGameFinished();
    };


    //UI Event handlers
    document.querySelector(".restart").addEventListener("click", game.start);
    document.querySelector("#btn-play-again").addEventListener("click", game.restart);

    //Start the game
    game.start();


};


window.onload = function () {

    /***
     * Create Game object
     */
    let game = {
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
        running:false,

        /**
         * Game Elapsed time
         */
        startDate:undefined,

        /**
         * Timer Handler/Id to clear interval function
         */
        timerHandler:undefined,

        /**
         * Game cards types
         */
        cardTypes: ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'leaf', 'bicycle', 'bomb']
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

        

        timer.innerHTML='00:00';
        this.running = true;
        game.startDate = moment.now();

        //Reset game moves
        this.moves = 0;

        //reset game cards
        this.cards = [];

        let looper = 0;

        for (const type in this.cardTypes) {

            for (let i = 0; i < 2; i++) {
                const newCard = {
                    type: this.cardTypes[type],
                    open: false,
                    match: false,
                    id: 'card' + looper
                };
                this.cards.push(newCard);
                looper++;
            }
        }
        
       game.timerHandler = setInterval(game.timer,1000,1000);
        this.cards = _.shuffle(game.cards);
        game.renderDeck(game.cards);
    };

    game.timer = function(){
        if(game.running === true){
            const formtedDate = moment(moment.now()-game.startDate).format('mm:ss');
            timer.innerHTML =`${formtedDate}`;
        }
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
        for (const card in this.cards) {

            // Create card icon based on card type
            const cardIcon = document.createElement('i');
            cardIcon.classList.add('fa', 'fa-' + cards[card].type);

            //Create card element
            const cardElement = document.createElement('li');
            cardElement.classList.add('card', 'animated');

            //Set element id to be used for access cards items
            cardElement.setAttribute('id', cards[card].id);
            cardElement.appendChild(cardIcon);

            //Handle card click listener
            cardElement.addEventListener('click', game.cardClicked, true);

            //Append card to deck
            deck.appendChild(cardElement);
        }
        this.updateMoves();
    };

    /***
     * Update Game player moves
     */
    game.updateMoves = function () {
        movesSpan.innerText = game.moves;
        this.updateStarsScore();
    };

    /***
     * Update player score rating
     */
    game.updateStarsScore = function () {
        const solvedItemsCount = _.filter(this.cards, function (c) {
            return c.match === true;
        }).length;
        this.stars = 3;
        const percentage = (solvedItemsCount + 16) / this.moves;

        if (percentage < 0.75) {
            this.stars = 2;
        }
        if (percentage < 0.5) {
            this.stars = 1;
        }
        this.updateStartsUi();
    }

    /**
     * Update Play score rating UI
     */
    game.updateStartsUi = function () {
        while (starsScore.firstChild) {
            starsScore.removeChild(starsScore.firstChild);
        }
        for (var i = 0; i < this.stars; i++) {
            const child = document.createElement('li');
            const star = document.createElement('i');
            star.classList.add('fa', 'fa-star');
            child.appendChild(star);
            starsScore.appendChild(child);
        }
    };

    /**
     * Check if game finished
     * show popup to congratulate the player with option to restart the game
     */
    game.checkGameFinished = function () {
        const  remainingCards = _.filter(this.cards,
            function (c) {
                return c.match === false;
            });
        if (remainingCards.length === 0) {
            //Game is Finished
            game.running = false;


            //Stop timer
            window.clearInterval(game.timerHandler);

            
            const formtedDate = moment(moment.now()-game.startDate).format('mm:ss');
            stats.innerText = `With ${this.moves} Moves , ${formtedDate} time and ${this.stars} Stars`;
            toggleModal();
            winner.play();
        }
    };


    /**
     * Toggle Winner modal visibility
     */
    function toggleModal() {
        modal.classList.toggle('visible');
    }

    /**
     * Add Player's game move
     */
    game.addMove = function () {
        this.moves++;
        this.updateMoves();
    };

    /**
     * On Deck card click
     * @param {any} e Card element
     */
    game.cardClicked = function (e) {
        
        //To ignore clicks of non cards
        if (!e.target.classList.contains('card')) {
            return;
        }
        
        var cardElement = e.target;

        //ignore clicks on matched or open cards
        if (cardElement.classList.contains('match') || cardElement.classList.contains('open')) {
            return;
        }
        
        //Check if card exists in cards array
        var card = _.find(game.cards, function (c) { return c.id === e.target.id });
        if (card == undefined || card.match === true) {
            return;
        }

        //Update play game moves
        game.addMove();
        game.updateMoves();



        // if there's open unmatched two cards
        if (game.openCards.length == 2) {
            for (const i in game.openCards) {
                let openCard = game.openCards[i];
                openCard.classList.remove('show', 'open');
                openCard.classList.toggle('flipInY');
                openCard.classList.toggle('shake');
            }

            //reset open cards array
            game.openCards = [];

            //play fail sound
            fail.play();
        }

        // if there's one card open check if it's match with new card
        if (game.openCards.length == 1) {

            // get other opened card
            var otherCard = _.find(game.cards, function (c) {
                return c.id == game.openCards[0].id;
            });
            if (otherCard.type == card.type) {
                card.match = true;
                otherCard.match = true;
                game.matchCardElements(game.openCards[0], cardElement);
                return;
            }
        }

        // Show clicked card with animation
        cardElement.classList.add('show');
        cardElement.classList.add('open');
        cardElement.classList.toggle('flipInY');

        // Add clicked card to open cards array
        game.openCards.push(cardElement);

        // play clap sound
        clap.play();

    };

    /**
     * Match two cards
     * @param {any} firstCard the first - old - card
     * @param {any} secondCard the second - new - card
     */
    game.matchCardElements = function (firstCard, secondCard) {

        //Set cards as matched
        firstCard.classList.add('match');
        secondCard.classList.add('match');

        //Remove old animation
        secondCard.classList.toggle('shake');
        firstCard.classList.toggle('flipInY');

        //Add tada animation
        secondCard.classList.toggle('tada');
        firstCard.classList.toggle('tada');

        //reset open cards
        this.openCards = [];

        //play tada sound
        tada.play();

        //check if game finished
        this.checkGameFinished();
    };


    /***
   * UI Element references
   */
    
    const deck = document.querySelector('.deck');
    const movesSpan = document.querySelector('.moves');
    const starsScore = document.querySelector('.stars');
    const modal = document.getElementById('myModal');
    const stats = document.getElementById('stats');
    const timer = document.querySelector('.timer');

    //UI Event handlers
    document.querySelector('.restart').addEventListener('click', game.start);
    document.querySelector('#btn-play-again').addEventListener('click', game.restart);

    //Sound files
    const clap = document.getElementById('clap');
    const tada = document.getElementById('tada');
    const fail = document.getElementById('fail');
    const winner = document.getElementById('winner');

    //Start the game
    game.start();


};
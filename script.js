const game = (() => {
    function createPlayer (name,mark) {
        const playerName = name;
        const playerMark = mark;
        return {playerName,playerMark}
    }  
    
    let player1 = createPlayer('One', 'o');
    let player2 = createPlayer('Two', 'x');
    let players = [player1, player2];
    let started = 0;

    function setPlayers() {
        player1 = createPlayer(document.querySelector('#p1Name').value, 'o');
        player2 = createPlayer(document.querySelector('#p2Name').value, 'x');
        players = [player1, player2];
    }

    const start = (() => {
        const start = document.querySelector('.start');
        const modal = document.querySelector('.startCover');
        start.addEventListener('click', () => {
            if (gameOver || started) {
                return
            }
            if (document.querySelector('#p1Name').value === '' || document.querySelector('#p2Name').value === '') {
                alert('Please enter player names');
                return
            }
            start.style.display = 'none';
            modal.style.visibility = 'hidden';
            document.querySelector('#p1Name').style.display = 'none';
            document.querySelector('#p2Name').style.display = 'none';
            started = 1;
            setPlayers();
            turn = 1;
            displayMessage();
        })
    })();

    let gameOver = 0;
    let turn = 0; // turn = 1, because displayMessage() is called right when starting.
    let tie = 0;
    let board = ["","","","","","","","",""];
    
    function checkWinner (board) {
        const combinations = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]

        for (i=0; i < combinations.length; i++) {
            const [a,b,c] = combinations[i];
            if (board[a] != "" && board[a] == board[b] && board[a] == board[c]) {
                gameOver = 1;
                return;
            }
        }

        if (!board.includes('') && gameOver === 0){
            gameOver = 1;
            tie = 1;
        }
    }

    const displayMessage = () => {
        const msg = document.querySelector('.message');
        if (started == 0) {
            msg.style.marginLeft = `${-msg.offsetWidth/2}px`
            return
        }
        if (gameOver && !tie) {
            msg.textContent = `Game Over! The winner is Player ${players[turn].playerName}!`
        } else {
            turn = turn === 0 ? 1 : 0;
            msg.textContent = `It is Player ${players[turn].playerName}'s turn.`    
        }
        if (gameOver && tie){
            msg.textContent = 'Game Over. The game is tied.'
        }
        msg.style.marginLeft = `${-msg.offsetWidth/2}px`
    };

    displayMessage();

    const action = (target, gameOver) => {
        if (board[target] != "" || gameOver) {
            return;
        }
        board[target] = players[turn].playerMark;
        checkWinner(board);
        displayMessage();
    }
    const getGameOver = () => {
        return gameOver
    }

    const getCellClass = (target) => {
        console.log(target);
    }

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell) => {
        cell.addEventListener('click', (event) => {
            if (getGameOver() || event.target.classList.length > 1) {
                return
            } // returns if the game is over, or if the cell already has a mark
            event.target.parentNode.classList.toggle(players[turn].playerMark); // Toggle off the current mark class from .board
            event.target.classList.toggle(players[turn].playerMark) // toggle on the current player mark class.
            const index = (parseInt(event.target.id.split('-')[1]));
            action(index, gameOver); // Calls the action, and indicates the change of turn
            event.target.parentNode.classList.toggle(players[turn].playerMark); // Toggle on the new mark class from .board
        })
    })

    /*
    Restart requirements
    gameOver, turn, tie = 0,
    board = [''*9]
    message = current player's turn
    remove classes
    */
   
    const restart = (() => {
        const restart = document.querySelector('.restart');
        const cells = document.querySelectorAll('.cell');
        restart.addEventListener('click', () => {
            gameOver = 0;
            turn = 1; // call for displayMessage() will reset turn to 0
            tie = 0;
            board = ["","","","","","","","",""];
            cells.forEach((cell) => {
                cell.classList.remove('x');
                cell.classList.remove('o');
            })
            displayMessage();
        })
    })();

    // return{action, players}
    
})();

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let gameActive = true;
const HUMAN = 'X';
const COMPUTER = 'O';

// Initialize game
function initGame() {
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win', 'x', 'o');
        cell.addEventListener('click', handleClick, { once: true });
    });
    status.textContent = "Your Turn (X)";
    status.style.color = '#ffffffaa';
}

// Handle human move
function handleClick(e) {
    if (!gameActive) return;
    
    const cell = e.target;
    makeMove(cell, HUMAN);
    
    if (checkWin(HUMAN)) {
        endGame(true);
        return;
    }
    
    if (isDraw()) {
        endGame(false);
        return;
    }
    
    setTimeout(computerMove, 800);
}

// Computer move logic
function computerMove() {
    if (!gameActive) return;

    // Try to win
    let move = findWinningMove(COMPUTER);
    
    // Block human win
    if (move === null) move = findWinningMove(HUMAN);
    
    // Take center
    if (move === null && !cells[4].textContent) move = 4;
    
    // Take random corner
    if (move === null) {
        const corners = [0, 2, 6, 8];
        move = corners.find(index => !cells[index].textContent);
    }
    
    // Random move
    if (move === null) {
        const available = [...cells].findIndex(c => !c.textContent);
        move = available !== -1 ? available : null;
    }

    if (move !== null) {
        makeMove(cells[move], COMPUTER);
        
        if (checkWin(COMPUTER)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(false);
        }
    }
}

function makeMove(cell, player) {
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    cell.removeEventListener('click', handleClick);
}

function findWinningMove(player) {
    for (const combo of winCombinations) {
        const [a, b, c] = combo;
        const cellsInCombo = [cells[a], cells[b], cells[c]];
        
        if (cellsInCombo.filter(c => c.textContent === player).length === 2) {
            const emptyCell = cellsInCombo.find(c => !c.textContent);
            if (emptyCell) return combo[combo.indexOf(parseInt(emptyCell.dataset.index))];
        }
    }
    return null;
}

function checkWin(player) {
    return winCombinations.some(combo => {
        if (combo.every(index => cells[index].textContent === player)) {
            combo.forEach(index => cells[index].classList.add('win'));
            return true;
        }
        return false;
    });
}

function isDraw() {
    return [...cells].every(cell => cell.textContent !== '');
}

function endGame(humanWon) {
    gameActive = false;
    if (humanWon) {
        status.textContent = "You Win! 🎉";
        status.style.color = '#2ed573';
    } else if (isDraw()) {
        status.textContent = "Draw! 🤝";
    } else {
        status.textContent = "Computer Wins! 😢";
        status.style.color = '#ff4757';
    }
}

// Event listeners
restartBtn.addEventListener('click', initGame);

// Start game
initGame();
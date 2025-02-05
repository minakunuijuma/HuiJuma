let BOARD_SIZE = 15
let board; //Kentäntallennus tai jotain sellasta






document.getElementById("new-game-btn").addEventListener('click', startGame);

function startGame(){  
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    board = generateRandomBoard();
}

function getCell(board, x, y){
    return board [y][x];
}


function generateRandomBoard(){

    const newBoard = Array.from({length: BOARD_SIZE},   () =>
     Array(BOARD_SIZE).fill(''))

    console.log(newBoard);

    for(let y=0; y < BOARD_SIZE; y++){
        for(let x=0; x < BOARD_SIZE; x++){
            if (y===0 || y === BOARD_SIZE-1 || x === 0 || x === BOARD_SIZE-1)
            {
                newBoard[y][x] = 'W' //W on siis seinä
            }
        }
    }

    return  newBoard;

}
let BOARD_SIZE = 20
let board; //kenttä tallentaan tähän
const cellSize = calculateCellSize();
let player;
let ghosts = [];
let ghostSpeed = 1000;
let isGameRunning = false;
let ghostInterval;


document.getElementById("new-game-btn").addEventListener('click', startGame);

function calculateCellSize(){
    const sreenSize = Math.min(window.innerWidth, window.innerHeight);
    const gameBoardSize = 0.95 * sreenSize;
    return gameBoardSize / BOARD_SIZE;
    
    }
    
    document.addEventListener('keydown', (event) => {
        if (isGameRunning){
        switch (event.key) {
            case 'ArrowUp':
            player.move(0, -1)  //liikuta ylöspäin
            break;
            case 'ArrowDown':
            player.move(0, 1)   //liiku alas
            break;
            case 'ArrowLeft':
            player.move(-1, 0)  // liikuta vasemmalle
            break;
            case 'ArrowRight':
            player.move(1,0)   // liiku oikealle
            break;
            case 'w':
            shootAt(player.x, player.y - 1) // ampuu ylös
            break;
            case 's':
            shootAt(player.x, player.y + 1) // ampuu alas
            break;
            case 'a':
            shootAt(player.x - 1, player.y) // ampuu vasemmalle
            break;
            case 'd':
            shootAt(player.x + 1, player.y) // ampuu oikealle
            break;
        }}
        event.preventDefault();
});

function startGame(){
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    isGameRunning = true;

    player = new Player(0,0)
    board = generateRandomBoard();

    ghostInterval = setInterval (moveGhosts, ghostSpeed)

    drawBoard(board);
}

function getCell(board, x, y) {
    return board [y][x];
}

function setCell(board, x, y, value){
    board[y][x] = value;
}


function generateRandomBoard(){

    const newBoard = Array.from({ length: BOARD_SIZE}, () =>
     Array(BOARD_SIZE).fill(' '));

    for(let y=0; y < BOARD_SIZE; y++){
        for(let x=0; x < BOARD_SIZE; x++){
            if (y===0 || y === BOARD_SIZE-1 || x === 0 || x === BOARD_SIZE-1)
            {
                newBoard[y][x] = 'W' //W on wall
            }
        }
    }

    generateObstacles(newBoard);

    const [playerX, playerY] = randomEmptyPosition(newBoard);
    setCell(newBoard, playerX, playerY, 'P');
    player.x = playerX;
    player.y = playerY;


    ghosts = [];

    for(let i= 0; i < 5; i++) {
    const [ghostX, ghostY] = randomEmptyPosition(newBoard);
    setCell(newBoard, ghostX, ghostY, 'H');
    ghosts.push(new Ghost(ghostX,ghostY)); // työnnetään haamut listalle
    }

    //console.log(ghosts);
    //console.log(newBoard);
    

    return  newBoard;
}

 function drawBoard(board){
    const gameBoard = document.getElementById('game-board');

    gameBoard.innerHTML = ' ';

    //Asetetaan grid-sarakkeet ja rivit dynaamisesti BOARD_SIZEN mukaan
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

    for(let y=0; y < BOARD_SIZE; y++){
        for(let x=0; x < BOARD_SIZE; x++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = cellSize + "px";
            cell.style.height = cellSize + "px";

            if (getCell(board, x, y) === 'W'){
                cell.classList.add('wall'); 
            }

            else if (getCell(board, x, y) === 'P'){
                cell.classList.add('player'); 
            }
            
            else if (getCell(board, x, y) === 'H'){
                cell.classList.add('hornmonster');
            }

            else if (getCell(board, x, y) === 'B'){
                cell.classList.add('Bullet');
                setTimeout(()=> (
                    setCell(board, x, y, ' ')
                ), 5000)
            }

            gameBoard.appendChild(cell);

        }
    }
} 

function generateObstacles(board){

    //lista esteistä koordinaattiparien listoina
    const obstacles = [
        [[0,0],[0,1],[1,0],[1,1]], // Square
        [[0,0],[0,1],[0,2],[0,3]],  // I
        [[0,0],[1,0],[2,0],[1,1]], // T
        [[1,0],[2,0],[1,1],[0,2],[1,2]], // Z
        [[1,0],[2,0],[0,1],[1,1]], // S
        [[0,0],[1,0],[1,1],[1,2]], // L
        [[0,2],[0,1],[1,1],[2,1]]  // J
    ];

    //valitaan muutama paikka esteille pelikentältä
    //huom kovakoodatut x ja y, eli katso että palikat mahtuu kentälle
    const positions = [
            { startX: 2, startY: 2 },
            { startX: 8, startY: 2 },
            { startX: 4, startY: 8 },
            { startX: 3, startY: 16 },
           // { startX: 10, startY: 10 },
            { startX: 12, startY: 5 },
            { startX: 12, startY: 10 },
            { startX: 16, startY: 10 },
            //{ startX: 13, startY: 14 }
       
    ]

    //käydään läpi valitut paikat ja arvotaan niihin esteet
    positions.forEach(pos => {
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
        placeObstacle(board, randomObstacle, pos.startY, pos.startX);
    });
}

function placeObstacle(board, obstacle, startX, startY){
    for (coordinatePair of obstacle){
        [x,y] = coordinatePair;
        board[startX + y][startY + x] = 'W'
    }
}

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1 )) + min
}

function randomEmptyPosition(board){

    x = randomInt(1, BOARD_SIZE -2);
    y = randomInt(1, BOARD_SIZE - 2);
    
    if (getCell(board, x, y) === ' '){
        return [x, y];
    } else {
        return randomEmptyPosition(board);
    }
}

class Player {
    constructor(x, y){
    this.x = x;
    this.y = y;
    }
move(deltaX, deltaY){

    //pelaajan koordinaatit talletetaan
    const currentX = player.x
    const currentY = player.y

    //console.log(currentX,currentY)

    //uus sijainti
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;

    if (getCell(board, newX, newY) === ' '){
    //pelaajan sijainnin päivittäminen
    player.x = newX
    player.y = newY

   // console.log(newX,newY)

    //pelikentän päivittäminen
    board[currentY][currentX] = ' '; //vanhan paikan tyhjennys
    board[newY][newX] = 'P'; //pelaaja yoinkataan uuteen kohtaan

    }

    drawBoard(board)

}
} 

class Ghost {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    moveGhostTowardsPlayer(player, board, oldGhosts){
        let dx = player.x - this.x;
        let dy = player.y - this.y;
    
        let moves = [];
        if(Math.abs(dx) > Math.abs(dy)){
            if(dx > 0)
                moves.push({ x: this.x + 1, y: this.y}) //oikea
            else
                moves.push({ x: this.x - 1, y: this.y})//vasen
            if(dy > 0)
                moves.push({ x: this.x, y: this.y + 1})//alas
            else
                moves.push({ x: this.x, y: this.y- 1})//ylös
        }
        else{
            if(dy > 0)
                moves.push({ x: this.x, y: this.y + 1})//alas
            else
                moves.push({ x: this.x, y: this.y- 1})//ylös
            if(dx > 0)
                moves.push({ x: this.x + 1, y: this.y})//oikea
            else
                moves.push({ x: this.x - 1, y: this.y})//vasen
        }

        for (let move of moves){
            if(board[move.y][move.x] === ' ' || board[move.y][move.x] === 'P'
                &&
            !oldGhosts.some(h => h.x === move.x && h.y === move.y) )
            {
                return move;
            }
            
        }
            
        return { x: this.x, y: this.y} ;

    }


}

function shootAt(x,y){

if(getCell(board, x, y)=== 'W'){
        return;
}
const ghostIndex = ghosts.findIndex(ghost => ghost.x === x && ghost.y === y);

if(ghostIndex !== -1){
    ghosts.splice(ghostIndex,1);
}

if (ghosts.length === 0){
    alert ("HUI JUMA")
}

console.log(ghosts);

    setCell(board, x, y, 'B');
    drawBoard(board);
}

function moveGhosts(){
  
    //tallennetaan haamujen vanhat sijainnit
    const oldGhosts = ghosts.map(ghost => ({ x: ghost.x, y: ghost.y }));
    ghosts.forEach(ghost => {
        const newPosition = ghost.moveGhostTowardsPlayer(player, board, oldGhosts)

        // päivitetään haamun uusi paikka    
        ghost.x = newPosition.x;
        ghost.y = newPosition.y;
        setCell(board, ghost.x, ghost.y, 'H');

        if (ghost.x===player.x && ghost.y===player.y){
            endGame();
            return;
        }

        oldGhosts.forEach( ghost => {
            board[ghost.y][ghost.x] = ' '; // poistetaan vanhan haamun sijainti
        });

        ghosts.forEach( ghost => (
            board[ghost.y][ghost.x] = 'H'
        ));     //Haamun uuden sijainnin päivittäminen

        drawBoard(board);

    });
}

function endGame(){
    alert('Kauhee skämmeri sinäki siinä')
    isGameRunning = false;
    clearInterval(ghostInterval);
    document.getElementById('intro-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
    
}

/* function moveGhosts(){

    //haamujen vanhan sijainnin tallennus
    const oldGhosts = ghosts.map(ghost => ({ x: ghost.x, y: ghost.y}));

    ghosts.forEach(ghost => (

        const newPosition = ghost.moveGhostTowardsPlayer(player, board)

//tost alta pitäs kalastaa joku osa nii älä lisää tätä siihen legacy bullshittiin

        /* 
        // määrittelee kyseiselle haamulle mahdolliset uudet paikat    
            const possibleNewPositions = [
            { x: ghost.x, y: ghost.y - 1 }, // Ylös
            { x: ghost.x, y: ghost.y + 1 }, // Alas
            { x: ghost.x, - 1, y: ghost.y }, // Vasemmalle
            { x: ghost.x, + 1, y: ghost.y }  // Oikealle
        ];

        //suodatus 
        const validNewPositions = possibleNewPositions.filter(newPosition =>
            newPosition.x >= 0 && newPosition.x < BOARD_SIZE &&
            newPosition.y >= 0 && newPosition.y < BOARD_SIZE &&
            board[newPosition.y][newPosition.x] === ' ' //tää koodi tarkistaa täs sillai "Hei blud onks täs tyhjää"
        );

        console.log(validNewPositions)

        if (validNewPositions.length > 0){
            //valitaan satunnainen uusi paikka mahdollisista paikoista
            const randomNewPosition = validNewPositions[Math.floor(Math.random() * validNewPositions.length)];
            // päivitetään haamun uusi paikka    
            ghost.x = randomNewPosition.x;
            ghost.y = randomNewPosition.y;
        } */
       /*  
        
        //Haamun uuden paikan päivitys
        ghost.x = newPosition.x;
        ghost.y = newPosition.y;


        setCell(board, ghost.x, ghost.y, 'H');

        oldGhosts.forEach( ghost => {
            board[ghost.y][ghost.x] = ' '; // poistetaan vanhan haamun sijainti
        });

        drawBoard(board);
    ));


} */ 






 /*Mun kaunis legacy

 let BOARD_SIZE = 15
let board; //Kentäntallennus tai jotain sellasta
const cellSize = calculateCellSize();
let player



document.getElementById("new-game-btn").addEventListener('click', startGame);

function calculateCellSize(){
const screenSize = Math.min(window.innerWidth, window.innerHeight);
const gameBoardSize = 0.95 * screenSize;
return gameBoardSize / BOARD_SIZE;

}

function startGame(){  
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    board = generateRandomBoard();

   

    drawBoard(board);
}

function getCell(board, x, y){
    return board [y][x];
}

function setCell(board,x, y, value){
    board[y][x] = value;
}


function generateRandomBoard(){

    const newBoard = Array.from({length: BOARD_SIZE},   () =>
     Array(BOARD_SIZE).fill(' '))

    console.log(newBoard);

    for(let y=0; y < BOARD_SIZE; y++){
        for(let x=0; x < BOARD_SIZE; x++){
            if (y===0 || y === BOARD_SIZE-1 || x === 0 || x === BOARD_SIZE-1)
            {
                newBoard[y][x] = 'W' //W on siis seinä, tai wall
            }
        }
    }

    generateObstacles(newBoard);

    const [playerX, playerY] = randomEmptyPosition(newBoard);
    setCell(newBoard, playerX, playerY, 'P');

    return  newBoard;

}

function drawBoard(board){
    const gameBoard = document.getElementById('game-board')

    //Grid-sarakkeen asettelu + rivit dynaamisesti BOARD_SIZEn mukaan
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

    for(let y=0; y < BOARD_SIZE; y++){
        for(let x=0; x < BOARD_SIZE; x++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = cellSize + "px";
            cell.style.height = cellSize + "px";

            if (getCell(board, x, y) === 'W'){
                cell.classList.add('wall');
            }
            else if (getCell(board, x, y) === 'P'){
                cell.classList.add('player');
            }
            
            gameBoard.appendChild(cell);

        }
    }

}

function generateObstacles(board){

    //jaa no ei kait siin sitte (estelista koordinaattipareina)
    const obstacles = [
        [[0,0],[0,1],[1,0],[1,1]], // Square
        [[0,0],[0,1],[0,2],[0,3]],  // I
        [[0,0],[1,0],[2,0],[1,1]], // T
        [[1,0],[2,0],[1,1],[0,2],[1,2]], // Z
        [[1,0],[2,0],[0,1],[1,1]], // S
        [[0,0],[1,0],[1,1],[1,2]], // L
        [[0,2],[0,1],[1,1],[2,1]]  // J
    ];

    //let's go gambling
    //kovakoodatutu X ja Y, palikoiden mahtumisen tarkistusasia tai joku serllanen emt

    //Esteiden gämbläys kartalle
    const positions = [
        { startX: 2, startY: 2 },
        { startX: 8, startY: 2 },
        { startX: 4, startY: 8 },
        { startX: 3, startY: 16 },
        { startX: 12, startY: 5 },
        { startX: 12, startY: 10 },
        { startX: 16, startY: 10 }
    ]
    
    positions.forEach(pos => {
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
        placeObstacle(board, randomObstacle, pos.startY, pos.startX);
    });
}

function placeObstacle(board, obstacle, startX, startY){
    for (coordinatePair of obstacle){
        [x,y] = coordinatePair;
        board[startX + y][startY + x] = 'W'
    }
}

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomEmptyPosition(board){

    x = randomInt(1, BOARD_SIZE - 2);
    y = randomInt(1, BOARD_SIZE - 2);

    if (getCell(board, x, y) === ' '){
        return [x, y];
    } else {
        return randomEmptyPosition(board);
    }

}

*/
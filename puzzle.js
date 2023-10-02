let selectedImageUrl = '';
let boardP = []
const boardState = getBoardStateFromDOM();
////board bar///////
const input = document.querySelector("input");
const num = document.querySelector(".number");
input.addEventListener("input", () => {
    num.textContent = input.value
});

//Switch view
const view1 = document.getElementById('view1'),
    view2 = document.getElementById('view2');

const bottonPlay = document.getElementById('bGame');
const ret = document.getElementById('return');
const board = document.querySelector('.puzzleBoard');

bottonPlay.addEventListener('click', () => {
    view1.style.display = 'none';
    view2.style.display = 'block';

    // Create puzzle pieces
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = selectedImageUrl;
    img.onload = () => {
        const boardSize = parseInt(input.value);
        board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
        const fragmentos = dividirImagen(img, boardSize, boardSize);

        for (let i = 0; i < fragmentos.length-1; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.setAttribute('data-number', i+1); // Asignar un ID basado en el número de pieza
            piece.style.backgroundImage = `url('${fragmentos[i]}')`;
            piece.style.backgroundSize = 'cover';
            
            const number = document.createElement('span');  // Crear un elemento span para el número
            number.textContent = i + 1;  // Establecer el contenido de texto al número de la ficha
            number.style.zIndex = 2;  // Establecer z-index para que el número aparezca encima de la imagen
            piece.appendChild(number);  // Añadir el número a la ficha
            
            document.querySelector('.puzzleBoard').appendChild(piece);
        }
    
    // Add an empty space as the last piece
    const emptyPiece = document.createElement('div');
    emptyPiece.classList.add('puzzle-piece', 'empty');
    document.querySelector('.puzzleBoard').appendChild(emptyPiece);

    // Shuffle the puzzle pieces randomly
    const puzzlePieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    puzzlePieces.sort(() => Math.random() - 0.5);
    puzzlePieces.forEach(piece => document.querySelector('.puzzleBoard').appendChild(piece));

    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach(piece => piece.addEventListener('click', moverFicha));
    };
});

ret.addEventListener('click', () => {
    view2.style.display = 'none';
    view1.style.display = 'block';

    // Loop through and remove each child element
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
});

document.querySelectorAll('.fotos-item img').forEach(img => {
    img.addEventListener('click', function () {
        selectedImageUrl = this.src;
    });
});
////////////////////////////////////////////
function dividirImagen(img, filas, columnas) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const anchoFragmento = img.width / columnas;
    const altoFragmento = img.height / filas;
    const fragmentos = [];

    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const x = j * anchoFragmento;
            const y = i * altoFragmento;
            canvas.width = anchoFragmento;
            canvas.height = altoFragmento;
            ctx.drawImage(img, x, y, anchoFragmento, altoFragmento, 0, 0, anchoFragmento, altoFragmento);
            const dataURL = canvas.toDataURL();
            fragmentos.push(dataURL);
        }
    }

    return fragmentos;
}
// Función para mover una ficha
function moverFicha(event) {
    const piece = event.target.closest('.puzzle-piece');  // Asegurarse de obtener el elemento puzzle-piece correcto
    if (piece.classList.contains('empty')) {
        return;  // No hacer nada si se hace clic en el espacio vacío
    }

    const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    const tamano = Math.sqrt(pieces.length);  // Obtener el tamaño del tablero

    const pieceIndex = pieces.indexOf(piece);
    const emptyPieceIndex = pieces.findIndex(p => p.classList.contains('empty'));

    const [filaFicha, colFicha] = [Math.floor(pieceIndex / tamano), pieceIndex % tamano];
    const [filaVacia, colVacia] = [Math.floor(emptyPieceIndex / tamano), emptyPieceIndex % tamano];

    // Verificar si la ficha está adyacente al espacio vacío
    if (Math.abs(filaFicha - filaVacia) + Math.abs(colFicha - colVacia) === 1) {
        // Crear un nodo de marcador de posición temporal
        const tempNode = document.createElement('div');
        piece.parentNode.insertBefore(tempNode, piece);
        pieces[emptyPieceIndex].parentNode.insertBefore(piece, pieces[emptyPieceIndex]);
        tempNode.parentNode.replaceChild(pieces[emptyPieceIndex], tempNode);

        // Actualizar el atributo data-number de las fichas
        const tempNumber = piece.dataset.number;
        piece.dataset.number = pieces[emptyPieceIndex].dataset.number;
        pieces[emptyPieceIndex].dataset.number = tempNumber;

        verificarGanador(tamano);
    }
}

function verificarGanador(tamano) {
    const pieces = document.querySelectorAll('.puzzle-piece:not(.empty)');
    const ordenCorrecto = Array.from({ length: tamano * tamano - 1 }, (_, index) => index).join('');
    const ordenActual = Array.from(pieces).map(piece => piece.dataset.number).join('');
    if (ordenCorrecto === ordenActual) {
        alert('¡Ganaste!');
    }
}

// Asegurarse de que cada pieza del puzzle tenga un evento de clic adjunto para mover la ficha
bottonPlay.addEventListener('click', () => {
    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach(piece => piece.addEventListener('click', moverFicha));
});
/////////////////////////////////////////////////////////////////////////
//A*
function aStar(board) {
    console.log(board);
    
    let openList = [];
    let closeList = [];
    let actual = board;

    while (!isSolved(actual)) {
        let successors = expandBoard(actual);
        addToList(closeList, openList, successors);
        closeList.push(actual);

        if (openList.length != 0) {
            actual = openList[0][0];
            openList.shift();
        }
        console.log('actual:',actual);
        console.log('openlis',openList);
        console.log('closeList',closeList);
    }

    return actual;
}
    function expandBoard(board) {
        let successors = [];
        const possibleMoves = getPossibleMoves(board);
        for (let move of possibleMoves) {
            const newBoard = applyMove(board, move);
            const heuristic = calculateHeuristic(newBoard);
            const successor = [newBoard, heuristic];
            successors.push(successor);
        }
    
        return successors;
    }

    function addToList(closeList, openList, source) {
        for (let successor of source) {
            const boardStr = boardToString(successor[0]);
            if (!closeList.some(item => boardToString(item) === boardStr) &&
                !openList.some(item => boardToString(item[0]) === boardStr)) {
                openList.push(successor);
            }
        }
    
        openList.sort((a, b) => a[1] - b[1]);  // Ordena la lista abierta por la heurística
    }

    function calculateHeuristic(board) {
        let heuristic = 0;
        let value = 1;
        for (let row of board) {
            for (let tile of row) {
                if (tile !== value % (board.length * board.length)) heuristic++;
                value++;
            }
        }
        return heuristic;
    
    }

    document.getElementById('solvePuzzle').addEventListener('click', () => {
        const initialBoardState = getBoardStateFromDOM();
        const solvedBoard = aStar(initialBoardState);
        console.log('Solved Board:', solvedBoard);
        applyBoardStateToDOM(solvedBoard);
    });
    
class Node {
    constructor(board, parent = null, g = 0, h = 0) {
        this.board = board;
        this.parent = parent;
        this.g = g;
        this.h = h;
        this.f = this.g + this.h;
    }
}

function getMisplacedTiles(board) {
    let misplacedTiles = 0;
    let value = 1;
    for (let row of board) {
        for (let tile of row) {
            if (tile !== 0 && tile !== value) {
                misplacedTiles++;
            }
            value++;
        }
    }
    return misplacedTiles;
}

function expandNode(node) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];  // Arriba, Abajo, Izquierda, Derecha
    const [i, j] = findEmpty(node.board);
    const children = [];

    for (let [di, dj] of directions) {
        let ni = i + di, nj = j + dj;
        if (ni >= 0 && ni < node.board.length && nj >= 0 && nj < node.board.length) {
            let newBoard = copyBoard(node.board);
            [newBoard[i][j], newBoard[ni][nj]] = [newBoard[ni][nj], newBoard[i][j]];
            const childNode = new Node(newBoard, node, node.g + 1, getMisplacedTiles(newBoard));
            children.push(childNode);
        }
    }
    return children;
}

// Convertir el estado del tablero a una cadena para poder almacenarlo en un Set
function boardToString(board) {
    return board.flat().join(',');
}

// La función principal del algoritmo A*
function assstar(initialBoard) {
    const openList = [new Node(initialBoard, null, 0, getMisplacedTiles(initialBoard))];
    const closedList = new Set();

    while (openList.length > 0) {
        // Ordenar la lista abierta por el valor de f (g + h) en orden ascendente
        openList.sort((a, b) => a.f - b.f);

        const currentNode = openList.shift();  // Sacar el nodo con el menor valor de f de la lista abierta
        const currentBoardStr = boardToString(currentNode.board);

        if (currentNode.h === 0) {
            return currentNode;  // Si h es 0, entonces este nodo es la solución
        }

        closedList.add(currentBoardStr);  // Agregar el nodo actual a la lista cerrada

        // Expandir el nodo actual y agregar los nodos hijos a la lista abierta si no están en la lista cerrada
        const children = expandNode(currentNode);
        for (let child of children) {
            const childBoardStr = boardToString(child.board);
            if (!closedList.has(childBoardStr)) {
                openList.push(child);
            }
        }

        // Opcional: mostrar el nodo actual, la lista abierta y la lista cerrada
        // (puede ser útil para depuración o para mostrar el progreso del algoritmo)
        console.log('Current node:', currentNode);
        console.log('Open list:', openList);
        console.log('Closed list:', closedList);
    }

    return null;  // Retornar null si no se encuentra una solución
}

// Función para llamar al algoritmo A* y aplicar la solución al DOM
function solvePuzzle() {
    const initialBoardState = getBoardStateFromDOM();
    const solutionNode = astar(initialBoardState);
    if (solutionNode) {
        let node = solutionNode;
        const solutionSteps = [];
        while (node) {  // Recorrer los nodos desde la solución hasta el nodo inicial para obtener los pasos de la solución
            solutionSteps.unshift(node.board);
            node = node.parent;
        }
        // Aplicar la solución al DOM (esto podría hacerse de una manera más elegante dependiendo de cómo quieras mostrar la solución)
        for (let step of solutionSteps) {
            setTimeout(() => applyBoardStateToDOM(step), 1000);
        }
    } else {
        alert('No solution found');
    }
}
function getBoardStateFromDOM() {
    const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    const size = Math.sqrt(pieces.length);
    const board = Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => {
            const numberString = pieces[i * size + j].dataset.number ? parseInt(pieces[i * size + j].dataset.number) : 0
            console.log(`data-number string: ${numberString}`);
            const numberValue = numberString ? parseInt(numberString) : 0;
            console.log(`data-number value: ${numberValue}`);
            return numberValue;
        })
    );
    return board;
}


function applyBoardStateToDOM(board) {
    console.log('Applying board state to DOM:', board);
    const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    board.flat().forEach((value, index) => {
        const piece = pieces[index];
        if (value === 0) {
            piece.classList.add('empty');
            piece.style.backgroundPosition = '';
        } else {
            piece.classList.remove('empty');
            const gridSize = board.length;
            const row = Math.floor((value - 1) / gridSize);
            const col = (value - 1) % gridSize;
            piece.style.backgroundPosition = `${(col * 100) / (gridSize - 1)}% ${(row * 100) / (gridSize - 1)}%`;
        }
        piece.dataset.number = value;  // Update the data-number attribute
    });
}

function copyBoard(board) {
    return board.map(row => row.slice());
}

// Función para verificar si el tablero está resuelto
function isSolved(board) {
    let value = 1;
    for (let row of board) {
        for (let tile of row) {
            if (tile !== value % (board.length * board.length)) {
                console.log('Board is not solved:', board);
                return false;
            }
            value++;
        }
    }
    console.log('Board is solved:', board);
    return true;
}


// Función para encontrar la posición del espacio vacío
function findEmpty(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    throw new Error('No empty tile found');
}

///////////////////////////////////////////BACKTRACKING
// Función para verificar si el tablero está resuelto


// Función para validar un movimiento
function isValidMove(board, move) {
    const [i, j] = findEmpty(board);
    const [ni, nj] = move;
    return ni >= 0 && ni < board.length && nj >= 0 && nj < board.length;
}

// Función para aplicar un movimiento al tablero
function applyMove(board, move) {
    const newBoard = copyBoard(board);
    const [i, j] = findEmpty(newBoard);
    const [ni, nj] = move;
    [newBoard[i][j], newBoard[ni][nj]] = [newBoard[ni][nj], newBoard[i][j]];
    return newBoard;
}

// Función para encontrar la posición del espacio vacío
function findEmpty(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === 0) return [i, j];
        }
    }
}

// Función para obtener una lista de movimientos posibles desde el estado actual del tablero
function getPossibleMoves(board) {
    const [i, j] = findEmpty(board);
    const moves = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];  // Arriba, Abajo, Izquierda, Derecha
    for (let [di, dj] of directions) {
        let ni = i + di, nj = j + dj;
        if (isValidMove(board, [ni, nj])) {
            moves.push([ni, nj]);
        }
    }
    return moves;
}

// Función para copiar el tablero
function copyBoard(board) {
    return board.map(row => row.slice());
}

// Función para resolver el rompecabezas deslizante utilizando backtracking
function solvePuzzleBacktracking(board) {
    if (isSolved(board)) {
        return true;  // Si el tablero está resuelto, retornar true
    }

    const possibleMoves = getPossibleMoves(board);
    for (let move of possibleMoves) {
        const newBoard = applyMove(board, move);
        if (solvePuzzleBacktracking(newBoard)) {
            return true;  // Si se encuentra una solución, retornar true
        }
    }

    return false;  // No hay solución posible desde este estado del tablero
}

// Llamar a la función para resolver el rompecabezas deslizante
document.getElementById('solveButton').addEventListener('click', () => {
    const initialBoardState = getBoardStateFromDOM();
    const isSolved = solvePuzzleBacktracking(initialBoardState);
    if (isSolved) {
        applyBoardStateToDOM(initialBoardState);  // Si se encuentra una solución, aplicar el estado final al DOM
    } else {
        alert('No solution found');
    }
});

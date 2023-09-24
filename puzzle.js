///////////////////////////////////////////////////
////board bar///////
const input = document.querySelector("input");
const num = document.querySelector(".number");
input.addEventListener("input", () => {
    num.textContent = input.value
});

/////////////////////////////////////////////
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
  
    board.style.gridTemplateColumns = `repeat(${input.value}, 1fr)`;
    for (let i = 0; i < input.value * input.value - 1; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.textContent = i + 1;
        piece.style.backgroundColor = '#9e9e9e'; // Adjust background color
        piece.style.color = '#fff'; // Adjust text color
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

});

ret.addEventListener('click', () => {
    view2.style.display = 'none';
    view1.style.display = 'block';

    // Loop through and remove each child element
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
});
////////////////////////////////////////////
// ... (resto del código existente)

// Función para mover una ficha
function moverFicha(event) {
    const piece = event.target;
    if (piece.classList.contains('empty')) {
        // No hacer nada si se hace clic en el espacio vacío
        return;
    }

    const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
    const tamano = Math.sqrt(pieces.length);  // Obtener el tamaño del tablero

    const pieceIndex = pieces.indexOf(piece);
    const emptyPieceIndex = pieces.findIndex(p => p.classList.contains('empty'));

    const [filaFicha, colFicha] = [Math.floor(pieceIndex / tamano), pieceIndex % tamano];
    const [filaVacia, colVacia] = [Math.floor(emptyPieceIndex / tamano), emptyPieceIndex % tamano];

    // Verificar si la ficha está adyacente al espacio vacío
    if (Math.abs(filaFicha - filaVacia) + Math.abs(colFicha - colVacia) === 1) {
        // Intercambiar la ficha con el espacio vacío
        [pieces[pieceIndex].textContent, pieces[emptyPieceIndex].textContent] = [pieces[emptyPieceIndex].textContent, pieces[pieceIndex].textContent];
        pieces[pieceIndex].classList.toggle('empty');
        pieces[emptyPieceIndex].classList.toggle('empty');
        verificarGanador(tamano);
    }
}

// Función para verificar si el jugador ha ganado
function verificarGanador(tamano) {
    const pieces = document.querySelectorAll('.puzzle-piece:not(.empty)');
    const ordenCorrecto = Array.from({ length: tamano * tamano - 1 }, (_, index) => index + 1).join('');
    const ordenActual = Array.from(pieces).map(piece => piece.textContent).join('');
    if (ordenCorrecto === ordenActual) {
        alert('¡Ganaste!');
    }
}

// ... (resto del código existente en el evento click)

// Asegurarse de que cada pieza del puzzle tenga un evento de clic adjunto para mover la ficha
bottonPlay.addEventListener('click', () => {
    // ... (resto del código existente en el evento click)
    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach(piece => piece.addEventListener('click', moverFicha));
});

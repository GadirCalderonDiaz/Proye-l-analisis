let selectedImageUrl = '';
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
            piece.setAttribute('data-number', i); // Asignar un ID basado en el número de pieza
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




// ... (resto del código existente en el evento click)

// Asegurarse de que cada pieza del puzzle tenga un evento de clic adjunto para mover la ficha
bottonPlay.addEventListener('click', () => {
    // ... (resto del código existente en el evento click)
    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach(piece => piece.addEventListener('click', moverFicha));
});

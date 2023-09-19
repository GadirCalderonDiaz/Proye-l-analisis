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
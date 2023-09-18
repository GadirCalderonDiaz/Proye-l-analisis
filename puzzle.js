const input = document.querySelector("input");
const num = document.querySelector(".number");


input.addEventListener("input", () => {
    num.textContent = input.value
});

/////////////////////////////////////////////
//view2
const view1 = document.getElementById('view1'),
    view2 = document.getElementById('view2');

const bottonPlay = document.getElementById('bGame');
const ret = document.getElementById('return');


bottonPlay.addEventListener('click', () => {
    view1.style.display = 'none';
    view2.style.display = 'block';
});

ret.addEventListener('click', () => {
    view2.style.display = 'none';
    view1.style.display = 'block';
});

////////////////////////////////////////////
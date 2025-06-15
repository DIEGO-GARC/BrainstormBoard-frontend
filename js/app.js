let draggedCard = null;

//DOM Elements
const inputIdea = document.getElementById('idea-input');
const addIdeaBtn = document.getElementById('add-idea-btn');
const board = document.getElementById('board');

function createIdeaCard(text){
    if(!text.trim()) return;

    const card = document.createElement('div');
    card.className = 'idea-card';
    card.textContent = text;

    card.setAttribute('draggable', 'true');

    card.addEventListener('dragstart', () => {
        draggedCard = card;
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        draggedCard = null;
    });

    board.appendChild(card);
}

function getDragAfterElement(container, y){
    const elements = [...container.querySelectorAll('.idea-card:not(.dragging)')];

    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if(offset < 0 && offset > closest.offset){
            return {offset: offset, element: child};
        }else{
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element;
}

addIdeaBtn.addEventListener('click', () =>{
    createIdeaCard(inputIdea.value);
    inputIdea.value = '';
    inputIdea.focus();
});

board.addEventListener('dragover', (e) => {
    e.preventDefault();

    const afterElement = getDragAfterElement(board, e.clientY);

    if(afterElement === null){
        board.appendChild(draggedCard);
    }else{
        board.insertBefore(draggedCard, afterElement);
    }

});

/* board.addEventListener('drop', (e) => {
    e.preventDefault();

    if(draggedCard){

        const afterElement = getDragAfterElement(board, e.clientY);

        if(afterElement === null){
            board.appendChild(draggedCard);
        }else{
            board.insertBefore(draggedCard, afterElement);
        }

    }
}); */



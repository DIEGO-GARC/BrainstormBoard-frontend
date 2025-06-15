
let draggedCard = null;

function saveIdeas() {
  const cards = document.querySelectorAll('.idea-card');
   const ideas = Array.from(cards).map(card => {
    // Excluye el texto del botón (✖)
    const btn = card.querySelector('.delete-btn');
    return btn ? card.textContent.replace(btn.textContent, '').trim() : card.textContent.trim();
  });

  localStorage.setItem('brainstorm-ideas', JSON.stringify(ideas));
}

function loadIdeas() {
  const saved = JSON.parse(localStorage.getItem('brainstorm-ideas')) || [];
  saved.forEach(text => createIdeaCard(text));
}


function createIdeaCard(text){
    if(!text.trim()) return;

    const card = document.createElement('div');
    card.className = 'idea-card';
    card.textContent = text;

    const btn = document.createElement('button');
    btn.textContent = '✖';
    btn.classList.add('delete-btn');
    card.appendChild(btn);

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
    saveIdeas();
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

//DOM Elements
const inputIdea = document.getElementById('idea-input');
const addIdeaBtn = document.getElementById('add-idea-btn');
const board = document.getElementById('board');

document.addEventListener('DOMContentLoaded', () => {
  loadIdeas();
});


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

    saveIdeas();
});

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const card = e.target.closest('.idea-card');
    if (card) {
      card.remove();
      saveIdeas();
    }
  }
});
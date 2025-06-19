
let draggedCard = null;


//FUNCIONES UTILIZADAS

//Función para guardar las tarjetas en el localStorage
function saveIdeas() {

  //Se seleccionan todas las tarjetas en el document
  const cards = document.querySelectorAll('.idea-card');

  //Se obtienen un array con el texto de cada tarjeta, exceptuando el botón de eliminado
  const ideas = Array.from(cards).map(card => {
    // Excluye el texto del botón (✖)
    const btn = card.querySelector('.delete-btn');
    return btn ? card.textContent.replace(btn.textContent, '').trim() : card.textContent.trim();
  });

  //Convierte el array en un string y lo guarda en localStorage
  localStorage.setItem('brainstorm-ideas', JSON.stringify(ideas));
}

//Función para cargar las tarjetas guardadas en localStorage
function loadIdeas() {

  //Se obtiene el array de textos
  const saved = JSON.parse(localStorage.getItem('brainstorm-ideas')) || [];

  //Se envia a crear una tarjeta para cada elemento del array
  saved.forEach(text => createIdeaCard(text));
}

//Función para crear una tarjeta
function createIdeaCard(text){

  //Evitando entradas vacias
  if(!text.trim()) return;

  //Creando el elemento HTML y agregando el texto de contenido
  const card = document.createElement('div');
  card.className = 'idea-card';
  card.textContent = text;

  //Creando el botón de borrado y haciendolo hijo de la tarjeta
  const btn = document.createElement('button');
  btn.textContent = '✖';
  btn.classList.add('delete-btn');
  card.appendChild(btn);

  //Añadiendo atributo HTML que permite que la tarjeta sea arrastrable
  card.setAttribute('draggable', 'true');

  //Añadiendo un EventListener que al iniciar el arrastrado, guarda la tarjeta que esta siendo arrastrada y le aplica una clase 
  //específica para darle un diseño especial
  card.addEventListener('dragstart', () => {
      draggedCard = card;
      card.classList.add('dragging');
  });


  //Al terminar de arrastrar una tarjeta se elimina el registro especial que teniamos de ella y se elimina el estilo aplicado
  //al arrastrar
  card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      draggedCard = null;
  });

  //Se hace a la tarjeta un hijo directo de nuestra pizarra
  board.appendChild(card);

  //Se guardan las tarjetas que hay dentro de la pizarra
  saveIdeas();
}


//Función para definir la posición donde se sueltan las tarjetas
function getDragAfterElement(container, y){

  //Obtiene todos los elementos tarjeta con excepción de aquel que está siendo arrastrado
  const elements = [...container.querySelectorAll('.idea-card:not(.dragging)')];

  //Se obtienene el elemento más cercano
  return elements.reduce((closest, child) => {

      //Coordenadas y demiensiones de la tarjeta
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

//Cargando la información guardada en localStorage al cargar el document
document.addEventListener('DOMContentLoaded', () => {
  loadIdeas();
});

//Añadiendo funcionalidad al botón de crear idea
addIdeaBtn.addEventListener('click', () =>{
    createIdeaCard(inputIdea.value);
    inputIdea.value = '';
    inputIdea.focus();
});

//Añadiendo funcioalidad de arrastrado sobre la pizarra
board.addEventListener('dragover', (e) => {
    e.preventDefault();

    //Para obtener la tarjeta que será desplazada
    const afterElement = getDragAfterElement(board, e.clientY);

    if(afterElement === null){
        board.appendChild(draggedCard);
    }else{
        board.insertBefore(draggedCard, afterElement);
    }

    saveIdeas();
});

//Añadiendo funcionalidad a los botones de eliminar
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
    const card = e.target.closest('.idea-card');
    if (card) {
      card.remove();
      saveIdeas();
    }
  }
});
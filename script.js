// Configuración de personas y respuestas
const persons = [
    { name: "Agus", photo: "juego-asociacion/Agus-foto.png", answers: ["juego-asociacion/Agus-respuesta-v2.png", "juego-asociacion/Agus-respuesta2.png", "juego-asociacion/Agus-respuesta3.png"] },
    { name: "Lucas", photo: "juego-asociacion/Lucas-foto.png", answers: ["juego-asociacion/Lucas-respuesta.png", "juego-asociacion/Lucas-respuesta2.png", "juego-asociacion/Lucas-respuesta3.png"] },
    { name: "Sheryl", photo: "juego-asociacion/Sheryl-foto.png", answers: ["juego-asociacion/Sheryl-respuesta.png", "juego-asociacion/Sheryl-respuesta2.png", "juego-asociacion/Sheryl-respuesta3.png"] },
    { name: "Pame", photo: "juego-asociacion/Pame-foto.png", answers: ["juego-asociacion/Pame-respuesta.png", "juego-asociacion/Pame-respuesta2.png", "juego-asociacion/Pame-respuesta3.png"] },
    { name: "Sara", photo: "juego-asociacion/Sara-foto.png", answers: ["juego-asociacion/Sara-respuesta.png", "juego-asociacion/Sara-respuesta2.png"] },
    { name: "Marti", photo: "juego-asociacion/Marti-foto.png", answers: ["juego-asociacion/Marti-respuesta.png", "juego-asociacion/Marti-respuesta2.png"] },
    { name: "Tini", photo: "juego-asociacion/Tini-foto.png", answers: ["juego-asociacion/Tini-respuesta.png", "juego-asociacion/Tini-respuesta2.png", "juego-asociacion/Tini-respuesta3.png"] }
];

const levels = [0, 1, 2]; // 3 niveles
let currentLevel = 0;
let associations = {};
let correctCount = 0;

const gameDiv = document.getElementById('game');
const messageDiv = document.getElementById('message');
const nextLevelBtn = document.getElementById('next-level');

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function renderLevel(level) {
    associations = {};
    correctCount = 0;
    messageDiv.textContent = '';
    nextLevelBtn.classList.add('hidden');
    gameDiv.innerHTML = '';

    // Personas (con dropzones)
    const personsDiv = document.createElement('div');
    personsDiv.className = 'persons';
    persons.forEach(person => {
        const personDiv = document.createElement('div');
        personDiv.className = 'person';

        const img = document.createElement('img');
        img.src = person.photo;
        img.alt = person.name;

        const dropzone = document.createElement('div');
        dropzone.className = 'dropzone';
        dropzone.dataset.person = person.name;

        dropzone.addEventListener('dragover', e => {
            e.preventDefault();
            dropzone.style.background = '#e0e7ff';
        });
        dropzone.addEventListener('dragleave', e => {
            dropzone.style.background = '#fafafa';
        });
        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            dropzone.style.background = '#fafafa';
            const answerName = e.dataTransfer.getData('text/plain');
            handleDrop(person.name, answerName, dropzone);
        });

        personDiv.appendChild(img);
        personDiv.appendChild(dropzone);

        const nameDiv = document.createElement('div');
        nameDiv.className = 'person-name';
        nameDiv.textContent = person.name;
        personDiv.appendChild(nameDiv);

        personsDiv.appendChild(personDiv);
    });

    // Respuestas (mezcladas)
    const answersDiv = document.createElement('div');
    answersDiv.className = 'answers';
    const answers = persons.map(person => ({
        person: person.name,
        img: person.answers[level]
    }));
    shuffle(answers).forEach(answer => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.draggable = true;
        answerDiv.dataset.person = answer.person;

        const img = document.createElement('img');
        img.src = answer.img;
        img.alt = `Respuesta de ${answer.person}`;

        answerDiv.appendChild(img);

        answerDiv.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', answer.person);
            answerDiv.classList.add('dragging');
        });
        answerDiv.addEventListener('dragend', e => {
            answerDiv.classList.remove('dragging');
        });

        answersDiv.appendChild(answerDiv);
    });

    gameDiv.appendChild(personsDiv);
    gameDiv.appendChild(answersDiv);
}

function handleDrop(personName, answerName, dropzone) {
    // Solo permitir un drop por persona
    if (dropzone.classList.contains('filled')) return;

    if (personName === answerName) {
        dropzone.innerHTML = '';
        const img = document.createElement('img');
        const person = persons.find(p => p.name === personName);
        img.src = person.answers[currentLevel];
        img.alt = `Respuesta de ${personName}`;
        dropzone.appendChild(img);
        dropzone.classList.add('filled');
        associations[personName] = true;
        correctCount++;
        // Eliminar la respuesta de la lista
        const answersDiv = document.querySelector('.answers');
        const answerDiv = Array.from(answersDiv.children).find(div => div.dataset.person === answerName);
        if (answerDiv) answerDiv.remove();
    } else {
        dropzone.style.background = '#ffeaea';
        setTimeout(() => {
            dropzone.style.background = '#fafafa';
        }, 500);
    }

    // Si todas las asociaciones están correctas
    if (correctCount === persons.length) {
        if (currentLevel < levels.length - 1) {
            messageDiv.textContent = 'Esaaaa! a seguir';
            nextLevelBtn.textContent = 'Siguiente nivel';
            nextLevelBtn.classList.remove('hidden');
        } else {
            messageDiv.textContent = 'Felicitaciones! podes continuar en el equipo y no serás desvinculado';
            nextLevelBtn.textContent = 'Jugar de nuevo';
            nextLevelBtn.classList.remove('hidden');
        }
    }
}

nextLevelBtn.addEventListener('click', () => {
    if (currentLevel < levels.length - 1) {
        currentLevel++;
        renderLevel(currentLevel);
    } else {
        // Reiniciar juego
        currentLevel = 0;
        renderLevel(currentLevel);
    }
});

// Inicializar juego
renderLevel(currentLevel);

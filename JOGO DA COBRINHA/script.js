const canvas = document.getElementById('gameCanvas');

const ctx = canvas.getContext('2d');

const scoreElement =
    document.getElementById('score');

const restartButton =
    document.getElementById('restartButton');

const telaInicial =
    document.getElementById('telaInicial');

const cardJogador =
    document.getElementById('cardJogador');

const btnJogar =
    document.getElementById('btnJogar');

const nomeJogador =
    document.getElementById('nomeJogador');

const salaJogador =
    document.getElementById('salaJogador');

const rankingLista =
    document.getElementById('rankingLista');

const btnZerarRanking =
    document.getElementById('btnZerarRanking');

const gridSize = 20;

let snake = [];

let food = {};

let dx = 1;
let dy = 0;

let score = 0;

let gameInterval;

let isGameOver = false;

// Gera comida
function generateFood() {

    const colors = [

        'red',
        'yellow',
        'blue',
        'orange',
        'pink',
        'purple',
        'lime',
        'magenta'

    ];

    food = {

        x: Math.floor(
            Math.random() *
            (canvas.width / gridSize)
        ),

        y: Math.floor(
            Math.random() *
            (canvas.height / gridSize)
        ),

        color:
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ]

    };

}

// Desenha
function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Fruta
    ctx.fillStyle = food.color;

    ctx.beginPath();

    ctx.roundRect(

        food.x * gridSize,
        food.y * gridSize,

        gridSize,
        gridSize,

        5

    );

    ctx.fill();

    // Cobra
    ctx.fillStyle = '#00ffff';

    snake.forEach(segment => {

        ctx.fillRect(

            segment.x * gridSize,
            segment.y * gridSize,

            gridSize,
            gridSize

        );

        ctx.strokeStyle = '#00afd7';

        ctx.strokeRect(

            segment.x * gridSize,
            segment.y * gridSize,

            gridSize,
            gridSize

        );

    });

}

// Atualiza
function update() {

    if (isGameOver) return;

    const head = {

        x: snake[0].x + dx,
        y: snake[0].y + dy

    };

    snake.unshift(head);

    // Comeu
    if (

        head.x === food.x &&
        head.y === food.y

    ) {

        score++;

        scoreElement.textContent =
            `Pontuação: ${score}`;

        generateFood();

    } else {

        snake.pop();

    }

    // Colisão
    if (checkCollision()) {

        endGame();

    }

}

// Colisão
function checkCollision() {

    const head = snake[0];

    const hitWall =

        head.x < 0 ||

        head.x >=
        canvas.width / gridSize ||

        head.y < 0 ||

        head.y >=
        canvas.height / gridSize;

    const hitSelf = snake

        .slice(1)

        .some(segment =>

            segment.x === head.x &&
            segment.y === head.y

        );

    return hitWall || hitSelf;

}

// Fim do jogo
function endGame() {

    isGameOver = true;

    clearInterval(gameInterval);

    salvarRanking();

    alert(
        `Game Over! Sua pontuação final foi: ${score}`
    );

}

// Loop
function gameLoop() {

    update();

    draw();

}

// Iniciar
function startGame() {

    snake = [
        { x: 10, y: 10 }
    ];

    dx = 1;
    dy = 0;

    score = 0;

    isGameOver = false;

    scoreElement.textContent =
        'Pontuação: 0';

    if (gameInterval) {

        clearInterval(gameInterval);

    }

    generateFood();

    gameInterval =
        setInterval(gameLoop, 200);

}

// Teclas
document.addEventListener(
    'keydown',
    e => {

        if (
            e.key === 'ArrowUp' &&
            dy !== 1
        ) {

            dx = 0;
            dy = -1;

        }

        if (
            e.key === 'ArrowDown' &&
            dy !== -1
        ) {

            dx = 0;
            dy = 1;

        }

        if (
            e.key === 'ArrowLeft' &&
            dx !== 1
        ) {

            dx = -1;
            dy = 0;

        }

        if (
            e.key === 'ArrowRight' &&
            dx !== -1
        ) {

            dx = 1;
            dy = 0;

        }

    }
);

// Ranking
function carregarRanking() {

    rankingLista.innerHTML = '';

    const ranking =

        JSON.parse(
            localStorage.getItem('ranking')
        ) || [];

    ranking.forEach(
        (jogador, index) => {

            const item =
                document.createElement('li');

            item.textContent =

                `${index + 1}º - ` +

                `${jogador.nome} ` +

                `(${jogador.sala}) - ` +

                `${jogador.score}`;

            rankingLista.appendChild(item);

        }
    );

}

// Salvar ranking
function salvarRanking() {

    const nome =
        nomeJogador.value;

    const sala =
        salaJogador.value;

    if (
        nome === '' ||
        sala === ''
    ) return;

    const ranking =

        JSON.parse(
            localStorage.getItem('ranking')
        ) || [];

    ranking.push({

        nome,
        sala,
        score

    });

    // Ordena
    ranking.sort(
        (a, b) => b.score - a.score
    );

    // Top 20
    const top20 =
        ranking.slice(0, 20);

    localStorage.setItem(

        'ranking',

        JSON.stringify(top20)

    );

    carregarRanking();

}

// Reiniciar
restartButton.addEventListener(
    'click',
    () => {

        // limpa inputs
        nomeJogador.value = '';
        salaJogador.value = '';

        // mostra card novamente
        cardJogador.style.display = 'block';

        // reinicia jogo
        startGame();

    }
);

// Jogar
btnJogar.addEventListener(
    'click',
    () => {

        if (

            nomeJogador.value === '' ||

            salaJogador.value === ''

        ) {

            alert(
                'Preencha nome e sala'
            );

            return;

        }

        // esconde card
        cardJogador.style.display =
            'none';

        startGame();

    }
);

// Zerar ranking
btnZerarRanking.addEventListener(
    'click',
    () => {

        const confirmar = confirm(
            'Tem certeza que deseja apagar o ranking?'
        );

        if (!confirmar) return;

        localStorage.removeItem('ranking');

        carregarRanking();

    }
);

// Carrega ranking
carregarRanking();
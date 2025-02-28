document.addEventListener("DOMContentLoaded", () => {
    const gameArea = document.getElementById("game-area");
    const timerElement = document.getElementById("timer");
    const nextNumberElement = document.getElementById("next-number");

    let numbers = Array.from({ length: 50 }, (_, i) => i + 1);
    let availableNumbers = numbers.slice(0, 25);
    let remainingNumbers = numbers.slice(25);
    let nextNumber = 1;
    let timer = 0;
    let interval;

    function startTimer() {
        interval = setInterval(() => {
            timer++;
            timerElement.textContent = timer;
        }, 1000);
    }

    function createBalloon(number) {
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");
        balloon.textContent = number;
        balloon.style.width = `${Math.random() * 50 + 50}px`;
        balloon.style.height = balloon.style.width;
        balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        // Rastgele bir X konumu belirleme
        const maxWidth = window.innerWidth - 100;
        balloon.style.left = `${Math.random() * maxWidth}px`;

        // Başlangıç konumu ekranın altında
        balloon.style.bottom = "-100px";

        // Hareket ettirme
        let speed = Math.random() * 3 + 2;
        let position = -100;
        function moveBalloon() {
            if (position > window.innerHeight) {
                position = -100;  // Ekran dışına çıkarsa baştan başlasın
            }
            position += speed;
            balloon.style.bottom = `${position}px`;
            requestAnimationFrame(moveBalloon);
        }
        moveBalloon();

        balloon.addEventListener("click", () => popBalloon(balloon, number));
        gameArea.appendChild(balloon);
    }

    function popBalloon(balloon, number) {
        if (number === nextNumber) {
            balloon.remove();
            availableNumbers = availableNumbers.filter(n => n !== number);
            
            if (availableNumbers.length < 25 && remainingNumbers.length > 0) {
                let newNumber = remainingNumbers.shift();
                availableNumbers.push(newNumber);
                createBalloon(newNumber);
            }

            if (nextNumber === 50) {
                clearInterval(interval);
                alert(`Game Over! Time: ${timer} seconds`);
            } else {
                nextNumber++;
                nextNumberElement.textContent = nextNumber;
            }
        }
    }

    function initGame() {
        startTimer();
        availableNumbers.forEach(number => createBalloon(number));
    }

    initGame();
});

document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connect-wallet");
    const walletAddressDisplay = document.getElementById("wallet-address");
    const timerElement = document.getElementById("timer");
    const nextNumberElement = document.getElementById("next-number");
    const gameArea = document.getElementById("game-area");

    let numbers = Array.from({ length: 50 }, (_, i) => i + 1);
    let availableNumbers = numbers.slice(0, 25);
    let remainingNumbers = numbers.slice(25);
    let nextNumber = 1;
    let timer = 0;
    let interval;

    connectWalletBtn.addEventListener("click", async () => {
        console.log("✅ Connect Wallet butonuna basıldı!");
        if (typeof window.ethereum !== "undefined") {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const playerAddress = await signer.getAddress();

                walletAddressDisplay.innerText = `Connected: ${playerAddress}`;
                console.log(`✅ Wallet Connected: ${playerAddress}`);
                startGame(); // Cüzdan bağlanınca oyunu başlat
            } catch (error) {
                console.error("🚨 MetaMask bağlantısı başarısız!", error);
                alert("MetaMask bağlantısı başarısız! Tekrar deneyin.");
            }
        } else {
            alert("🚨 MetaMask yüklü değil! Lütfen MetaMask'ı yükleyin.");
        }
    });

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

    initGame(); // Oyun başlatılır
});

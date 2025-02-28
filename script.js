document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connect-wallet");
    const walletAddressDisplay = document.getElementById("wallet-address");
    const timerDisplay = document.getElementById("timer");

    let gameStarted = false;
    let timer = 0;
    let timerInterval;

    console.log("🔍 Script yüklendi, buton dinleniyor...");

    connectWalletBtn.addEventListener("click", async () => {
        console.log("✅ Connect Wallet butonuna basıldı!");

        if (typeof window.ethereum !== "undefined") {
            try {
                console.log("🔗 MetaMask bağlantısı başlatılıyor...");

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const playerAddress = await signer.getAddress();

                walletAddressDisplay.innerText = `Connected: ${playerAddress}`;
                console.log(`✅ Wallet Connected: ${playerAddress}`);

                // ✅ Cüzdan bağlanınca oyunu başlat!
                startGame();
            } catch (error) {
                console.error("🚨 Wallet connection failed:", error);
                alert("MetaMask connection failed! Please try again.");
            }
        } else {
            alert("🚨 MetaMask yüklü değil! Lütfen MetaMask'ı yükleyin.");
            console.error("🚨 MetaMask not found!");
        }
    });

    function startGame() {
        console.log("🎈 Oyun Başladı!");
        document.getElementById("game-area").innerHTML = ""; // Önceki balonları temizle
        gameStarted = true;
        timer = 0;
        
        // ✅ Timer başlat
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.innerText = timer;
        }, 1000);

        let numbers = Array.from({ length: 50 }, (_, i) => i + 1);
        let availableNumbers = numbers.slice(0, 25);
        availableNumbers.forEach((number) => createBalloon(number));
    }

    function createBalloon(number) {
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");
        balloon.textContent = number;

        const size = Math.random() * 40 + 30;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size}px`;

        const gameArea = document.getElementById("game-area");
        let xPos, yPos, isOverlapping;

        do {
            xPos = Math.random() * (gameArea.clientWidth - size);
            yPos = Math.random() * (gameArea.clientHeight - size);
            isOverlapping = false;

            const balloons = document.getElementsByClassName("balloon");
            for (let i = 0; i < balloons.length; i++) {
                const rect = balloons[i].getBoundingClientRect();
                if (
                    xPos < rect.right + 50 &&
                    xPos + size > rect.left - 50 &&
                    yPos < rect.bottom + 50 &&
                    yPos + size > rect.top - 50
                ) {
                    isOverlapping = true;
                    break;
                }
            }
        } while (isOverlapping);

        balloon.style.left = `${xPos}px`;
        balloon.style.top = `${yPos}px`;
        balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        gameArea.appendChild(balloon);

        let position = 0;
        const speed = Math.random() * 2 + 1;

        const moveInterval = setInterval(() => {
            if (position > window.innerHeight) {
                position = 0;
            } else {
                position += speed;
                balloon.style.top = `${position}px`;
            }
        }, 20);

        balloon.addEventListener("click", () => {
            clearInterval(moveInterval);
            popBalloon(balloon, number);
        });
    }

    // ✅ popBalloon fonksiyonu eklendi
    function popBalloon(balloon, number) {
        console.log(`🎉 Balon ${number} patlatıldı!`);
        
        // Balon patlatıldığında balonu ekrandan kaldır
        balloon.remove();

        // Burada kullanıcıya ödül verme işlemi yapılabilir
        // Örnek: Kullanıcıya token verme işlemi yapılabilir.
    }
});

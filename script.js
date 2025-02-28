document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connect-wallet");
    const walletAddressDisplay = document.getElementById("wallet-address");
    const timerDisplay = document.getElementById("timer");
    const gameArea = document.getElementById("game-area");

    let timer = 0;
    let gameStarted = false;
    let timerInterval;

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
                startGame(); // Cüzdan bağlandıktan sonra oyunu başlat
            } catch (error) {
                console.error("🚨 MetaMask bağlantısı başarısız!", error);
                alert("MetaMask bağlantısı başarısız! Tekrar deneyin.");
            }
        } else {
            alert("🚨 MetaMask yüklü değil! Lütfen MetaMask'ı yükleyin.");
        }
    });

    function startGame() {
        gameStarted = true;
        timer = 0;
        timerDisplay.innerText = timer;

        // Timer başlat
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.innerText = timer;
        }, 1000);

        // 1'den 50'ye kadar balonlar oluşturuluyor
        let numbers = Array.from({ length: 50 }, (_, i) => i + 1);
        let availableNumbers = numbers.slice(0, 25);  // İlk 25 balon
        availableNumbers.forEach((number) => createBalloon(number));
    }

    function createBalloon(number) {
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");
        balloon.textContent = number;

        // Balon boyutları random olacak
        const size = Math.random() * 40 + 30;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size}px`;

        // Ekranda üst üste binmeden balon yerleştirilecek
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

        // Balonların hareket etmesini sağlıyoruz
        let position = -100;
        const speed = Math.random() * 2 + 1;
        const moveInterval = setInterval(() => {
            if (position > window.innerHeight) {
                position = -100; // Ekranın dışına çıktığında başa döner
            } else {
                position += speed;
                balloon.style.top = `${position}px`;
            }
        }, 20);

        balloon.addEventListener("click", () => {
            clearInterval(moveInterval);  // Hareketi durdur
            popBalloon(balloon, number);  // Balonu patlat
        });
    }

    function popBalloon(balloon, number) {
        console.log(`🎉 Balon ${number} patlatıldı!`);
        balloon.remove();  // Balonu kaldır
    }
});

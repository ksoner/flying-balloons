document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connect-wallet");
    const walletAddressDisplay = document.getElementById("wallet-address");
    const timerElement = document.getElementById("timer");
    const nextNumberElement = document.getElementById("next-number");
    const gameArea = document.getElementById("game-area");

    let numbers = Array.from({ length: 10 }, (_, i) => i + 1); // 10 balon
    let availableNumbers = numbers.slice(0, 5);
    let remainingNumbers = numbers.slice(5);
    let nextNumber = 1;
    let timer = 0;
    let interval;

    let provider, signer, contract;
    const contractAddress = "0xFAc83dA7cC9EBd66B35B576a83292c5B51Ab5F50";  // Polygon token contract address
    const contractABI = [
        "function rewardPlayer(address player, uint256 amount) public"
    ];

    connectWalletBtn.addEventListener("click", async () => {
        console.log("✅ Connect Wallet butonuna basıldı!");
        if (typeof window.ethereum !== "undefined") {
            try {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
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
            
            if (availableNumbers.length < 5 && remainingNumbers.length > 0) {
                let newNumber = remainingNumbers.shift();
                availableNumbers.push(newNumber);
                createBalloon(newNumber);
            }

            // ✅ Balon patlatıldığında ödül verelim (1 token)
            rewardPlayer(1);

            if (nextNumber === 10) {
                clearInterval(interval);
                const totalReward = calculateReward();
                alert(`Game Over! Time: ${timer} seconds. You earned ${totalReward} BLN`);

                // ✅ Oyun bittiğinde büyük ödül verelim (token)
                rewardPlayer(totalReward);
            } else {
                nextNumber++;
                nextNumberElement.textContent = nextNumber;
            }
        }
    }

    // Web3 ile ödül gönderme fonksiyonu
    async function rewardPlayer(amount) {
        try {
            const tx = await contract.rewardPlayer(await signer.getAddress(), amount);
            console.log(`✅ Ödül verildi: ${amount} BLN token`);
            
            // İşlem onayı bekleniyor
            await tx.wait();
            console.log(`✅ Token transferi başarıyla tamamlandı: ${tx.hash}`);
        } catch (error) {
            console.error("🚨 Ödül verme işlemi başarısız:", error);
        }
    }

    // Token hesaplama fonksiyonu
    function calculateReward() {
        const reward = Math.floor((1 / timer) * 100);  // (1 / time) * 100
        if (reward <= 0) {
            alert("Üzgünüm, çok 

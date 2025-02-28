const contractAddress = "0xFAc83dA7cC9EBd66B35B576a83292c5B51Ab5F50"; // Senin BLN Token Kontrat Adresin
const contractABI = [
    "function rewardPlayer(address player, uint256 amount) public"
];

let provider, signer, contract, playerAddress;
let timer = 0;
let timerInterval;
let nextNumber = 1;

// MetaMask ile cüzdan bağlama
document.getElementById("connect-wallet").addEventListener("click", async () => {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        playerAddress = await signer.getAddress();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        document.getElementById("wallet-address").innerText = `Connected: ${playerAddress}`;

        console.log(`✅ Wallet Connected: ${playerAddress}`);

        // Oyunu başlat
        startGame();
    } else {
        alert("Please install MetaMask!");
    }
});

// Oyun Başlangıç Fonksiyonu
function startGame() {
    console.log("🎈 Oyun Başladı!");
    document.getElementById("game-area").innerHTML = ""; // Önceki balonları temizle
    nextNumber = 1;

    // Timer başlat
    if (timerInterval) clearInterval(timerInterval);
    timer = 0;
    document.getElementById("timer").textContent = timer;
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById("timer").textContent = timer;
    }, 1000);

    let numbers = Array.from({ length: 50 }, (_, i) => i + 1);
    let availableNumbers = numbers.slice(0, 25);
    let remainingNumbers = numbers.slice(25);

    availableNumbers.forEach((number) => createBalloon(number));
}

// Balon oluşturma fonksiyonu (Üst üste binmeyi önlüyor)
function createBalloon(number) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");
    balloon.textContent = number;

    let xPos, yPos;
    let isOverlapping;
    const gameArea = document.getElementById("game-area");
    const balloons = document.getElementsByClassName("balloon");

    do {
        xPos = Math.random() * (gameArea.clientWidth - 50);
        yPos = Math.random() * (gameArea.clientHeight - 50);
        isOverlapping = false;

        for (let i = 0; i < balloons.length; i++) {
            const rect = balloons[i].getBoundingClientRect();
            if (
                xPos < rect.right + 20 &&
                xPos + 50 > rect.left - 20 &&
                yPos < rect.bottom + 20 &&
                yPos + 50 > rect.top - 20
            ) {
                isOverlapping = true;
                break;
            }
        }
    } while (isOverlapping);

    balloon.style.left = `${xPos}px`;
    balloon.style.top = `${yPos}px`;
    balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    balloon.addEventListener("click", () => popBalloon(balloon, number));
    gameArea.appendChild(balloon);
}

// Balon patlatma işlemi
async function popBalloon(balloon, number) {
    if (number === nextNumber) {
        balloon.remove();

        // BLN Token Transferi
        if (contract) {
            try {
                const tx = await contract.rewardPlayer(playerAddress, ethers.utils.parseUnits("10", 18)); // 10 BLN gönder
                await tx.wait();
                console.log(`✅ 10 BLN sent to ${playerAddress}`);
            } catch (error) {
                console.error("🚨 BLN transfer failed:", error);
            }
        }

        nextNumber++;
        document.getElementById("next-number").textContent = nextNumber;
    }
}

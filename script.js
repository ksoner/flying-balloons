const contractAddress = "0xFAc83dA7cC9EBd66B35B576a83292c5B51Ab5F50"; // Senin BLN Token Kontrat Adresin
const contractABI = [
    "function rewardPlayer(address player, uint256 amount) public"
];

let provider, signer, contract, playerAddress;

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

        // Oyun başladığında balonları yükle
        startGame();
    } else {
        alert("Please install MetaMask!");
    }
});

// Oyun başlangıç fonksiyonu
function startGame() {
    console.log("🎈 Oyun Başladı!");
    const gameArea = document.getElementById("game-area");
    gameArea.innerHTML = ""; // Önceki balonları temizle

    let numbers = Array.from({ length: 50 }, (_, i) => i + 1);
    let availableNumbers = numbers.slice(0, 25);
    let remainingNumbers = numbers.slice(25);
    let nextNumber = 1;

    availableNumbers.forEach((number) => createBalloon(number));
}

// Balon oluşturma fonksiyonu
function createBalloon(number) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");
    balloon.textContent = number;
    balloon.style.left = `${Math.random() * 80 + 10}%`;
    balloon.style.top = `${Math.random() * 80 + 10}%`;
    balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

    balloon.addEventListener("click", () => popBalloon(balloon, number));
    document.getElementById("game-area").appendChild(balloon);
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
    }
}

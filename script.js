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

// Balon oluşturma fonksiyonu
function createBalloon(number) {
    const balloon = document.createElement("div");
    balloon.classList.add("balloon");
    balloon.textContent = number;


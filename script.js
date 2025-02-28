if (typeof ethers === "undefined") {
    console.error("🚨 Ethers.js kütüphanesi yüklenmedi!");
    alert("Ethers.js kütüphanesi eksik! Sayfayı yenileyin veya bağlantınızı kontrol edin.");
}

const contractAddress = "0xFAc83dA7cC9EBd66B35B576a83292c5B51Ab5F50"; // Senin BLN Token Kontrat Adresin
const contractABI = [
    "function rewardPlayer(address player, uint256 amount) public"
];

let provider, signer, contract, playerAddress;

// DOM Yüklendiğinde Butonun Çalışması için
document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connect-wallet");
    const walletAddressDisplay = document.getElementById("wallet-address");

    connectWalletBtn.addEventListener("click", async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                signer = provider.getSigner();
                playerAddress = await signer.getAddress();
                contract = new ethers.Contract(contractAddress, contractABI, signer);

                walletAddressDisplay.innerText = `Connected: ${playerAddress}`;
                console.log(`✅ Wallet Connected: ${playerAddress}`);
            } catch (error) {
                console.error("🚨 Wallet connection failed:", error);
                alert("MetaMask connection failed! Please try again.");
            }
        } else {
            alert("Please install MetaMask!");
        }
    });
});

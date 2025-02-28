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
        document.getElementById("wallet-address").innerText = `Connected: ${playerAddress}`;
        contract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
        alert("Please install MetaMask!");
    }
});

// Balon patlatma işlemi
async function popBalloon(balloon, number) {
    if (number === nextNumber) {
        balloon.remove();
        availableNumbers = availableNumbers.filter(n => n !== number);
        
        if (availableNumbers.length < 25 && remainingNumbers.length > 0) {
            let newNumber = remainingNumbers.shift();
            availableNumbers.push(newNumber);
            createBalloon(newNumber);
        }

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
        nextNumberElement.textContent = nextNumber;

        if (nextNumber === 50) {
            clearInterval(interval);
            alert(`🎉 Game Over! Time: ${timer} seconds`);
        }
    }
}

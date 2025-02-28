document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connect-wallet");
    const walletAddressDisplay = document.getElementById("wallet-address");

    console.log("🔍 Script yüklendi, buton dinleniyor...");

    connectWalletBtn.addEventListener("click", async () => {
        console.log("✅ Butona basıldı!");
        alert("Butona tıkladın, MetaMask açılmalı!");

        if (typeof window.ethereum !== "undefined") {
            try {
                console.log("🔗 MetaMask bağlantısı başlatılıyor...");

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const playerAddress = await signer.getAddress();

                walletAddressDisplay.innerText = `Connected: ${playerAddress}`;
                console.log(`✅ Wallet Connected: ${playerAddress}`);

                // Oyunu başlat
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
});

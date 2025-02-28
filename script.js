document.addEventListener("DOMContentLoaded", () => {
    const connectWalletBtn = document.getElementById("connect-wallet");
    const walletAddressDisplay = document.getElementById("wallet-address");
    const balloon = document.getElementById("balloon");

    // Polygon Network provider URL (RPC URL)
    const providerURL = "https://polygon-rpc.com"; 
    const contractAddress = "0xFAc83dA7cC9EBd66B35B576a83292c5B51Ab5F50";  // BLN token contract address (replace with the actual contract address)
    
    // Token Contract ABI (only transfer function needed here)
    const contractABI = [
        "function transfer(address recipient, uint256 amount) public returns (bool)"
    ];

    let provider, signer, contract;

    connectWalletBtn.addEventListener("click", async () => {
        console.log("✅ Connect Wallet butonuna basıldı!");
        if (typeof window.ethereum !== "undefined") {
            try {
                provider = new ethers.providers.JsonRpcProvider(providerURL);
                await provider.send("eth_requestAccounts", []); // Request accounts
                signer = provider.getSigner(); // Get signer
                const playerAddress = await signer.getAddress();

                walletAddressDisplay.innerText = `Connected: ${playerAddress}`;
                console.log(`✅ Wallet Connected: ${playerAddress}`);

                // Initialize contract
                contract = new ethers.Contract(contractAddress, contractABI, signer);
                console.log("✅ Contract bağlantısı başarılı.");
            } catch (error) {
                console.error("🚨 MetaMask bağlantısı başarısız!", error);
                alert("MetaMask bağlantısı başarısız! Tekrar deneyin.");
            }
        } else {
            alert("🚨 MetaMask yüklü değil! Lütfen MetaMask'ı yükleyin.");
        }
    });

    // Balona tıklayınca 10 token gönder
    balloon.addEventListener("click", async () => {
        try {
            const tx = await contract.transfer(await signer.getAddress(), 10); // Transfer 10 BLN token to user
            console.log(`✅ 10 BLN token gönderildi`);

            await tx.wait();
            alert(`Başarıyla 10 BLN token aldınız!`);
        } catch (error) {
            console.error("🚨 Token gönderimi başarısız:", error);
            alert("Token gönderimi sırasında bir hata oluştu.");
        }
    });
});

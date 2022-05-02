const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({ value: hre.ethers.utils.parseEther("0.001"), });
    await waveContract.deployed();
    console.log("waveportal address ", waveContract.address);
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("contract balance: ", hre.ethers.utils.formatEther(contractBalance));
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
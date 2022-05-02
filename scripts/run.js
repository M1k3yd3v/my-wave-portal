
const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();

    console.log("Deployer account balance %s ", accountBalance)
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({ value: hre.ethers.utils.parseEther("0.1"), });
    await waveContract.deployed();

    console.log("Contract deployed to ", waveContract.address);
    console.log("contract deployed by %s ", deployer);
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("contract balance: ", hre.ethers.utils.formatEther(contractBalance));

    let wavecount;
    wavecount = await waveContract.GetTotalWaves();

    let waveTxn = await waveContract.Wave("hi there! myself pooja");
    await waveTxn.wait();

    waveTxn = await waveContract.Wave("hi there!");
    await waveTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);

    console.log("after transaction contract balance:", hre.ethers.utils.formatEther(contractBalance));
    let wavesall = await waveContract.getAllwaves();
    console.log(wavesall);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();
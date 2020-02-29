usePlugin("@nomiclabs/buidler-truffle5");

// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await web3.eth.getAccounts();

  for (const account of accounts) {
    console.log(account);
  }
});

module.exports = {
  // networks: {
  //   kovan: {
  //     url: "https://mainnet.infura.io/v3/92b37dd5292446f29a718d40afe0bdf2",
  //     from: "0x0D9D05d423C48FaFad62df50Ceb62A47c9c79b26",
  //     accounts: ["0x6C4A2BBF10D87E5C19B40F9C87C08E1E46F61D246200970B9EF5218597D3FBEE"],
  //     gas: 5000000,
  //     gasPrice: 1000,
  //     gasLimit: 4591746
  //   },
  // },
};
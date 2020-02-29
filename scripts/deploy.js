// We require the Buidler Runtime Environment explicitly here. This is optional
// when running the script with `buidler run <script>`: you'll find the Buidler
// Runtime Environment's members available as global variable in that case.
const env = require("@nomiclabs/buidler");

async function main() {
  // You can run Buidler tasks from a script.
  // For example, we make sure everything is compiled by running "compile"
  await env.run("compile");

  // We require the artifacts once our contracts are compiled
  const SocialFund = env.artifacts.require("SocialFund");
  const fundName = "Decentralized Social Fund";
  const fundTerm = 5;
  const fundAmt = 1000;
  const aaveDai = "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd";
  const socialFund = await SocialFund.new(fundName, fundTerm, fundTerm, fundAmt, aaveDai);

  console.log("SocialFund address:", socialFund.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
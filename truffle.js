module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    ropsten: {
      network_id: 3,
      host: "localhost",
      port: 8545,
      from: "0x99821a73bfeece8b3359d78f467bfb214f5caedd",
      gas: 2900000,
      gasPrice: 50000000000,
    }
  }
};

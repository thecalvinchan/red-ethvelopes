module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    rinkeby: {
      network_id: 4,
      host: "localhost",
      port: 8545,
      from: "0xc2C5b79e55c63A7f496c92260695d24C4eC4d911"
    }
  }
};

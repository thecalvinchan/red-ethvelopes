export const FINNEY = 1e15;
export const ETHER = 1e18;

export const convertEtherToWei = (amountInEther) => ( 
  amountInEther * ETHER
);

export const convertWeiToEther = (amountInWei) => ( 
  amountInWei / ETHER
);

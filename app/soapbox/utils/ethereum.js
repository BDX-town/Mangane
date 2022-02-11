export const ethereum = () => window.ethereum;

export const hasEthereum = () => Boolean(ethereum());

// Requests an Ethereum wallet from the browser
// Returns a Promise containing the Ethereum wallet address (string).
export const getWallet = () => {
  return ethereum().request({ method: 'eth_requestAccounts' })
    .then(wallets => wallets[0]);
};

// Asks the browser to sign a message with Ethereum.
// Returns a Promise containing the signature (string).
export const signMessage = (wallet, message) => {
  return ethereum().request({ method: 'personal_sign', params: [message, wallet] });
};

// Combines the above functions.
// Returns an object with the `wallet` and `signature`
export const getWalletAndSign = message => {
  return getWallet().then(wallet => {
    return signMessage(wallet, message).then(signature => {
      return { wallet, signature };
    });
  });
};

import blockExplorers from './block_explorers.json';

export const getExplorerUrl = (ticker, address) => {
  const template = blockExplorers[ticker];
  if (!template) return false;
  return template.replace('{address}', address);
};

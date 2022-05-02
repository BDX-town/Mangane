import { useAppSelector } from 'soapbox/hooks';
import { makeGetAccount } from 'soapbox/selectors';

const getAccount = makeGetAccount();

export const useAccount = (id: string) => useAppSelector((state) => getAccount(state, id));

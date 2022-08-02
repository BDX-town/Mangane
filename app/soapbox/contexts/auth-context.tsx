
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { localState } from 'soapbox/reducers/auth';
import { parseBaseURL } from 'soapbox/utils/auth';

const AuthContext = createContext(null as any);

interface IAccount {
  acct: string
  avatar: string
  avatar_static: string
  bot: boolean
  created_at: string
  discoverable: boolean
  display_name: string
  emojis: string[]
  fields: any // not sure
  followers_count: number
  following_count: number
  group: boolean
  header: string
  header_static: string
  id: string
  last_status_at: string
  location: string
  locked: boolean
  note: string
  statuses_count: number
  url: string
  username: string
  verified: boolean
  website: string
}

export const AuthProvider: React.FC<any> = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<IAccount>();
  const [token, setToken] = useState<string>();
  const [baseApiUri, setBaseApiUri] = useState<string>();

  const value = useMemo(() => ({
    account,
    baseApiUri,
    setAccount,
    token,
  }), [account]);

  useEffect(() => {
    const cachedAuth: any = localState?.toJS();

    if (cachedAuth?.me) {
      setToken(cachedAuth.users[cachedAuth.me].access_token);
      setBaseApiUri(parseBaseURL(cachedAuth.users[cachedAuth.me].url));
    }
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

interface IAuth {
  account: IAccount
  baseApiUri: string
  setAccount(account: IAccount): void
  token: string
}

export const useAuth = (): IAuth => useContext(AuthContext);

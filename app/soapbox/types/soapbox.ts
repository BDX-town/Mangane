import type { Map as ImmutableMap, RecordOf } from 'immutable';
import type { SoapboxConfigRecord } from 'soapbox/normalizers/soapbox/soapbox_config';

export type Me = string | false | null;

interface PromoPanelItemProps {
  icon: string,
  text: string,
  url: string,
  textLocales: ImmutableMap<string, string>,
}

export type PromoPanelItem = RecordOf<PromoPanelItemProps>;

interface FooterItemProps {
  title: string,
  url: string,
}

export type FooterItem = RecordOf<FooterItemProps>;

interface CryptoAddressProps {
  address: string,
  note: string,
  ticker: string,
}

export type CryptoAddress = RecordOf<CryptoAddressProps>;

export type SoapboxConfig = ReturnType<typeof SoapboxConfigRecord>;

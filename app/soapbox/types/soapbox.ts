import {
  PromoPanelItemRecord,
  FooterItemRecord,
  CryptoAddressRecord,
  SoapboxConfigRecord,
} from 'soapbox/normalizers/soapbox/soapbox_config';

type Me = string | null | false | undefined;

type PromoPanelItem = ReturnType<typeof PromoPanelItemRecord>;
type FooterItem = ReturnType<typeof FooterItemRecord>;
type CryptoAddress = ReturnType<typeof CryptoAddressRecord>;
type SoapboxConfig = ReturnType<typeof SoapboxConfigRecord>;

export {
  Me,
  PromoPanelItem,
  FooterItem,
  CryptoAddress,
  SoapboxConfig,
};

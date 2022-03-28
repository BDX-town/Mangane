import {
  PromoPanelItemRecord,
  FooterItemRecord,
  CryptoAddressRecord,
  SoapboxConfigRecord,
} from 'soapbox/normalizers/soapbox/soapbox_config';

type PromoPanelItem = ReturnType<typeof PromoPanelItemRecord>;
type FooterItem = ReturnType<typeof FooterItemRecord>;
type CryptoAddress = ReturnType<typeof CryptoAddressRecord>;
type SoapboxConfig = ReturnType<typeof SoapboxConfigRecord>;

export {
  PromoPanelItem,
  FooterItem,
  CryptoAddress,
  SoapboxConfig,
};

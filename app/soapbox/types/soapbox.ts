import { AdRecord } from 'soapbox/normalizers/soapbox/ad';
import {
  PromoPanelItemRecord,
  FooterItemRecord,
  CryptoAddressRecord,
  SoapboxConfigRecord,
} from 'soapbox/normalizers/soapbox/soapbox_config';

type Me = string | null | false | undefined;

type Ad = ReturnType<typeof AdRecord>;
type PromoPanelItem = ReturnType<typeof PromoPanelItemRecord>;
type FooterItem = ReturnType<typeof FooterItemRecord>;
type CryptoAddress = ReturnType<typeof CryptoAddressRecord>;
type SoapboxConfig = ReturnType<typeof SoapboxConfigRecord>;

export {
  Me,
  Ad,
  PromoPanelItem,
  FooterItem,
  CryptoAddress,
  SoapboxConfig,
};

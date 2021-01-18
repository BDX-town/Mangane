// https://gitlab.com/soapbox-pub/soapbox-fe/-/issues/549
export const normalizePleromaUserFields = obj => {
  obj.is_active    = obj.is_active    === undefined ? !obj.deactivated          : obj.is_active;
  obj.is_confirmed = obj.is_confirmed === undefined ? !obj.confirmation_pending : obj.is_confirmed;
  obj.is_approved  = obj.is_approved  === undefined ? !obj.approval_pending     : obj.is_approved;
  delete obj.deactivated;
  delete obj.confirmation_pending;
  delete obj.approval_pending;
  return obj;
};

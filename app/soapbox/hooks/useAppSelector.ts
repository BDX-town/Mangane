import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { RootState } from 'soapbox/store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

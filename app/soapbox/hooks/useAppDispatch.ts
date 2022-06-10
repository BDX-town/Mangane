import { useDispatch } from 'react-redux';

import type { AppDispatch } from 'soapbox/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
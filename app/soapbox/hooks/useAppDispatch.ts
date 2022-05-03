import { useDispatch } from 'react-redux';

import { AppDispatch } from 'soapbox/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
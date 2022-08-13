import { useQuery } from '@tanstack/react-query';

import { useApi } from 'soapbox/hooks';

type Avatar = {
  account_id: string
  account_avatar: string
  username: string
}

export default function useCarouselAvatars() {
  const api = useApi();

  const getCarouselAvatars = async() => {
    const { data } = await api.get('/api/v1/truth/carousels/avatars');
    return data;
  };

  const result = useQuery<Avatar[]>(['carouselAvatars'], getCarouselAvatars, {
    placeholderData: [],
  });

  const avatars = result.data;

  return {
    ...result,
    data: avatars || [],
  };
}

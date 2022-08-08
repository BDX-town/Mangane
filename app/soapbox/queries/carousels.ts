import { useQuery } from '@tanstack/react-query';

import API from 'soapbox/queries/client';

type Avatar = {
  account_id: string
  account_avatar: string
  username: string
}

const getCarouselAvatars = async() => {
  const { data } = await API.get('/api/v1/truth/carousels/avatars');
  return data;
};

export default function useCarouselAvatars() {
  const result = useQuery<Avatar[]>(['carouselAvatars'], getCarouselAvatars, {
    placeholderData: [],
  });

  const avatars = result.data;

  return {
    ...result,
    data: avatars || [],
  };
}

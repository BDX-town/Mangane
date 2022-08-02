import { useQuery } from '@tanstack/react-query';

import API from './client';

type Avatar = {
  account_id: string
  account_avatar: string
  username: string
}

const getCarouselAvatars = async() => {
  const { data } = await API.get('/api/v1/truth/carousels/avatars');
  return data;
};

export default function useCarouselAvatars(): { data: Avatar[], isFetching: boolean, isError: boolean, isSuccess: boolean } {
  const { data, isFetching, isError, isSuccess } = useQuery<Avatar[]>(['carouselAvatars'], getCarouselAvatars, {
    placeholderData: [],
  });

  const avatars = data as Avatar[];

  return {
    data: avatars,
    isFetching,
    isError,
    isSuccess,
  };
}

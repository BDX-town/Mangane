import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import { fetchCarouselAvatars } from 'soapbox/actions/carousels';
import { replaceHomeTimeline } from 'soapbox/actions/timelines';
import { useAppDispatch, useAppSelector, useDimensions, useFeatures } from 'soapbox/hooks';

import { Card, HStack, Icon, Stack, Text } from '../../components/ui';
import PlaceholderAvatar from '../placeholder/components/placeholder_avatar';

const CarouselItem = ({ avatar }: { avatar: any }) => {
  const dispatch = useAppDispatch();

  const selectedAccountId = useAppSelector(state => state.timelines.getIn(['home', 'feedAccountId']));
  const isSelected = avatar.account_id === selectedAccountId;

  const handleClick = () =>
    isSelected
      ? dispatch(replaceHomeTimeline(null, { maxId: null }))
      : dispatch(replaceHomeTimeline(avatar.account_id, { maxId: null }));

  return (
    <div onClick={handleClick} className='cursor-pointer' role='filter-feed-by-user'>
      <Stack className='w-16 h-auto' space={3}>
        <div className='block mx-auto relative w-14 h-14 rounded-full'>
          {isSelected && (
            <div className='absolute inset-0 bg-primary-600 bg-opacity-50 rounded-full flex items-center justify-center'>
              <Icon src={require('@tabler/icons/icons/x.svg')} className='text-white h-6 w-6' />
            </div>
          )}

          <img
            src={avatar.account_avatar}
            className={classNames({
              ' w-14 h-14 min-w-[56px] rounded-full ring-2 ring-offset-4 dark:ring-offset-slate-800': true,
              'ring-transparent': !isSelected,
              'ring-primary-600': isSelected,
            })}
            alt={avatar.username}
          />
        </div>

        <Text theme='muted' size='sm' truncate align='center' className='leading-3'>{avatar.username}</Text>
      </Stack>
    </div>
  );
};

const FeedCarousel = () => {
  const dispatch = useAppDispatch();
  const features = useFeatures();

  const [cardRef, { width }] = useDimensions();

  const [pageSize, setPageSize] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const avatars = useAppSelector((state) => state.carousels.avatars);
  const isLoading = useAppSelector((state) => state.carousels.isLoading);
  const numberOfPages = Math.floor(avatars.length / pageSize);

  const hasNextPage = currentPage < numberOfPages && numberOfPages > 1;
  const hasPrevPage = currentPage > 1 && numberOfPages > 1;

  const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setCurrentPage((prevPage) => prevPage - 1);

  useEffect(() => {
    if (width) {
      setPageSize(Math.round(width / (80 + 15)));
    }
  }, [width]);

  useEffect(() => {
    if (features.feedUserFiltering) {
      dispatch(fetchCarouselAvatars());
    }
  }, []);

  if (!features.feedUserFiltering) {
    return null;
  }

  return (
    <Card variant='rounded' size='lg' ref={cardRef} className='relative'>
      <div>
        {hasPrevPage && (
          <div>
            <div className='z-10 absolute left-5 top-1/2 -mt-4'>
              <button
                onClick={handlePrevPage}
                className='bg-white/85 backdrop-blur rounded-full h-8 w-8 flex items-center justify-center'
              >
                <Icon src={require('@tabler/icons/icons/chevron-left.svg')} className='text-black dark:text-white h-6 w-6' />
              </button>
            </div>
          </div>
        )}

        <HStack
          alignItems='center'
          space={8}
          className='z-0 flex transition-all duration-200 ease-linear scroll'
          style={{ transform: `translateX(-${(currentPage - 1) * 100}%)` }}
        >
          {isLoading ? (
            new Array(pageSize).fill(0).map((_, idx) => (
              <div className='w-16 text-center' key={idx}>
                <PlaceholderAvatar size={56} withText />
              </div>
            ))
          ) : (
            avatars.map((avatar) => (
              <CarouselItem
                key={avatar.account_id}
                avatar={avatar}
              />
            ))
          )}
        </HStack>

        {hasNextPage && (
          <div>
            <div className='z-10 absolute right-5 top-1/2 -mt-4'>
              <button
                onClick={handleNextPage}
                className='bg-white/85 backdrop-blur rounded-full h-8 w-8 flex items-center justify-center'
              >
                <Icon src={require('@tabler/icons/icons/chevron-right.svg')} className='text-black dark:text-white h-6 w-6' />
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeedCarousel;

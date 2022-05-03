import { AxiosError } from 'axios';
import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { patchMe } from 'soapbox/actions/me';
import snackbar from 'soapbox/actions/snackbar';
import StillImage from 'soapbox/components/still_image';
import { Avatar, Button, Card, CardBody, Icon, Spinner, Stack, Text } from 'soapbox/components/ui';
import { useOwnAccount } from 'soapbox/hooks';
import resizeImage from 'soapbox/utils/resize_image';

/** Default header filenames from various backends */
const DEFAULT_HEADERS = [
  '/headers/original/missing.png', // Mastodon
  '/images/banner.png', // Pleroma
];

/** Check if the avatar is a default avatar */
const isDefaultHeader = (url: string) => {
  return DEFAULT_HEADERS.every(header => url.endsWith(header));
};

const CoverPhotoSelectionStep = ({ onNext }: { onNext: () => void }) => {
  const dispatch = useDispatch();
  const account = useOwnAccount();

  const fileInput = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<string | null>();
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [isDisabled, setDisabled] = React.useState<boolean>(true);
  const isDefault = account ? isDefaultHeader(account.header) : false;

  const openFilePicker = () => {
    fileInput.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxPixels = 1920 * 1080;
    const rawFile = event.target.files?.item(0);

    if (!rawFile) return;

    resizeImage(rawFile, maxPixels).then((file) => {
      const url = file ? URL.createObjectURL(file) : account?.header as string;

      setSelectedFile(url);
      setSubmitting(true);

      const formData = new FormData();
      formData.append('header', file);
      const credentials = dispatch(patchMe(formData));

      Promise.all([credentials]).then(() => {
        setDisabled(false);
        setSubmitting(false);
        onNext();
      }).catch((error: AxiosError) => {
        setSubmitting(false);
        setDisabled(false);
        setSelectedFile(null);

        if (error.response?.status === 422) {
          dispatch(snackbar.error((error.response.data as any).error.replace('Validation failed: ', '')));
        } else {
          dispatch(snackbar.error('An unexpected error occurred. Please try again or skip this step.'));
        }
      });
    }).catch(console.error);
  };

  return (
    <Card variant='rounded' size='xl'>
      <CardBody>
        <div>
          <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
            <Stack space={2}>
              <Text size='2xl' align='center' weight='bold'>
                <FormattedMessage id='onboarding.header.title' defaultMessage='Pick a cover image' />
              </Text>

              <Text theme='muted' align='center'>
                <FormattedMessage id='onboarding.header.subtitle' defaultMessage='This will be shown at the top of your profile.' />
              </Text>
            </Stack>
          </div>

          <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
            <Stack space={10}>
              <div className='border border-solid border-gray-200 rounded-lg'>
                {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
                <div
                  role='button'
                  className='relative h-24 bg-primary-100 rounded-t-md flex items-center justify-center'
                >
                  {selectedFile || account?.header && (
                    <StillImage
                      src={selectedFile || account.header}
                      alt='Profile Header'
                      className='absolute inset-0 object-cover rounded-t-md'
                    />
                  )}

                  {isSubmitting && (
                    <div
                      className='absolute inset-0 rounded-t-md flex justify-center items-center bg-white/80'
                    >
                      <Spinner withText={false} />
                    </div>
                  )}

                  <button
                    onClick={openFilePicker}
                    type='button'
                    className={classNames({
                      'absolute -top-3 -right-3 p-1 bg-primary-600 rounded-full ring-2 ring-white hover:bg-primary-700': true,
                      'opacity-50 pointer-events-none': isSubmitting,
                    })}
                    disabled={isSubmitting}
                  >
                    <Icon src={require('@tabler/icons/icons/plus.svg')} className='text-white w-5 h-5' />
                  </button>

                  <input type='file' className='hidden' ref={fileInput} onChange={handleFileChange} />
                </div>

                <div className='flex flex-col px-4 pb-4'>
                  {account && (
                    <Avatar src={account.avatar} size={64} className='ring-2 ring-white -mt-8 mb-2' />
                  )}

                  <Text weight='bold' size='sm'>{account?.display_name}</Text>
                  <Text theme='muted' size='sm'>@{account?.username}</Text>
                </div>
              </div>

              <Stack justifyContent='center' space={2}>
                <Button block theme='primary' type='button' onClick={onNext} disabled={isDefault && isDisabled || isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Next'}
                </Button>

                {isDisabled && (
                  <Button block theme='link' type='button' onClick={onNext}>
                    <FormattedMessage id='onboarding.skip' defaultMessage='Skip for now' />
                  </Button>
                )}
              </Stack>
            </Stack>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CoverPhotoSelectionStep;

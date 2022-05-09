import { AxiosError } from 'axios';
import classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { patchMe } from 'soapbox/actions/me';
import snackbar from 'soapbox/actions/snackbar';
import { Avatar, Button, Card, CardBody, Icon, Spinner, Stack, Text } from 'soapbox/components/ui';
import { useOwnAccount } from 'soapbox/hooks';
import resizeImage from 'soapbox/utils/resize_image';

/** Default avatar filenames from various backends */
const DEFAULT_AVATARS = [
  '/avatars/original/missing.png', // Mastodon
  '/images/avi.png', // Pleroma
];

/** Check if the avatar is a default avatar */
const isDefaultAvatar = (url: string) => {
  return DEFAULT_AVATARS.every(avatar => url.endsWith(avatar));
};

const AvatarSelectionStep = ({ onNext }: { onNext: () => void }) => {
  const dispatch = useDispatch();
  const account = useOwnAccount();

  const fileInput = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<string | null>();
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [isDisabled, setDisabled] = React.useState<boolean>(true);
  const isDefault = account ? isDefaultAvatar(account.avatar) : false;

  const openFilePicker = () => {
    fileInput.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maxPixels = 400 * 400;
    const rawFile = event.target.files?.item(0);

    if (!rawFile) return;

    resizeImage(rawFile, maxPixels).then((file) => {
      const url = file ? URL.createObjectURL(file) : account?.avatar as string;

      setSelectedFile(url);
      setSubmitting(true);

      const formData = new FormData();
      formData.append('avatar', rawFile);
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
          <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 dark:border-slate-900/50 border-solid -mx-4 sm:-mx-10'>
            <Stack space={2}>
              <Text size='2xl' align='center' weight='bold'>
                <FormattedMessage id='onboarding.avatar.title' defaultMessage='Choose a profile picture' />
              </Text>

              <Text theme='muted' align='center'>
                <FormattedMessage id='onboarding.avatar.subtitle' defaultMessage='Just have fun with it.' />
              </Text>
            </Stack>
          </div>

          <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
            <Stack space={10}>
              <div className='bg-gray-200 rounded-full relative mx-auto'>
                {account && (
                  <Avatar src={selectedFile || account.avatar} size={175} />
                )}

                {isSubmitting && (
                  <div className='absolute inset-0 rounded-full flex justify-center items-center bg-white/80'>
                    <Spinner withText={false} />
                  </div>
                )}

                <button
                  onClick={openFilePicker}
                  type='button'
                  className={classNames({
                    'absolute bottom-3 right-2 p-1 bg-primary-600 rounded-full ring-2 ring-white dark:ring-slate-800 hover:bg-primary-700': true,
                    'opacity-50 pointer-events-none': isSubmitting,
                  })}
                  disabled={isSubmitting}
                >
                  <Icon src={require('@tabler/icons/icons/plus.svg')} className='text-white w-5 h-5' />
                </button>

                <input type='file' className='hidden' ref={fileInput} onChange={handleFileChange} />
              </div>

              <Stack justifyContent='center' space={2}>
                <Button block theme='primary' type='button' onClick={onNext} disabled={isDefault && isDisabled || isSubmitting}>
                  {isSubmitting ? (
                    <FormattedMessage id='onboarding.saving' defaultMessage='Saving…' />
                  ) : (
                    <FormattedMessage id='onboarding.next' defaultMessage='Next' />
                  )}
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

export default AvatarSelectionStep;

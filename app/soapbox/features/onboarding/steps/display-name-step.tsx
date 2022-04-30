import { AxiosError } from 'axios';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { patchMe } from 'soapbox/actions/me';
import snackbar from 'soapbox/actions/snackbar';
import { Button, Card, CardBody, FormGroup, Input, Stack, Text } from 'soapbox/components/ui';
import { useOwnAccount } from 'soapbox/hooks';

const DisplayNameStep = ({ onNext }: { onNext: () => void }) => {
  const dispatch = useDispatch();

  const account = useOwnAccount();
  const [value, setValue] = React.useState<string>(account?.display_name || '');
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const trimmedValue = value.trim();
  const isValid = trimmedValue.length > 0;
  const isDisabled = !isValid || value.length > 30;

  const hintText = React.useMemo(() => {
    const charsLeft = 30 - value.length;
    const suffix = charsLeft === 1 ? 'character remaining' : 'characters remaining';

    return `${charsLeft} ${suffix}`;
  }, [value]);

  const handleSubmit = () => {
    setSubmitting(true);

    const credentials = dispatch(patchMe({ display_name: value }));

    Promise.all([credentials])
      .then(() => {
        setSubmitting(false);
        onNext();
      }).catch((error: AxiosError) => {
        setSubmitting(false);

        if (error.response?.status === 422) {
          setErrors([(error.response.data as any).error.replace('Validation failed: ', '')]);
        } else {
          dispatch(snackbar.error('An unexpected error occurred. Please try again or skip this step.'));
        }
      });
  };

  return (
    <Card variant='rounded' size='xl'>
      <CardBody>
        <div>
          <div className='pb-4 sm:pb-10 mb-4 border-b border-gray-200 border-solid -mx-4 sm:-mx-10'>
            <Stack space={2}>
              <Text size='2xl' align='center' weight='bold'>
                <FormattedMessage id='onboarding.display_name.title' defaultMessage='Choose a display name' />
              </Text>

              <Text theme='muted' align='center'>
                <FormattedMessage id='onboarding.display_name.subtitle' defaultMessage='You can always edit this later.' />
              </Text>
            </Stack>
          </div>

          <div className='sm:pt-10 sm:w-2/3 md:w-1/2 mx-auto'>
            <Stack space={5}>
              <FormGroup
                hintText={hintText}
                labelText='Display name'
                errors={errors}
              >
                <Input
                  onChange={(event) => setValue(event.target.value)}
                  placeholder='Eg. John Smith'
                  type='text'
                  value={value}
                  maxLength={30}
                />
              </FormGroup>

              <Stack justifyContent='center' space={2}>
                <Button
                  block
                  theme='primary'
                  type='submit'
                  disabled={isDisabled || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Saving…' : 'Next'}
                </Button>

                <Button block theme='link' type='button' onClick={onNext}>
                  <FormattedMessage id='onboarding.skip' defaultMessage='Skip for now' />
                </Button>
              </Stack>
            </Stack>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default DisplayNameStep;

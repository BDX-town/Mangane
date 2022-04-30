import { AxiosError } from 'axios';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import { patchMe } from 'soapbox/actions/me';
import snackbar from 'soapbox/actions/snackbar';
import { Button, Card, CardBody, FormGroup, Stack, Text, Textarea } from 'soapbox/components/ui';
import { useOwnAccount } from 'soapbox/hooks';

const BioStep = ({ onNext }: { onNext: () => void }) => {
  const dispatch = useDispatch();

  const account = useOwnAccount();
  const [value, setValue] = React.useState<string>(account?.source.get('note') || '');
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const trimmedValue = value.trim();
  const isValid = trimmedValue.length > 0;
  const isDisabled = !isValid;

  const handleSubmit = () => {
    setSubmitting(true);

    const credentials = dispatch(patchMe({ note: value }));

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
                <FormattedMessage id='onboarding.note.title' defaultMessage='Write a short bio' />
              </Text>

              <Text theme='muted' align='center'>
                <FormattedMessage id='onboarding.note.subtitle' defaultMessage='You can always edit this later.' />
              </Text>
            </Stack>
          </div>

          <Stack space={5}>
            <div className='sm:pt-10 sm:w-2/3 mx-auto'>
              <FormGroup
                hintText='Max 500 characters'
                labelText='Bio'
                errors={errors}
              >
                <Textarea
                  onChange={(event) => setValue(event.target.value)}
                  placeholder='Tell the world a little about yourself…'
                  value={value}
                  maxLength={500}
                />
              </FormGroup>
            </div>

            <div className='sm:w-2/3 md:w-1/2 mx-auto'>
              <Stack justifyContent='center' space={2}>
                <Button
                  block
                  theme='primary'
                  type='submit'
                  disabled={isDisabled || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <FormattedMessage id='onboarding.saving' defaultMessage='Saving…' />
                  ) : (
                    <FormattedMessage id='onboarding.next' defaultMessage='Next' />
                  )}
                </Button>

                <Button block theme='link' type='button' onClick={onNext}>
                  <FormattedMessage id='onboarding.skip' defaultMessage='Skip for now' />
                </Button>
              </Stack>
            </div>
          </Stack>
        </div>
      </CardBody>
    </Card>
  );
};

export default BioStep;

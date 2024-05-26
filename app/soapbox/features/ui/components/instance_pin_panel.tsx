import React from 'react';
import { Link } from 'react-router-dom';


import { getPinnedHosts } from 'soapbox/actions/remote_timeline';
import { Widget, Stack, Text } from 'soapbox/components/ui';
import { ButtonPin } from 'soapbox/features/remote_timeline/components/ButtonPin';
import { useAppSelector } from 'soapbox/hooks';



const PromoPanel: React.FC = () => {
  const pinnedHosts = useAppSelector((s) => getPinnedHosts(s));
  if (pinnedHosts.isEmpty()) return null;


  return (
    <Widget title=''>
      <Stack space={2}>
        {
          pinnedHosts.map((m) => (
            <Text className='flex items-center gap-1' key={m.get('host')}>
              <Link className='flex items-center gap-2' to={`/timeline/${m.get('host')}`}>
                {
                  m.get('favicon') && <img alt={`${m.get('host')} favicon`} src={m.get('favicon')} width={16} height={16} />
                }
                {m.get('host')}
              </Link>
              <ButtonPin instance={m.get('host')} width={16} height={16} />
            </Text>
          ))
        }
      </Stack>
    </Widget>
  );
};

export default PromoPanel;

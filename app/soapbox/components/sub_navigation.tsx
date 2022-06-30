// import throttle from 'lodash/throttle';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
// import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

// import { openModal } from 'soapbox/actions/modals';
// import { useAppDispatch } from 'soapbox/hooks';

import { CardHeader, CardTitle } from './ui';

const messages = defineMessages({
  back: { id: 'column_back_button.label', defaultMessage: 'Back' },
  settings: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
});

interface ISubNavigation {
  message: String,
  settings?: React.ComponentType,
}

const SubNavigation: React.FC<ISubNavigation> = ({ message }) => {
  const intl = useIntl();
  // const dispatch = useAppDispatch();
  const history = useHistory();

  // const ref = useRef(null);

  // const [scrolled, setScrolled] = useState(false);

  // const onOpenSettings = () => {
  //   dispatch(openModal('COMPONENT', { component: Settings }));
  // };

  const handleBackClick = () => {
    if (window.history && window.history.length === 1) {
      history.push('/');
    } else {
      history.goBack();
    }
  };

  // const handleBackKeyUp = (e) => {
  //   if (e.key === 'Enter') {
  //     handleClick();
  //   }
  // }

  // const handleOpenSettings = () => {
  //   onOpenSettings();
  // }

  // useEffect(() => {
  //   const handleScroll = throttle(() => {
  //     if (this.node) {
  //       const { offsetTop } = this.node;

  //       if (offsetTop > 0) {
  //         setScrolled(true);
  //       } else {
  //         setScrolled(false);
  //       }
  //     }
  //   }, 150, { trailing: true });

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  return (
    <CardHeader
      aria-label={intl.formatMessage(messages.back)}
      onBackClick={handleBackClick}
    >
      <CardTitle title={message} />
    </CardHeader>
  );
};

export default SubNavigation;

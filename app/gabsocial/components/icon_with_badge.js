import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'gabsocial/components/icon';
import { shortNumberFormat } from 'gabsocial/utils/numbers';

const IconWithBadge = ({ id, count, className }) => {
	if (count < 1) return null;

	return (
		<i className='icon-with-badge'>
			{count > 0 && <i className='icon-with-badge__badge'>{shortNumberFormat(count)}</i>}
		</i>
	)
};

IconWithBadge.propTypes = {
	id: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
	className: PropTypes.string,
};

export default IconWithBadge;

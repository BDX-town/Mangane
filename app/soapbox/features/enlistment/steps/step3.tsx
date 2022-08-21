import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';

import Icon from './../../../components/icon';

const Step3: React.FC = () => {
    const intl = useIntl();


    return (
        <div className="enlistment__step3 mx-auto py-10 px-5">
            <div>
                <h3 className="text-2xl font-bold">
                    <FormattedMessage id="enlistment.step3.title" />
                </h3>
                <p>
                    <FormattedMessage id="enlistment.step3.description" />
                </p>
            </div>
            <div className="mt-10">
                <div className='flex'>
                    <div className='w-1/2 pr-2'>
                        <h4 className="flex items-center text-xl font-bold">
                            <Icon className="mr-1 w-6 h-6" src={require("@tabler/icons/world.svg")} />
                            <FormattedMessage id="enlistment.step3.public-title" />
                        </h4>
                        <p>
                            <FormattedMessage id="enlistment.step3.public-description" />
                        </p>
                    </div>
                    <div className="w-1/2 pr-2">
                        <h4 className='flex items-center text-xl font-bold'>
                            <Icon className='mr-1 w-6 h-6' src={require("@tabler/icons/lock-open.svg")} />
                            <FormattedMessage id="enlistment.step3.unlisted-title" />
                        </h4>
                        <p>
                            <FormattedMessage id="enlistment.step3.unlisted-description" />
                        </p>
                    </div>
                </div>
                <div className='mt-10 flex'>
                    <div className='w-1/2 pr-2'>
                        <h4 className='flex items-center text-xl font-bold'>
                            <Icon className='mr-1 w-6 h-6' src={require("@tabler/icons/lock.svg")} />
                            <FormattedMessage id="enlistment.step3.followers-title" />
                        </h4>
                        <p>
                            <FormattedMessage id="enlistment.step3.followers-description" />
                        </p>
                    </div>
                    <div className='w-1/2 pl-2'>
                        <h4 className='flex items-center text-xl font-bold'>
                            <Icon className='mr-1 w-6 h-6' src={require("@tabler/icons/mail.svg")} />
                            <FormattedMessage id="enlistment.step3.direct-title" />
                        </h4>
                        <p>
                            <FormattedMessage id="enlistment.step3.direct-description" />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Step3;
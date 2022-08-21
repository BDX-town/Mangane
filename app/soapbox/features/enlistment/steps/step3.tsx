import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import Icon from './../../../components/icon';

const Step3: React.FC = () => {
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
                <div className='flex gap-4'>
                    <div className='flex-grow-1 w-1/2'>
                        <h4 className="items-center text-xl font-bold">
                            <Icon className="inline-block align-middle mr-1 w-6 h-6" src={require("@tabler/icons/world.svg")} />
                            <span className='align-middle'>
                                <FormattedMessage id="enlistment.step3.public-title" />
                            </span>
                        </h4>
                        <p>
                            <FormattedMessage id="enlistment.step3.public-description" />
                        </p>
                    </div>
                    <div className="flex-grow-1 w-1/2">
                        <h4 className='items-center text-xl font-bold'>
                            <Icon className='inline-block align-middle mr-1 w-6 h-6' src={require("@tabler/icons/lock-open.svg")} />
                            <span className='align-middle'>
                                <FormattedMessage id="enlistment.step3.unlisted-title" />
                            </span>
                        </h4>
                        <p>
                            <FormattedMessage id="enlistment.step3.unlisted-description" />
                        </p>
                    </div>
                </div>
                <div className='mt-10 flex gap-4'>
                    <div className='flex-grow-1 w-1/2'>
                        <h4 className='items-center text-xl font-bold'>
                            <Icon className='inline-block align-middle mr-1 w-6 h-6' src={require("@tabler/icons/lock.svg")} />
                            <span className='align-middle'>
                                <FormattedMessage id="enlistment.step3.followers-title" />
                            </span>
                        </h4>
                        <p>
                            <FormattedMessage id="enlistment.step3.followers-description" />
                        </p>
                    </div>
                    <div className='flex-grow-1 w-1/2'>
                        <h4 className='items-center text-xl font-bold'>
                            <Icon className='inline-block align-middle mr-1 w-6 h-6' src={require("@tabler/icons/mail.svg")} />
                            <span className='align-middle'>
                                <FormattedMessage id="enlistment.step3.direct-title" />
                            </span>
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
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { getSettings, changeSettingImmediate } from 'soapbox/actions/settings';
import { useAppSelector } from 'soapbox/hooks';
import classNames from 'classnames';
import { defineMessages, useIntl } from 'react-intl';


import Icon from './../../components/icon';

import Step0 from './steps/step0';

const messages = defineMessages({
    next: { id: 'enlistment.next', defaultMessage: 'Next' },
    pass: { id: 'enlistment.pass', defaultMessage: 'Ignore' },
});

const Steps: Array<React.FC> = [
    Step0,
    Step0,
    Step0,
];

const Enlistment: React.FC = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const [step, setStep] = useState(0);

    const StepComponent: React.FC = Steps[step];

    const done = useAppSelector(state => getSettings(state).get('enlisted') as boolean);

    const onPass = useCallback(() => {
        dispatch(changeSettingImmediate(['enlisted'], true));
    }, []);

    const onNext = useCallback(() => {
        if(step + 1 >= Steps.length) {
            dispatch(changeSettingImmediate(['enlisted'], true));
            return;
        }
        setStep(step + 1);
    }, [step, setStep, dispatch]);

    if(done) return null;

    return (
        <div className="component-enlistment">
            <section className="bg-white dark:bg-slate-800 shadow">
                <StepComponent />
                <div className='enlistment__bar flex justify-between items-center p-4'>
                        <a onClick={onPass} className="text-gray-200 hover:underline opacity-50 cursor-pointer">
                            {intl.formatMessage(messages.pass)}
                        </a>
                        <div className='circles flex items-center'>
                            {
                                Steps.map((e, index) => (
                                    <div className={classNames({
                                        "mx-2 border-2 border-solid border-white": true,
                                        "bg-white": index === step
                                    })}>
                                    </div>
                                ))
                            }
                        </div>
                        <button
                            type="button"
                            className="flex items-center text-gray-200 hover:text-white"
                            onClick={onNext}
                        >
                            {intl.formatMessage(messages.next)}
                            <Icon
                                className="ml-1"
                                src={require('@tabler/icons/arrow-right.svg')}
                            />
                        </button>
                </div>
           </section>
        </div>
    )
};

export default Enlistment;
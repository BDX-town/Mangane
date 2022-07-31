import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import Icon from './../../components/icon';

import Step0 from './steps/step0';

const Steps: Array<React.FC> = [
    Step0,
    Step0,
    Step0,
];

const Enlistment: React.FC = () => {
    const [step, setStep] = useState(0);

    const StepComponent: React.FC = Steps[step];

    const onPass = useCallback(() => {

    }, []);

    const onNext = useCallback(() => {
        setStep(step + 1);
    }, [step, setStep]);

    return (
        <div className="component-enlistment">
            <section className="bg-white dark:bg-slate-800 shadow">
                <StepComponent />
                <div className='enlistment__bar flex justify-between items-center p-4'>
                        <a onClick={onPass} className="text-gray-200 hover:underline opacity-50 cursor-pointer">Passer</a>
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
                            Suivant
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
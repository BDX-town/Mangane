import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
    col1: { id: 'enlistment.step2.col1'},
    col2: { id: 'enlistment.step2.col2'},
    col3: { id: 'enlistment.step2.col3'},
});

const Step4: React.FC = () => {
    const intl = useIntl();

    const instance = useAppSelector((state) => state.instance);

    return (
        <div className="enlistment__step4 mx-auto py-10 px-5">
            <h3 className="text-2xl font-bold">
                <FormattedMessage id="enlistment.step4.title" />
            </h3>
            <p className="font-bold">
                <FormattedMessage id="enlistment.step4.disclaimer" />
            </p>
            <ol className="mt-4 pl-4">
                <li>
                    <FormattedMessage
                        id="enlistment.step4.point-1"
                        values={{
                            complete: <span className='font-bold'><FormattedMessage id="enlistment.step4.complete" /></span>
                        }}   
                    />
                </li>
                <li className="my-3">
                    <FormattedMessage 
                        id="enlistment.step4.point-2"
                        values={{
                            publish: <span className='font-bold'><FormattedMessage id="enlistment.step4.publish" /></span>
                        }}  
                    />
                </li>
                <li>
                    <FormattedMessage 
                        id="enlistment.step4.point-3" 
                        values={{
                            conduct: <a target="_blank" href="/about/tos"><FormattedMessage id="enlistment.step4.conduct" /></a>
                        }}
                    />
                </li>
            </ol>
            <p className="mt-4 pt-4 w-2/3 italic">
                <FormattedMessage 
                    id="enlistment.step4.informations"
                    values={{
                        wiki: <a target="_blank" href="https://joinfediverse.wiki"><FormattedMessage id="enlistment.step4.wiki" /></a>
                    }}
                />
            </p>
        </div>
    )
};

export default Step4;
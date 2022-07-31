import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
    title: { id: 'enlistment.step1.title' },
    left: { id: 'enlistment.step1.left' },
    right: { id: 'enlistment.step1.right' },
    explanation: { id: 'enlistment.step1.explanation' },
});

const Step1: React.FC = () => {
    const intl = useIntl();

    const instance = useAppSelector((state) => state.instance);

    const contactName = useMemo(() => `@${instance.get("email").replace(/@.+/, '')}`, [instance]);
    const contactUrl = useMemo(() => `${instance.get("uri")}/${contactName}`, [contactName]);

    return (
        <div className="enlistment__step1 mx-auto py-10 px-5">
            <h3 className="text-2xl font-bold">
                {intl.formatMessage(messages.title)}
            </h3>
            <div className="flex mt-2">
                <div className="pr-6 w-1/2">
                    <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.left, { title: instance.get("title"), contact_name: contactName, contact_url: contactUrl })}} />
                </div>
                <div className="pl-6 w-1/2">
                    <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.right)}} />
                </div>
            </div>
            <div className="italic mt-8">
                {intl.formatMessage(messages.explanation)}
            </div>
        </div>
    )
};

export default Step1;
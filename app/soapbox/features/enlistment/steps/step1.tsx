import React, { useMemo } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
    right: { id: 'enlistment.step1.right'},
});

const Step1: React.FC = () => {
    const intl = useIntl();

    const instance = useAppSelector((state) => state.instance);

    const contactName = useMemo(() => `@${instance.get("email").replace(/@.+/, '')}`, [instance]);
    const contactUrl = useMemo(() => `${instance.get("uri")}/${contactName}`, [contactName]);

    return (
        <div className="enlistment__step1 mx-auto py-10 px-5">
            <h3 className="text-2xl font-bold">
                <FormattedMessage id="enlistment.step1.title" />
            </h3>
            <div className="flex mt-2">
                <div className="pr-6 w-1/2">
                    <p>
                        <FormattedMessage
                            id="enlistment.step1.left"
                            values={{
                                title: instance.get("title"),
                                username: (
                                    <span className="font-bold"><FormattedMessage id="enlistment.step1.username" /></span> 
                                ),
                                contact: (
                                    <a href={contactUrl} target="_blank">
                                        {contactName}
                                    </a>
                                ),
                                br: <br />
                            }}
                        />
                    </p>
                </div>
                <div className="pl-6 w-1/2">
                    <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.right)}} />
                </div>
            </div>
            <div className="italic mt-8">
                <FormattedMessage id="enlistment.step1.explanation" />
            </div>
        </div>
    )
};

export default Step1;
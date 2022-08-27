import React from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
    col1: { id: 'enlistment.step2.col1', defaultMessage: "Here you are on familiar ground: only your publications and those of the people you follow will be displayed on this thread."},
    col2: { id: 'enlistment.step2.col2', defaultMessage: "Here is a bit like your neighborhood: you will only find publications from members of this server, whether you follow them or not."},
    col3: { id: 'enlistment.step2.col3', defaultMessage: "Think outside the box and go explore the rest of the world: this thread displays posts from all known instances."},
});

const Step2: React.FC = () => {
    const intl = useIntl();

    const instance = useAppSelector((state) => state.instance);

    return (
        <div className="enlistment__step2 mx-auto py-10 px-5">
            <div className="flex mt-3 gap-3">
                <div className="flex-grow-1">
                    <h3 className="text-xl font-bold">
                        <FormattedMessage id="enlistment.step2.title1" defaultMessage="Home" />
                    </h3>
                    <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.col1)}} />
                    <p className="mt-4 italic">
                        <FormattedMessage id="enlistment.step2.explanation1" defaultMessage="At first it will be a little empty but don't worry we can help you fill it!" />
                    </p>
                </div>
                <div className="flex-grow-1">
                    <h3 className="text-xl font-bold">
                        {instance.get("title")}
                    </h3>
                    <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.col2)}} />
                    <p className="mt-4 italic">
                        <FormattedMessage id="enlistment.step2.explanation2" defaultMessage={"We usually call it \"local\" thread"} />
                    </p>
                </div>
                <div className="flex-grow-1">
                    <h3 className="text-xl font-bold">
                        <FormattedMessage id="enlistment.step2.title3" defaultMessage="Discover" />
                    </h3>
                    <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.col3)}} />
                    <p className="mt-4 italic">
                        <FormattedMessage id="enlistment.step2.explanation3" defaultMessage={"We usually call it \"global\" or \"federated\" thread"} />
                    </p>
                </div>
            </div>
        </div>
    )
};

export default Step2;
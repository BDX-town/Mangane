import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useOwnAccount, useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
    title: { id: 'enlistment.step0.title', defaultMessage: "Bienvenue sur Mangane !"},
    body: { id: 'enlistment.step0.body', defaultMessage: "C’est cet identifiant que tu peux partager sur le fediverse" },
    username: { id: 'enlistment.step0.username', defaultMessage: "ton pseudo complet"},
    explanation: { id: 'enlistment.step0.explanation', defaultMessage: "Pas d’inquiétude cependant, lors de la rédaction d’un post, l’autosuggestion t’aidera à trouver la bonne mention ! Par ailleurs si tu réponds à un post, la mention sera automatiquement écrite de la bonne manière."},
});

const Step0: React.FC = () => {
    const intl = useIntl();
    const account = useOwnAccount();
    const instance = useAppSelector((state: any) => state.instance);

    return (
        <div className="enlistment__step0 mx-auto py-10 px-5">
            <h3 className="text-2xl font-bold">
                {intl.formatMessage(messages.title)}
            </h3>
            <p className="mb-5">
                <span dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.body)}} />
                &nbsp;
                <span className="font-bold">
                    {instance.get("uri").replace(/https?:\/\//, '')}
                </span>
            </p>

            <h4 className="uppercase text-lg mb-2">
                {intl.formatMessage(messages.username)}
            </h4>

            <div className="enlisted__step0__username inline-block rounded p-1 text-gray-200 text-lg font-bold">
                @{account?.acct}@{instance.get("uri").replace(/https?:\/\//, '')}
            </div>
            <div className="italic mt-2">
                {intl.formatMessage(messages.explanation)}
            </div>
        </div>
    )
};

export default Step0;
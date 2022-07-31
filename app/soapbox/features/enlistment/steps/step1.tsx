import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
    title: { id: 'enlistment.step1.title', defaultMessage: "Comment ça marche ?" },
    left: { id: 'enlistment.step1.left', defaultMessage: "Ici tu es sur {title}. Si tu échanges avec des gens de la même instance que toi, tu peux les mentionners avec simplement <span class='font-bold'>@pseudo</span><br/><br />ex: <a href='{contact_url}'>{contact_name}</a>, si tu veux parler à l’admin de {title}"},
    right: { id: 'enlistment.step1.right', defaultMessage: "Si tu échanges avec une personne d’une autre instance il faudra la mentionner avec son <span class='font-bold'>@pseudo@instance</span><br/><br/> ex: <a href='https://oslo.town/@matt'>@matt@oslo.town</a>, si tu veux parler à l’admin d’Oslo.town"},
    explanation: { id: 'enlistment.step1.explanation', defaultMessage: "Pas d’inquiétude cependant, lors de la rédaction d’un post, l’autosuggestion t’aidera à trouver la bonne mention ! Par ailleurs si tu réponds à un post, la mention sera automatiquement écrite de la bonne manière."},
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
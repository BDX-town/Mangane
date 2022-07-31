import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useOwnAccount, useAppSelector } from 'soapbox/hooks';

const messages = defineMessages({
    title1: { id: 'enlistment.step2.title1', defaultMessage: "Home" },
    title3: { id: 'enlistment.step2.title3', defaultMessage: "Découvrir" },
    col1: { id: 'enlistment.step2.col1', defaultMessage: "Ici tu es en terrain connu : seules tes publications et celles des personnes que tu suis s’afficheront sur ce fil."},
    col2: { id: 'enlistment.step2.col2', defaultMessage:  "Ici c’est un peu ton quartier : tu n’y trouveras que des publications venant de membres de cette instance, que tu les suives ou non."},
    col3: { id: 'enlistment.step2.col3', defaultMessage: "Sors des sentiers battus et va explorer le reste du monde : ce fil affiche les publications de l’ensemble des instances connues."},
    explanation1: { id: 'enlistment.step2.explanation1', defaultMessage: "Au départ ce sera un peu vide mais pas de souci on peut t’aider à le fournir !"},
    explanation2: { id: 'enlistment.step2.explanation2', defaultMessage: "On l’appelle généralementfil “local”."},
    explanation3: { id: 'enlistment.step2.explanation3', defaultMessage: "On l’appelle généralementfil “global” ou “fédéré”."},
});

const Step2: React.FC = () => {
    const intl = useIntl();

    const instance = useAppSelector((state) => state.instance);

    return (
        <div className="enlistment__step2 mx-auto py-10 px-5">
            <div className="flex mt-3">
                <div className="w-1/3">
                    <h3 className="text-xl font-bold">
                        {intl.formatMessage(messages.title1)}
                    </h3>
                    <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.col1)}} />
                    <p className="mt-4 italic">
                        {intl.formatMessage(messages.explanation1)}
                    </p>
                </div>
                <div className="mx-6 w-1/3">
                    <h3 className="text-xl font-bold">
                        {instance.get("title")}
                    </h3>
                    <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.col2)}} />
                    <p className="mt-4 italic">
                        {intl.formatMessage(messages.explanation2)}
                    </p>
                </div>
                <div className="w-1/3">
                    <h3 className="text-xl font-bold">
                        {intl.formatMessage(messages.title3)}
                    </h3>
                    <p dangerouslySetInnerHTML={{ __html: intl.formatMessage(messages.col3)}} />
                    <p className="mt-4 italic">
                        {intl.formatMessage(messages.explanation3)}
                    </p>
                </div>
            </div>
        </div>
    )
};

export default Step2;
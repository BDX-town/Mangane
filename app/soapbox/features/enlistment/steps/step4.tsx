import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppSelector } from 'soapbox/hooks';

const Step4: React.FC = () => {
    const instance = useAppSelector((state) => state.instance);

    return (
        <div className="enlistment__step4 mx-auto py-10 px-5">
            <h3 className="text-2xl font-bold">
                <FormattedMessage id="enlistment.step4.title" defaultMessage="What's next ?" />
            </h3>
            <p className="font-bold">
                <FormattedMessage id="enlistment.step4.disclaimer" defaultMessage="You're almost ready to dive into the deep end."/>
            </p>
            <ol className="mt-4 pl-4">
                <li>
                    <FormattedMessage
                        id="enlistment.step4.point-1"
                        defaultMessage="Think of {complete} (profile photo, banner and bio). You can even add hashtags to let people know your interests."
                        values={{
                            complete: <span className='font-bold'><FormattedMessage id="enlistment.step4.complete" defaultMessage="complete your profile" /></span>
                        }}   
                    />
                </li>
                <li className="my-3">
                    <FormattedMessage 
                        id="enlistment.step4.point-2"
                        defaultMessage="It is customary to {publish} to make you discover. Do not forget the hashtags #introduction or #presentation."
                        values={{
                            publish: <span className='font-bold'><FormattedMessage id="enlistment.step4.publish" defaultMessage="publish a presentation" /></span>
                        }}  
                    />
                </li>
                <li>
                    <FormattedMessage 
                        id="enlistment.step4.point-3" 
                        defaultMessage="Let's go, it's up to you to discover and tame the places, find people to follow, share your ideas while respecting the {conduct} and the values of {title}."
                        values={{
                            title: instance.get("title"),
                            conduct: <a target="_blank" href="/about/tos"><FormattedMessage id="enlistment.step4.conduct" defaultMessage="code of conduct" /></a>
                        }}
                    />
                </li>
            </ol>
            <p className="mt-4 pt-4 w-2/3 italic">
                <FormattedMessage 
                    id="enlistment.step4.informations"
                    defaultMessage="If you have any questions about this new playground, do not hesitate to ask questions to the people you meet online, the community is quite caring and welcoming. You will also find more comprehensive online resources {wiki}."
                    values={{
                        wiki: <a target="_blank" href="https://joinfediverse.wiki"><FormattedMessage id="enlistment.step4.wiki" defaultMessage="on the official wiki" /></a>
                    }}
                />
            </p>
        </div>
    )
};

export default Step4;
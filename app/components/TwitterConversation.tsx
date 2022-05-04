import { Fragment } from 'react';
import { TwitterConversationProps } from '~/api/twitter';
import MissingTweet from '~/components/MissingTweet';
import Tweet from '~/components/Tweet';

export default function TwitterConversation(props:TwitterConversationProps) {
    return (
        <div className='activity-list-item twitter-conversation'>
            {props.tweets.map(tweet => {
                const className = tweet.children?.length ? 'has-replies' : '';
                return (
                    <Fragment key={tweet.id}>
                        {tweet.isMissing ? <MissingTweet id={tweet.id} className={className} /> : (
                            <Tweet className={className} {...tweet} />
                        )}
                        {(tweet.children?.length > 0) ? (
                            <div className="tweet-replies">
                                {tweet.children.map(reply => reply.isMissing ? <MissingTweet /> : (
                                    <Tweet key={reply.id} isReferencedTweet {...reply} />
                                ))}
                            </div>
                        ) : null}
                    </Fragment>
                );
            })}
        </div>
    );
}
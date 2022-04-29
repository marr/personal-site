import { TwitterConversationProps } from '~/api/twitter';
import Tweet from '~/components/Tweet';

export default function TwitterConversation(props:TwitterConversationProps) {
    return (
        <div className='activity-list-item twitter-conversation'>
            {props.tweets.map(tweet => (
                <>
                    <Tweet {...tweet} />
                    {/* {(tweet.referencedTweets.length > 0) ? (
                        <div className="tweet-replies">
                            {tweet.referencedTweets.map(reply => (
                                <Tweet key={reply._id} isReferencedTweet {...reply} />
                            ))}
                        </div>
                    ) : null} */}
                </>
            ))}
        </div>
    );
}
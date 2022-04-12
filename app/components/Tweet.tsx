import twitter from 'twitter-text';

import TwitterVerified from './TwitterVerified';
import { formatDateTime } from '~/utils/date';
import PermalinkIcon from './PermalinkIcon';
import type { TweetProps } from '~/api/twitter';
interface TweetAuthorProps {
    id: string,
    name: string,
    profileImageUrl: string,
    url: string,
    username: string,
    verified: boolean
};

interface MediaProps {
    keys: string[],
    media: any
};

interface TweetTextProps {
    text: string,
    entities: any[]
};

const Media = (props: MediaProps) => {
    const { keys, media } = props;
    return (
        <div className="tweet-media">
            {keys.map(key => {
                if (!media[key]) {
                    console.log(key)
                }
                return (
                    <img
                        key={key}
                        className="tweet-media-image"
                        height={media[key].height}
                        src={media[key].url || media[key].previewImageUrl}
                        width={media[key].width}
                    />
                );
            })}
        </div>
    );
}

const TweetAuthor = (props: TweetAuthorProps) => {
    const authorUrl = `https://twitter.com/${props.username}`;
    return (
        <a className="tweet-author" href={authorUrl}>
            <img alt={props.username} className="tweet-author-image" src={props.profileImageUrl} />
            <div className="tweet-author-info">
                <span>
                    <strong>{props.name}</strong>
                    {props.verified && <TwitterVerified />}
                </span>
                @{props.username}
            </div>
        </a>
    );
}

const TweetText = (props: TweetTextProps) => {
    const __html = twitter.autoLink(props.text, { urlEntities: props.entities });
    return <p className="tweet-text" dangerouslySetInnerHTML={{ __html }} />;
}

export default function Tweet (props: TweetProps) {
    const {
        attachments,
        authorId,
        authors,
        createdAt,
        entities,
        id,
        isReferencedTweet,
        media,
        referencedTweets = [],
        text,
        tweets
    } = props;
    const { mediaKeys } = attachments || {};

    const parents = referencedTweets.map(tweet => {
        const ref = tweets[tweet.id];
        if (!ref) {
            return <p key={tweet.id} className="tweet tweet-missing">Tweet not found</p>
        }
        return (
            <Tweet
                key={tweet.id}
                {...ref}
                isReferencedTweet
                attachments={{}}
                authors={authors}
                referencedTweets={[]}
            />
        );
    });

    const author = authors[authorId];

    const url = `https://twitter.com/${author?.username || 'twitter'}/status/${id}`;
    
    let timeStamp = '';
    if (createdAt) {
        timeStamp = formatDateTime(new Date(createdAt));
    }
    
    const permaLink = (
        <a className="tweet-link" href={url}>
            {!isReferencedTweet && <PermalinkIcon />}
            <time className="tweet-time" dateTime={createdAt}>{timeStamp}</time>
        </a>
    );

    return (
        <div className="tweet">
            <div className="tweet-header">
                {author && (
                    <TweetAuthor {...author} />
                )}
                {isReferencedTweet && timeStamp && url && (
                    <>·{permaLink}</>
                )}
            </div>
            <TweetText entities={entities?.urls} text={text} />
            {mediaKeys && <Media keys={mediaKeys} media={media} />}
            {parents}
            <div className="tweet-footer">
                {!isReferencedTweet && timeStamp && url && permaLink}
            </div>
        </div>
    );
}

import twitter from 'twitter-text';

import TwitterVerified from './TwitterVerified';
import { formatDateTime } from '~/utils/date';
import PermalinkIcon from './PermalinkIcon';

interface TweetProps {
    id: string,
    author_id: string,
    created_at: string,
    isReferencedTweet: boolean,
    text: string,
    referenced_tweets: any[],
    attachments: any,
    authors: any,
    entities: any,
    media: any,
    tweets: any
};

interface TweetAuthorProps {
    id: string,
    name: string,
    profile_image_url: string,
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
                        src={media[key].url || media[key].preview_image_url}
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
            <img alt={props.username} className="tweet-author-image" src={props.profile_image_url} />
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
        author_id,
        authors,
        created_at,
        entities,
        id,
        isReferencedTweet,
        media,
        referenced_tweets = [],
        text,
        tweets
    } = props;
    const { media_keys } = attachments || {};

    const parents = referenced_tweets.map(tweet => {
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
                referenced_tweets={[]}
            />
        );
    });

    const author = authors[author_id];

    const url = `https://twitter.com/${author?.username || 'twitter'}/status/${id}`;
    
    let timeStamp = '';
    if (created_at) {
        timeStamp = formatDateTime(new Date(created_at));
    }
    
    const permaLink = (
        <a className="tweet-link" href={url}>
            {!isReferencedTweet && <PermalinkIcon />}
            <time className="tweet-time" dateTime={created_at}>{timeStamp}</time>
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
            {media_keys && <Media keys={media_keys} media={media} />}
            {parents}
            <div className="tweet-footer">
                {!isReferencedTweet && timeStamp && url && permaLink}
            </div>
        </div>
    );
}

import clsx from 'clsx';
import twitter from 'twitter-text';

import TwitterVerified from './TwitterVerified';
import { formatDateTime } from '~/utils/date';
import PermalinkIcon from './PermalinkIcon';
import RetweetIcon from './RetweetIcon';
import type { MediaProps, TweetAuthorProps, TweetTextProps, TweetProps } from '~/api/twitter';
import MissingTweet from './MissingTweet';

const Media = (props: MediaProps) => {
    const { entities: links = [], height, width, url, previewImageUrl } = props;
    const link = links.find(({ media_key: mediaKey }) => mediaKey === props.mediaKey);
    return (
        <a className="tweet-media-link" href={link?.url}>
            <img
                className="tweet-media-image"
                height={height}
                src={url || previewImageUrl}
                width={width}
            />
        </a> 
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

const RetweetHeader = (props:any) => {
    const { name } = props.retweetBy;
    return <div className="tweet-retweet-header"><RetweetIcon /> by {name}</div>
}

export default function Tweet (props: TweetProps) {
    const {
        id,
        author,
        className,
        createdAt,
        entities,
        isReferencedTweet,
        media: mediaItems,
        quoted,
        retweetBy,
        retweetOf,
        text
    } = props;

    if (retweetOf) {
        return <Tweet {...retweetOf} retweetBy={author} />;
    }

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

    let quoteTweets;
    if (quoted?.length > 0) {
        quoteTweets = (
            <div className="quote-tweets">
                {quoted.map(quoteTweet => quoteTweet.isMissing ? (
                    <MissingTweet key={quoteTweet.id} id={quoteTweet.id} />
                ) : (
                    <Tweet key={quoteTweet.id} {...quoteTweet} isReferencedTweet />
                ))}
            </div>
        );
    }

    let media = null;
    if (mediaItems?.length > 0) {
        media = (
            <div className="tweet-media">
                {mediaItems.map(mediaItem => (
                    <Media
                        key={mediaItem.mediaKey}
                        {...mediaItem}
                        entities={entities?.urls}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className={clsx('tweet', className, { 'referenced-tweet': isReferencedTweet })}>
            {retweetBy && <RetweetHeader retweetBy={retweetBy} />}
            <div className="tweet-header">
                {author && (
                    <TweetAuthor {...author} />
                )}
                {isReferencedTweet && timeStamp && url && (
                    <>·{permaLink}</>
                )}
            </div>
            <TweetText entities={entities?.urls} text={text} />
            {media}
            {quoteTweets}
            <div className="tweet-footer">
                {!isReferencedTweet && timeStamp && url && permaLink}
            </div>
        </div>
    );
}

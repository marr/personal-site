import clsx from 'clsx';
import twitter from 'twitter-text';

import TwitterVerified from './TwitterVerified';
import { formatDateTime } from '~/utils/date';
import PermalinkIcon from './PermalinkIcon';
import type { MediaProps, TweetAuthorProps, TweetTextProps, TweetProps } from '~/api/twitter';

const Media = (props: MediaProps) => {
    const { height, width, url, previewImageUrl } = props;
    return (
        <img
            className="tweet-media-image"
            height={height}
            src={url || previewImageUrl}
            width={width}
        />
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
        id,
        author,
        children,
        className,
        createdAt,
        entities,
        isReferencedTweet,
        media: mediaItems,
        text,
        type
    } = props;

    // if (type === 'replied_to' && isReferencedTweet) return null;

    const parents = children?.map((tweet: any) => {
        return (
            <Tweet
                key={tweet.id}
                {...tweet}
                isReferencedTweet
            />
        );
    });

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

    let media = null;
    if (mediaItems?.length > 0) {
        media = (
            <div className="tweet-media">
                {mediaItems.map(mediaItem => <Media key={mediaItem.mediaKey} {...mediaItem} />)}
            </div>
        )
    }

    return (
        <div className={clsx('tweet', className)}>
            {type}
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
            {/* {parents} */}
            <div className="tweet-footer">
                {!isReferencedTweet && timeStamp && url && permaLink}
            </div>
        </div>
    );
}

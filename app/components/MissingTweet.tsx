import clsx from 'clsx';

export default function MissingTweet ({ className, id }: any) {
    return (
        <a className={clsx('tweet tweet-missing', className)} href={`https://twitter.com/twitter/status/${id}`}>
            See discussion
        </a>
    );
}

import clsx from 'clsx';

export default function MissingTweet ({ className, id }: any) {
    return (
        <a className={clsx('tweet missing-tweet', className)} href={`https://twitter.com/twitter/status/${id}`}>
            See discussion
        </a>
    );
}

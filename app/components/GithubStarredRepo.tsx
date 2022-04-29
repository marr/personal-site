import clsx from 'clsx';
import { replaceGithubShortcodes } from '~/api/github';
import type { GithubStarProps } from '~/api/github';
import { formatDateTime } from '~/utils/date';
import { sanitizeHTML } from '~/utils/general';

export default function GithubStarredRepo (props: GithubStarProps) {
  const {
      className,
      starredAt,
      repo: {
          description,
          fullName,
          htmlUrl
      }
  } = props;

  const ogImageUrl = `https://opengraph.githubassets.com/1/${fullName}`
  const itemStyle = {
      backgroundImage: `url(${ogImageUrl})`
  }

  return (
      <div className={clsx('github-star', className)}  style={itemStyle}>
          <a className="activity-name" href={htmlUrl}>{fullName}</a>
          {description && (
              <p className="activity-description" dangerouslySetInnerHTML={{
                  __html: replaceGithubShortcodes(sanitizeHTML(description))
              }} />
          )}
          {starredAt && (
              <time className="timestamp starred-at" dateTime={starredAt}>
                  <a href={htmlUrl}>{formatDateTime(new Date(starredAt))}</a>
              </time>
          )}
      </div>
  );
}
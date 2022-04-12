import { replaceGithubShortcodes } from '~/api/github';
import type { GithubStarProps } from '~/api/github';
import { formatDateTime } from '~/utils/date';
import { sanitizeHTML } from '~/utils/general';

export default function GithubStarredRepo (props: GithubStarProps) {
  const {
      starred_at: starredAt,
      repo: {
          description,
          full_name: fullName,
          html_url: htmlUrl,
          id
      }
  } = props;

  const ogImageUrl = `https://opengraph.githubassets.com/1/${fullName}`
  const itemStyle = {
      backgroundImage: `url(${ogImageUrl})`
  }

  return (
      <a className="activity-list-item" href={htmlUrl} style={itemStyle}>
          <span className="activity-name">{fullName}</span>
          {description && (
              <p className="activity-description" dangerouslySetInnerHTML={{
                  __html: replaceGithubShortcodes(sanitizeHTML(description))
              }} />
          )}
          {starredAt && (
              <time className="timestamp starred-at" dateTime={starredAt}>
                  {formatDateTime(new Date(starredAt))}
              </time>
          )}
      </a>
  );
}
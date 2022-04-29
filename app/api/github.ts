import camelcaseKeys from 'camelcase-keys';
import _emojis from '~/assets/emojis.json';

type GithubEmojis = typeof _emojis;

export type GithubRepo = {
    description: string,
    fullName: string,
    htmlUrl: string,
    id: string
};

export type GithubStarProps = {
    className?: string,
    starredAt: string,
    repo: GithubRepo
};

const emojis: GithubEmojis = _emojis;

export const replaceGithubShortcodes = (str: string) => str.replaceAll(/:(\w*):/g, (_, key: keyof GithubEmojis) => {
    return `<img src=${emojis[key]} width="20" height="20" />`;
});

export const getActivity = async (limit = 20) => {
    const response = await fetch(`https://api.github.com/users/marr/starred?per_page=${limit}`, {
        headers: {
            accept: 'application/vnd.github.v3.star+json'
        }
    });
    if (!response.ok) {
        throw response;
    }
    return camelcaseKeys(await response.json(), { deep: true });
}
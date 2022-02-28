export type GithubRepo = {
    description: string,
    full_name: string,
    html_url: string,
    id: string,
};

export type GithubStar = {
    starred_at: string | Date,
    repo: GithubRepo
};

export const getActivity = async () => {
    const response = await fetch('https://api.github.com/users/marr/starred', {
        headers: {
            accept: 'application/vnd.github.v3.star+json'
        }
    });
    if (!response.ok) {
        throw response;
    }

    return response.json();
}
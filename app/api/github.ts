export type GithubRepo = {
    description: string,
    full_name: string,
    html_url: string,
    id: string
};

export type GithubStar = {
    starred_at: string | Date,
    repo: GithubRepo
};

export const getActivity = async (limit = 10) => {
    const response = await fetch(`https://api.github.com/users/marr/starred?per_page=${limit}`, {
        headers: {
            accept: 'application/vnd.github.v3.star+json'
        }
    });
    if (!response.ok) {
        throw response;
    }

    return response.json();
}
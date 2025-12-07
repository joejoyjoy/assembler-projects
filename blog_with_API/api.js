const API_BASE = 'http://localhost:3000';

export async function fetchJSON(url) {
    const fetchUrl = API_BASE + url;

    try {
        const response = await fetch(fetchUrl);

        if (!response.ok) throw new Error(`Fetch error ${response.status} for ${fetchUrl}`);

        return response.json();
    } catch (err) {
        throw err;
    }
}
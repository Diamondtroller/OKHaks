const savedJSONs = new Map();
export async function getData(
	sfetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	url: string
) {
	if (savedJSONs.has(url)) {
		return savedJSONs.get(url);
	}
	const jsonp = sfetch(url).then((resp) => resp.json());
	savedJSONs.set(url, jsonp);
	return jsonp;
}

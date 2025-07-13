import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((lang: string | undefined) => {
	return ["lv", "en", undefined].includes(lang);
}) satisfies ParamMatcher;

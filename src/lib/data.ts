import { browser } from "$app/environment";

export async function getData(url: string) {
  if (browser) {
    return await fetch(url).then((resp) => resp.json());
  }
}

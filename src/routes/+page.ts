import { getTranslations } from '$lib/contents';

export async function load({ params }) {
  return {
    translations: await getTranslations()
  };
}

export const ssr = false;

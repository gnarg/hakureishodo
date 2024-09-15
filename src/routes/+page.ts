import { getTranslations } from '$lib/contents';
import { register, init, locale, waitLocale, getLocaleFromQueryString } from 'svelte-i18n';

register('en', () => getTranslations('en'));
register('ja', () => getTranslations('ja'));

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromQueryString('lang') || 'en',
});

export async function load({ params }) {
  locale.set(getLocaleFromQueryString('lang') || 'en');
  await waitLocale();
}

export const ssr = false;
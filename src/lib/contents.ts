import { Api } from 'nocodb-sdk';

let getContents = async () => {
  const api = new Api({
    baseURL: 'https://db.hakureishodo.art',
    headers: {
      'xc-token': 'OhdeLg0I_yrWPU5AbD7tIRzcAFIbfZygzfxZRB9B', // read-only token
    },
  });

  return api.dbViewRow.list(
    "noco",
    "pbe3wtvoh3ckjlt",
    "my3oab2ddiuvj0k",
    "vwpnpn45pbqxjwlx", {
      "offset": 0,
      "where": ""
  });
}

let getTranslations = async () => {
  let contents = await getContents();
  let translations: { [language: string]: { [name: string]: string } } = { en: {}, ja: {} };
  contents['list'].forEach((content: any) => {
      translations[content['Language']][content['Name']] = content['Content'];
  });
  return translations;
}

export { getTranslations };

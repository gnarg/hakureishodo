import { Api } from 'nocodb-sdk';

let getContents = async (language: string) => {
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
      "where": `(Language,eq,${language})`,
  });
}

let getTranslations = async (language: string) => {
  const translations: { [key: string]: string } = {};
  const content = await getContents(language);
  content['list'].forEach((content: any) => {
      translations[content['Name']] = content['Content'];
  });

  return translations;
}

export { getTranslations };

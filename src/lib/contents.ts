import PocketBase from 'pocketbase';

const pb = new PocketBase('https://db.guymon.family');

const getContents = async (language: string) => {
  return await pb.collection('hakureishodo_contents').getFullList({ filter: `language = '${language}'` });
};

const getTranslations = async (language: string) => {
  const translations: { [key: string]: string } = {};
  const contents = await getContents(language);
  contents.forEach((content: any) => {
      translations[content['name']] = content['content'];
  });

  return translations;
}

export { getTranslations };

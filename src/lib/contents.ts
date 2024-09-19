import PocketBase from 'pocketbase';

const pb = new PocketBase('https://db.guymon.family');

const STATIC = 'https://static.hakureishodo.art/images/gallery/'

const getContents = async (language: string) => {
  return await pb.collection('hakureishodo_contents').getFullList({
    filter: `language = '${language}'`, requestKey: language
  });
};

const getGallery = async () => {
  return await pb.collection('hakureishodo_gallery').getFullList({ sort: 'order' });
}

const getTranslations = async (language: string) => {
  const translations: { [key: string]: string } = {};
  const contents = await getContents(language);
  contents.forEach((content) => {
      translations[content['name']] = content['content'];
  });

  return translations;
}

const getImages = async () => {
  const gallery = await getGallery();
  return gallery.map((image) => {
    return { src: STATIC + image.image, thumbnail: STATIC + image.thumbnail }
  });
};

export { getTranslations, getImages };

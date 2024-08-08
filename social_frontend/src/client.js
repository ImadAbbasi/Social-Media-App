import client from "@sanity/client";
// import createImageUrlBuilder from "@sanity/image-url";
import imageUrlBuilder from "@sanity/image-url";

export default client({
  projectId: "ppcr8gdo",
  dataset: "production",
  apiVersion: "2021-10-21",
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN,
});

// const builder = createImageUrlBuilder(client);

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

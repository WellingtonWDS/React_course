export const loadPosts = async () => {
  const postsResponse = fetch("https://jsonplaceholder.typicode.com/posts");
  const photosResponse = fetch("https://jsonplaceholder.typicode.com/photos");

  // Fazendo Fetch em todos os dados
  const [posts, photos] = await Promise.all([postsResponse, photosResponse]);

  // Convertendo pra Json
  const postsJson = await posts.json();
  const photosJson = await photos.json();

  // Como o link nos fornece mais fotos do que posts, é preciso ter esse tratamento, para a quantidade ser de acordo com o menor array

  const postsAndPhotos = postsJson.map((post, index) => {
    return { ...post, cover: photosJson[index].url };
  });

  return postsAndPhotos;
};

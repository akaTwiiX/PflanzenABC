/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { plants, collections } = data;

  const mappedCollections = collections.map((c: any) => ({
    id: c.id,
    displayName: c.name,
    type: 'collection',
    path: '/collection',
  }));

  const mappedPlants = plants.map((p: any) => ({
    id: p.id,
    displayName: p.nameLatin,
    nameGerman: p.nameGerman,
    type: 'plant',
    path: '/plant',
  }));

  const mergedItems = [...mappedCollections, ...mappedPlants].sort((a: any, b: any) =>
    a.displayName.localeCompare(b.displayName));

  postMessage(mergedItems);
});

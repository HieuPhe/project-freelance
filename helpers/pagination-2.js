module.exports = (objectPagination, query, countProjects, pageKey = "page") => {
  if (query[pageKey]) {
    objectPagination.currentPage = parseInt(query[pageKey]);
  }

  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;

  objectPagination.totalPage = Math.ceil(
    countProjects / objectPagination.limitItems
  );

  return objectPagination;
};

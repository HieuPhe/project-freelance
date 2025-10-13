module.exports = (objectPagination, query, countProjects) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    const totalPage = Math.ceil(countProjects / objectPagination.limitItems);
    objectPagination.totalPage = totalPage;


    return objectPagination;
}
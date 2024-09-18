
const paginateModel = async (model, page = 1, limit = 10, endpoint = '') => {
    const currentPageUrl = endpoint;
    endpoint = removeAfterCharacter(endpoint, "?");
    const offset = (page - 1) * limit;

    const { count, rows } = await model.findAndCountAll({
        limit,
        offset,
    });

    const lastPage = Math.ceil(count / limit);

    const links = [];
    for (let i = 1; i <= lastPage; i++) {
        links.push({
            label: i.toString(),
            url: `${endpoint}?paginate=true&page=${i}&limit=${limit}`,
            active: i === page
        });
    }

    const pagination = {
        from: offset + 1,
        links: links,
        to: Math.min(offset + limit, count),
        currentPage: page,
        lastPage,
        currentPageUrl,
        total: count,
        perPage: limit,
        hasNextPage: page < lastPage,
        hasPreviousPage: page > 1,
        nextPageUrl: page < lastPage ? `${endpoint}?paginate=true&page=${page + 1}&limit=${limit}` : null,
        previousPageUrl: page > 1 ? `${endpoint}?paginate=true&page=${page - 1}&limit=${limit}` : null,
        firstPageUrl: `${endpoint}?paginate=true&page=1&limit=${limit}`,
        lastPageUrl: `${endpoint}?paginate=true&page=${lastPage}&limit=${limit}`,
    };

    return {
        pagination,
        data: rows
    };
};

const removeAfterCharacter = (str, char) => {
    return str.split(char)[0];
};

module.exports = paginateModel;
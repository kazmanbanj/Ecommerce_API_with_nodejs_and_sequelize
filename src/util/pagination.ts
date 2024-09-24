import { Like, ObjectLiteral, Repository } from 'typeorm';

interface PaginationLink {
    label: string;
    url: string;
    active: boolean;
}

interface PaginationResult<T> {
    from: number;
    links: PaginationLink[];
    to: number;
    currentPage: number;
    lastPage: number;
    currentPageUrl: string;
    total: number;
    perPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
    firstPageUrl: string;
    lastPageUrl: string;
}

interface PaginateModelResult<T> {
    pagination: PaginationResult<T>;
    data: T[];
}

export const paginateModel = async <T extends ObjectLiteral>(
    repository: Repository<T>,
    req: any,
    options: any = {}
): Promise<PaginateModelResult<T>> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    let endpoint = req.originalUrl;
    const currentPageUrl = endpoint;

    endpoint = removeAfterCharacter(endpoint, "?");
    const offset = (page - 1) * limit;

    const [rows, count] = await repository.findAndCount({
        skip: offset,
        take: limit,
        ...options
    });

    const lastPage = Math.ceil(count / limit);

    const links: PaginationLink[] = [];
    for (let i = 1; i <= lastPage; i++) {
        links.push({
            label: i.toString(),
            url: `${endpoint}?paginate=true&page=${i}&limit=${limit}`,
            active: i === page
        });
    }

    const pagination: PaginationResult<T> = {
        from: offset + 1,
        links,
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

const removeAfterCharacter = (str: string, char: string): string => {
    return str.split(char)[0];
};
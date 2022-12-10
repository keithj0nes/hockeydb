/* eslint-disable no-continue */


export function isOrIsNot(queryItem, allowableItem) {
    if (queryItem && JSON.parse(queryItem)) {
        return `${allowableItem === 'IS' ? 'IS NOT' : 'IS'} null`;
    }
    return `${allowableItem === 'IS' ? 'IS' : 'IS NOT'} null`;
}

// function compareKeys(a, b) {
//     const aKeys = Object.keys(a).sort();
//     const bKeys = Object.keys(b).sort();
//     return JSON.stringify(aKeys) === JSON.stringify(bKeys);
// }

export const buildWhere = (query = {}, allowable = []) => {
    const conditions = [];
    const values = [];

    allowable.push({ key: 'page' });
    allowable.push({ key: 'dir' });
    allowable.push({ key: 'sort' });


    console.log(query, 'querrry');
    console.log(allowable, 'allowable');


    // TODO: figure out how to see if extra params are added that dont exist in "allowable"
    // if so, need to return false, alerting the user that their query doesnt hae results
    // example: url.com/seasons?hello=hi should return false because that query doesnt exist

    console.log('\n');
    for (let i = 0; i < allowable.length - 3; i += 1) {
        if (allowable[i].nulls) {
            conditions.push(`${allowable[i].column} ${isOrIsNot(query[allowable[i].key], allowable[i].nulls)}`);
            values.push('');
            continue;
        }

        console.log(allowable[i].key, 'allowable[i].key');

        if (allowable[i].key === 'search' && query[allowable[i].key]) {
            const searchConditions = [];
            allowable[i].columns.forEach(item => {
                // TODO: check into SQL injection with this method of wildcar search
                searchConditions.push(`LOWER(${item}) like '%${query.search}%'`);
            });

            if (searchConditions.length) {
                conditions.push(`(${searchConditions.join(' OR ')})`);
            }
            // values.push(query.search);

            continue;
        }

        if (query[allowable[i].key]) {
            conditions.push(`${allowable[i].key} = $${conditions.length + 1}`);
            values.push(query.type);
        }
    }


    const m = Object.keys(query);
    if (!!m.length) {
        for (let i = 0; i < m.length; i += 1) {
            const b = allowable.find(n => n.key === m[i]);
            if (!b) return ['WHERE null', []];
        }
    }

    conditions.push('deleted_at IS null');

    console.log('WHERE: ', { conditions, values });

    return [conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', values];
};


// TODO: get dynamic order by working
// exmaple: click table header to change sorting

export const buildOrderBy = (query = {}, defaults = {}, whereLength = 0) => {
    const conditions = [];
    const values = [];

    const page = query.page || defaults.page;
    const limit = query.limit || defaults.limit;
    const dir = query.dir || defaults.dir;
    const sort = query.sort || defaults.by;

    const offset = (!page || page <= 1) ? 0 : (page - 1) * limit;
    console.log({ page, limit, dir, offset });

    if (!offset && offset !== 0) {
        // return array for buildOrderBy destructuring
        return [false];
    }

    if (dir !== 'asc' && dir !== 'desc') {
        return [false];
    }

    conditions.push(`LIMIT $${whereLength + (conditions.length + 1)}`);
    values.push(limit);

    conditions.push(`OFFSET $${whereLength + (conditions.length + 1)}`);
    values.push(offset);


    console.log('\n');
    console.log('ORDER_BY: ', { conditions, values });
    console.log(`ORDER BY ${defaults.by} ${dir} ${conditions.join(' ')}`);
    console.log('\n');

    return [
        `ORDER BY ${sort} ${dir} ${conditions.join(' ')}`,
        values,
        { page, limit, dir, offset },
    ];
};

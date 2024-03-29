const isProduction = process.env.NODE_ENV === 'production';

const filter = (query, excludeFromReqQuery = []) => {
    const q = { ...query };
    // sorting options should be removed
    delete q.page;
    delete q.dir;
    delete q.order_by;
    delete q.limit;

    if (q.show_hidden) {
        delete q.show_hidden;
        q['hidden_at !='] = null;
    } else {
        q['hidden_at ='] = null;
    }
    q['deleted_at ='] = null;

    for (let i = 0; i < excludeFromReqQuery.length; i + 1) {
        delete q[excludeFromReqQuery[i]];
    }
    return q;
};


function tryCatch(promise, additionalObj) {
    return promise.then((data) => [null, data]).catch((err) => {
        if (additionalObj) {
            Object.assign(err, additionalObj);
        }
        return [err]; // which is same as [err, undefined];
    });
}


module.exports = {
    filter,
    tryCatch,
    isProduction,
};


// may try to use this type of helper in the future?
const search = (make, model, color) => {
    const params = [];
    let sql = 'select * from cars where 1 = 1';

    if (make !== 'all') {
        sql += ' and make = ?';
        params.push(make);
    }
    if (model !== 'all') {
        sql += ' and model = ?';
        params.push(model);
    }
    if (color !== 'all') {
        sql += ' and color = ?';
        params.push(color);
    }

    // connection.query(sql, params, (error, results, fields) => {
    //     // handle results here...
    // });
};

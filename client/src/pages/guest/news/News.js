/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import { parseISO, format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { incrementAsync } from '../../../redux/slices/counter';

const post = {
    body: '<h1><strong><em><u>HAHA I KNOW</u></em></strong></h1>',
    created_by: 1,
    // created_date: "2022-02-27T06:03:25.000Z",
    created_at: '2022-02-27T06:03:25.000Z',

    deleted_by: null,
    deleted_date: null,
    display_order: 1,
    first_name: 'Dave',
    full_name: 'Dave Hand',
    hidden_by: null,
    hidden_date: null,
    id: 13,
    last_name: 'Hand',
    tag: null,
    tags_in_post: [{ id: 1, name: 'covid' }, { id: 2, name: 'announcement' }],
    title: 'hello world',
    updated_by: null,
    // updated_date: null,
    updated_at: null,
    user_id: 1,
};


const News = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(incrementAsync());
    }, []);


    const items = [1, 2, 3, 4, 5];

    const { title, body, full_name, created_at, updated_at, tags_in_post } = post;

    return (
        <div className="">
            {items.map((id) => (
                <div key={id} className="bg-white p-2 sm:p-4 mb-6 rounded">
                    <h1 className="text-2xl sm:text-3xl">{title}</h1>

                    <div className="sm:flex">
                        {/* <h6 className="uppercase text-gray-700 text-xs pt-2 sm:pt-4">02/26/2022 | 10:03 PM</h6> */}
                        {/* <h6 className="uppercase text-gray-700 text-xs pt-2 sm:pt-4">{format(parseISO(created_at), 'LL/dd/YYYY')}</h6> */}
                        <h6 className="uppercase text-gray-700 text-xs pt-2 sm:pt-4">{format(parseISO(created_at), 'P | p')}</h6>

                        {updated_at && (
                            <h6 className="uppercase text-gray-700 text-xs pt-2 sm:pt-4 pl-4">Updated: {format(parseISO(updated_at), 'P')}</h6>
                        )}

                        <h6 className="uppercase text-xs text-blue-900 font-bold pt-2 sm:pt-4">
                            <span className="hidden sm:inline">&nbsp;- </span>
                            {full_name}
                        </h6>
                    </div>
                    <div className="flex mt-2 sm:mt-4">
                        {tags_in_post.map(tag => (
                            <div key={tag.id} className="p-1 px-2 rounded bg-indigo-100 mr-2">
                                <p className="text-xs">{tag.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 mt-3 pt-3 sm:mt-5 sm:pt-5">
                        <div className="--news-body" dangerouslySetInnerHTML={{ __html: body }} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default News;

// font-size: 11px;
// font-weight: 400;
// text-transform: uppercase;
// letter-spacing: 1px;
// color: #7e92a3;
// }

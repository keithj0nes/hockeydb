//helper functions


//queries

export const getParams = location => {
    const searchParams = new URLSearchParams(location.search);
    return  {
        query: searchParams.get("query") || ""
    }
}

export const setParams = search => {
    const searchParams = new URLSearchParams();
    console.log(search, 'SEARCH PARAMERTR')
    console.log(searchParams, 'search params in set')
    // searchParams.set()
    // return searchParams.toString();
}

export const slideTime = 500;
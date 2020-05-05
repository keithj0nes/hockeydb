const filter = (query, excludeFromReqQuery = []) => {
    const q = {...query};
    if(q.show_hidden){
        delete q.show_hidden;
        q['hidden_date !='] = null;
    } else {
        q['hidden_date ='] = null;
    }
    q["deleted_date ="] = null;
  
    for(let i = 0; i < excludeFromReqQuery.length; i++){
      delete q[excludeFromReqQuery[i]];
    }
    return q;
}


module.exports = {
    filter
}
  
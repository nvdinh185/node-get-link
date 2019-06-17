const SQLiteDAO = require('../../db/sqlite3/sqlite-dao');

const dbFile = './db/database/news-v1.db';
const db = new SQLiteDAO(dbFile);

class ResourceHandler {

    getNewsList(req, res) {
        let users = "";
        if (req.json_data.follows.length > 0) {
            req.json_data.follows.forEach(el => {
                users += (users === "" ? "" : ",") + "'" + el + "'";
            });
        }
        db.getRsts("select *\
                    from news\
                    where user in ("+ users + ")\
                    order by time desc\
                    LIMIT "+ (req.json_data && req.json_data.limit ? req.json_data.limit : 6) + "\
                    OFFSET "+ (req.json_data && req.json_data.offset ? req.json_data.offset : 0) + "\
                    ")
            .then(results => {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(results
                    , (key, value) => {
                        if (value === null) { return undefined; }
                        return value
                    }
                ));
            }).catch(err => {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(JSON.stringify(err));
            })
    }
}

module.exports = {
    ResourceHandler: new ResourceHandler()
};
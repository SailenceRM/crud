const Datastore = require('nedb');

module.exports = new function() {
    const db = new Datastore({filename: 'students'});
    db.loadDatabase()

    this.create = (res, obj) => {
        db.insert(obj, (err, newDoc) => {
            if (err) {
                res.end({error: 'server-error'})
            } else {
                console.log(1)
                console.log(res)
                res.end(JSON.stringify(newDoc))
            }

        })
    }

    this.get = (res, id) => {
        db.findOne( {"_id": id}, (err, doc) => {
            if (err) console.log(err);
            if (!doc) {
                res.end(JSON.stringify({error: 'Такого пользователя нет'}));

            } else {
                res.end(JSON.stringify(doc))
            }

        })
    }

    this.getAll = (res) => {
        db.find( {}, (err, docs) => {
            if (err) console.log(err);
            if (!docs) res.end(JSON.stringify({error: 'Базаданных пуста'}))
            res.end(JSON.stringify(docs))
        })
    }

    this.update = (res, obj) => {

        db.findOne({'_id': obj['_id']}, (err, doc) => {
            db.update(doc, obj, {}, (err, numReplaced) => {
                if (err)
                    res.end(JSON.stringify({error: err}));
                else
                    res.end(JSON.stringify(obj))
            })
        })
    }

    this.delete = (res, id) => {
        db.remove( {'_id': id}, {}, (err, numRemoved) => {
            if (err)
                res.end(JSON.stringify({error: err}))
            res.end(JSON.stringify(id))
        })
    }


}
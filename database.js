const Datastore = require('nedb');
const faker = require('faker');

function changeDateFormat(dateObj) {
    let day = dateObj.getDay() + 1;
    let month = dateObj.getMonth()  + 1;
    let year = dateObj.getFullYear();

    if ((day + '').length === 1) {
        day = `0${day}`
    }

    if ((month + '').length === 1) {
        month = `0${month}`
    }
    return `${day}.${month}.${year}`
}

module.exports = new function() {


    const db = new Datastore({filename: 'students'});
    db.loadDatabase()

    function fillDataBase() {
        for (let i = 0; i < 50; i++) {
            const student = {
                name: faker.name.findName(),
                email: faker.internet.email(),
                number: '88005553535',
                dob: changeDateFormat(faker.date.between('2000-12-1', '2004-12-30')),
                group: faker.lorem.word()
            }
            db.insert(student)
        }
    }

    //fillDataBase()

    this.create = (res, obj) => {
        db.insert(obj, (err, newDoc) => {
            if (err) {
                res.end(JSON.stringify({error: 'server-error'}))
            } else {
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

        db.findOne({'_id': obj['id']}, (err, doc) => {
            db.update(doc, obj['obj'], {}, (err, numReplaced) => {
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
const util = new function() {
    this.listen = (elem, type, callback) => elem.addEventListener(type, callback);
    this.query = selector => document.querySelectorAll(selector);
    this.id = id => document.getElementById;
    this.ajax = (url, param, callback) => {
        fetch(url, param)
            .then(data => data.json())
            .then(callback)
    }
}

const data = new function() {
    let arr = {}
    this.init = () => {
        return new Promise( resolve => {
            util.ajax('/student', {method: 'GET'}, data => {
                data.forEach( student => {
                    arr[student['_id']] = student
                })
                resolve(true)
            })
        })
    }

    this.create = (obj, callback = () => null) => {
        util.ajax('/student', {method: 'POST',  body: JSON.stringify(obj)}, (data) => {
            arr[data['_id']] = data
            callback()
        })
    }

    this.get = (id) => arr[id];

    this.getAll = () => Object.values(arr);

    this.update = ({id, obj}, callback = () => null) => {
        arr[id] = obj
        console.log(arr)
        util.ajax('/student', {method: 'PUT', body: JSON.stringify({id, obj})}, data => {
            callback()
        })
    }

    this.delete = (id, callback=() => null) => {
        util.ajax('/student/' + id, {method: 'DELETE'}, data => {
            delete arr[id]
            callback()
        })
    }
}

const Modal = function(main) {
    // main - node
    this.main = main
    this.form = main.querySelector('.modal__form') // у del-modal form - это одна кнопка

    let closeIcon = this.main.querySelector('.modal__close');

    closeIcon.addEventListener('click', () => {
        this.hide()
        this.form.reset()
    })

    this.hide = () => {
        main.classList.add('hide')
    }
    this.show = () => {
        main.classList.remove('hide')
    }

    this.getFormValues = () => {
        let student = {}
        this.form.querySelectorAll('.modal__input').forEach( input => {
            student[input.id] = input.value
        })
        console.log('строка 76')
        console.log(student)
        return student
    }

    this.changeFormValues = (student) => {
        this.form.querySelectorAll('.modal__input').forEach( input => {
            input.value = student[input.id]
        })
    }
}

const student = new function() {
    let currentStudent = null
    let isMain = true

    const deleteModal = new Modal(util.query('.del-modal')[0])
    const mainModal = new Modal(util.query('.main-modal')[0])

    function submit(event) {
        event.preventDefault()

        let student = mainModal.getFormValues()
        console.log(student)
        mainModal.form.reset()
        if (isMain) {
            data.create(student, () => {
                mainModal.hide()
                render()
            })
        } else {
            student['_id'] = currentStudent
            data.update({id: currentStudent, obj: student}, () => {
                console.log(data.getAll())
                mainModal.hide()
                render()
            })
        }

    }

    function init() {
        render()

        const addButton = util.query('.add-button')[0]

        addButton.addEventListener('click', () => {
            mainModal.show()
            isMain = true
        })

        mainModal.form.addEventListener('submit', (event) => submit(event))

        deleteModal.form.addEventListener('click', () => {
            data.delete(currentStudent, () => {
                deleteModal.hide()
                render()
            })
        })


    }

    const render = () => {
        let inc = 1 // нумерация строк
        let str = ''
        data.getAll().forEach(student => {
            str += `
            <tr>
                <td>${inc++}</td>
                <td>${student.name}</td>
                <td>${student.dob}</td>
                <td>${student.email}</td>
                <td>${student.number}</td>
                <td>${student.group}</td>
                <td>
                    <button class="table__delete-button" data-id="${student['_id']}">Удалить</button>
                    <button class="table__edit-button" data-id="${student['_id']}">Изменить</button>
                </td>
            </tr>
        `
        })

        util.query('.table__body')[0].innerHTML = str

        util.query('.table__delete-button').forEach( button => {
            button.addEventListener('click', () => {
                currentStudent = button.dataset.id
                deleteModal.main.querySelector('.del-modal__name')
                    .innerHTML = data.get(currentStudent).name
                deleteModal.show()

            })
        })

        util.query('.table__edit-button').forEach( button => {
            button.addEventListener('click', () => {
                isMain = false
                currentStudent = button.dataset.id
                mainModal.changeFormValues(data.get(currentStudent))
                mainModal.show()
            })
        })

    }

    window.addEventListener('load', () => data.init().then(init))
}
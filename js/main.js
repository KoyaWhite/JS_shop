//Создание пустого элемента goods в локальном хранилище
if(!localStorage.getItem('goods')) {
    localStorage.setItem('goods', JSON.stringify([]))
}
//Модальное окно для добавления товара
let myModal = new bootstrap.Modal(document.getElementById('exampleModal'),{
    keyboard: false
})
//Поиск по элементам наименование и цена
let options = {
    valueNames: ['name','price']
}
//Создать новый товра
document.querySelector('button.add_new').addEventListener('click',function(e) {
    let name  = document.getElementById('good_name').value
    let price = document.getElementById('good_price').value
    let count = document.getElementById('good_count').value
    //Если цена, кол-во и наименования не пусты
    if(name&&price&&count) {
        document.getElementById('good_name').value  = ''
        document.getElementById('good_price').value = ''
        document.getElementById('good_count').value = '1'
        //Парсим строки из лок. хранилища в массив
        let goods = JSON.parse(localStorage.getItem('goods'))
        //Добавляем в массив новый товар
        goods.push(['good_'+goods.length, name, price, count, 0, 0, 0])
        //Сохраняем в локальное хранилище в виде json строкм
        localStorage.setItem('goods',JSON.stringify(goods))
        //Обновляем таблицы товаров
        update_goods()
        //Скрываем модальное окно
        myModal.hide()
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Ошибка',
            text: 'Пожалуйста заполните все поля'
        })
    }
})

update_goods()

//Обновление таблиц
function update_goods() {
    let result_price = 0
    let tbody = document.querySelector('.list')
    tbody.innerHTML = ""
    document.querySelector('.cart').innerHTML = ""
    let goods = JSON.parse(localStorage.getItem('goods'))
    //Если существуют товары
    if (goods.length) {
        table1.hidden = false
        table2.hidden = false
        //Отрисовываем элементы таблицы построчно из лок.хранилища
        for(let i=0; i<goods.length; i++) {
            tbody.insertAdjacentHTML('beforeend',
            `
            <tr class="align-middle">
                <td>${i+1}</td>
                <td class="name">${goods[i][1]}</td>
                <td class="price">${goods[i][2]}</td>
                <td>${goods[i][3]}</td>
                <td><button class="good_delete btn-danger btn" data-delete="${goods[i][0]}">&#10006;</button></td>
                <td><button class="good_delete btn-primary btn" data-add="${goods[i][0]}">&#10010;</button></td>
            </tr>
            `
            )
            //В 4 позиции хранится кол-во товара, добавленного в корзину
            //В 5 позиции -- скидка на товар
            //Во 2 позиции -- цена за шт
            //В 6 позиции -- сумма с учетом скидки и кол-ва
            if(goods[i][4]>0){
                goods[i][6] = goods[i][4] * goods[i][2] - goods[i][4] * goods[i][2] * goods[i][5] * 0.01
                result_price += goods[i][6]
                //Отрисовываем таблицу корзины для товаров добавленных в нее (позиция 4)
                document.querySelector('.cart').insertAdjacentHTML('beforeend',
                `
                <tr class="align-middle">
                    <td>${i+1}</td>
                    <td class="price_name">${goods[i][1]}</td>
                    <td class="price_one">${goods[i][2]}</td>
                    <td class="prcie_count">${goods[i][4]}</td>
                    <td class="price_discount"><input data-discount="${goods[i][0]}" type="text" value="${goods[i][5]}" oninput="this.value = this.value.replace(/[^0-9.]/g, '');"></td>
                    <td>${goods[i][6]}</td>
                    <td><button class="good_delete btn-danger btn" data-delete="${goods[i][0]}">&#10006;</button></td>
                </tr>
                `
                )
            }
        }
        //генерируем поиск по товарам
        userList = new List('goods',options)
    } else {
        table1.hidden = true
        table2.hidden = true
    }
    //Отрисовываем результирующую цену
    document.querySelector('.price_result').innerHTML = result_price + '&#8383;'
}

//Клик на удаление товара в таблице товаров
document.querySelector('.list').addEventListener('click', function(e) {
    if(!e.target.dataset.delete) {
        return
    }
    Swal.fire({
        title: 'Внимание!',
        text: 'Вы действительно хотите удалить товар?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Да',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Отмена'
    }).then((result) => {
        if(result.isConfirmed) {
            let goods = JSON.parse(localStorage.getItem('goods'))
            for(let i=0;i<goods.length; i++){
                if(goods[i][0] == e.target.dataset.delete){
                    //Если № товара (i) совпадает с № кнопки (одна строка в массиве), то убираем элемент из массива
                    goods.splice(i,1)
                    localStorage.setItem('goods', JSON.stringify(goods))
                    update_goods()
                }
            }
            Swal.fire(
                "Удалено!",
                "Выбранный товар был удален.",
                "success"
            )
        }
    })
})

//Клик на добавление в таблице товаров
document.querySelector('.list').addEventListener('click', function(e) {
    if(!e.target.dataset.add) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
    for (let i=0; i<goods.length; i++) {
        if(goods[i][3]>0 && goods[i][0] == e.target.dataset.add){
            goods[i].splice(3,1,goods[i][3]-1)
            goods[i].splice(4,1,goods[i][4]+1)
            localStorage.setItem('goods',JSON.stringify(goods))
            update_goods()
        }
    }
})

//Клин на крестик в корзине
document.querySelector('.cart').addEventListener('click', function(e) {
    if(!e.target.dataset.delete) {
        return
    }
    let goods = JSON.parse(localStorage.getItem('goods'))
    for (let i=0; i<goods.length; i++) {
        if(goods[i][4]>0 && goods[i][0] == e.target.dataset.delete){
            goods[i].splice(3,1,goods[i][3]+1)
            goods[i].splice(4,1,goods[i][4]-1)
            localStorage.setItem('goods',JSON.stringify(goods))
            update_goods()
        }
    }
})

//Обработка скидки
document.querySelector('.cart').addEventListener('input',function(e){
    if(!e.target.dataset.discount) return
    let goods = JSON.parse(localStorage.getItem('goods'))
    for(let i=0; i<goods.length; i++) {
        if(goods[i][0] == e.target.dataset.discount){
            let disc = e.target.value
            if (disc>100) disc = 100
            if (disc<0) disc = 0
            goods[i][5] = disc
            goods[i][6] = goods[i][4] * goods[i][2] - goods[i][4] * goods[i][2] * goods[i][5] * 0.01
            localStorage.setItem('goods',JSON.stringify(goods))
            update_goods()
            //После обновления ставим фокус в нужное место
            let input = document.querySelector(`[data-discount="${goods[i][0]}"]`)
            input.focus()
            //Ставим курсор в конец
            input.selectionStart = input.value.length
        }

    }
})

//Сортировка таблиц
table1.onclick = function(e) {
    if(e.target.tagName != 'TH') return
    let th = e.target
    sortTable(th.cellIndex, th.dataset.type, 'table1')
}
table2.onclick = function(e) {
    if(e.target.tagName != 'TH') return
    let th = e.target
    sortTable(th.cellIndex, th.dataset.type, 'table2')
}

function sortTable(colNum, type, id) {
    let elem = document.getElementById(id)
    let tbody = elem.querySelector('tbody')
    let rowsArray = Array.from(tbody.rows)
    let compare
    //Создание пустого элемента sorts в локальном хранилище для каждой таблицы свой
    if(!localStorage.getItem(id)) {
        localStorage.setItem(id, JSON.stringify([colNum,'asc']))    // colNum, order: asc/desc
    }
    let sorts = JSON.parse(localStorage.getItem(id))
    if (sorts[0] == colNum) { //Если по колонке уже отсортировано:
        if (sorts[1] == 'desc') {
            //Если отсортировано по убыванию, сортируем по возрастанию
            switch (type) {
                case 'number':
                    compare = function (rowA, rowB) {
                        return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML
                    }
                    break
                case 'string':
                    compare = function (rowA, rowB) {
                        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1
                    }
                    break
            }
            rowsArray.sort(compare)
            tbody.append(...rowsArray)
            sorts[1] = 'asc'
        } else { //В обратную сторону
            switch (type) {
                case 'number':
                    compare = function (rowA, rowB) {
                        return rowB.cells[colNum].innerHTML - rowA.cells[colNum].innerHTML
                    }
                    break
                case 'string':
                    compare = function (rowA, rowB) {
                        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? -1 : 1
                    }
                    break
            }
            rowsArray.sort(compare)
            tbody.append(...rowsArray)
            sorts[1] = 'desc'
        }
    } else { //Если по колонке сейчас не отсортировано, то сортируем по возрастанию
        switch (type) {
            case 'number':
                compare = function (rowA, rowB) {
                    return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML
                }
                break
            case 'string':
                compare = function (rowA, rowB) {
                    return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1
                }
                break
        }
        rowsArray.sort(compare)
        tbody.append(...rowsArray)
        sorts[0] = colNum
        sorts[1] = 'asc'
    }
    localStorage.setItem(id,JSON.stringify(sorts))
}

const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearAll = document.getElementById('clear')
const filter = document.getElementById('filter')
const formBtn = itemForm.querySelector('button')
let editMode = false

function displayItems(){
    const itemsFromStorage = getItemOfStorage()
    itemsFromStorage.forEach(item => addItemToDOM(item))
    checkUI()
}

function createButton(classes){
    const button = document.createElement('button')
    button.className = classes
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button
}

function createIcon(classes){
    const icon = document.createElement('i')
    icon.className = classes
    return icon
}

function addItemToWeb(e){
    
    e.preventDefault()

    const newItem = itemInput.value

    if(newItem === ''){
        alert('Please add something.')
        return
    }

    if(editMode){
        const itemToEdit = itemList.querySelector('.edit-mode')
        removeFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove('edit-mode')
        itemToEdit.remove()
        editMode=false

    }
    else{
        if(checkDuplicate(newItem)){
            alert('Item already exist')
            itemInput.value = ''
            return
        }
    }

    addItemToDOM(newItem)
    addItemToStorage(newItem)
    checkUI()
    itemInput.value=''
}

function addItemToDOM(item){
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(item))

    const button = createButton('remove-item btn-link text-red')


    li.appendChild(button)
    itemList.appendChild(li)
}

function addItemToStorage(item){
    let locale = getItemOfStorage()

    locale.push(item)
    localStorage.setItem('items' , JSON.stringify(locale))
}


function getItemOfStorage(){
    let locale ;
    if(localStorage.getItem('items') === null){
        locale = []
    }else{
        locale = JSON.parse(localStorage.getItem('items'))
    }
    return locale 
}


function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    }else{
        setItemEdit(e.target)
    }
}


function setItemEdit(item){
    editMode = true
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'))
    item.classList.add('edit-mode')
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item'
    formBtn.style.backgroundColor = '#2194FF'
    itemInput.value = item.textContent
}


function removeItem(item){
    if(confirm('Are You Sure?')){
        item.remove()
        removeFromStorage(item.textContent)
        
        checkUI()
    }
}


function removeFromStorage(item){
    let itemsFromStorage = getItemOfStorage()
    itemsFromStorage = itemsFromStorage.filter((i) => i!==item)
    localStorage.setItem('items',JSON.stringify(itemsFromStorage))
}


function clearItems(e){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }
    localStorage.clear('items')
    checkUI()
}

function filterItems(e){
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase()

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase()

        if(itemName.indexOf(text) != -1){
            item.style.display ='flex'
        }else{
            item.style.display='none'
        }
    } )
}


function checkDuplicate(item){
    const itemsFromStorage = getItemOfStorage()
    return itemsFromStorage.includes(item)
}


function checkUI(){
    itemInput.value = ''


    const item = itemList.querySelectorAll('li')
    if(item.length === 0){
        clearAll.style.display = 'none';
        filter.style.display = 'none';
    }else{
        clearAll.style.display = 'block'
        filter.style.display = 'block'
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>  Add Item'
    formBtn.style.backgroundColor = 'black'

    editMode = false
}

function init(){
    itemForm.addEventListener('submit', addItemToWeb)
    itemList.addEventListener('click', onClickItem)
    clearAll.addEventListener('click',clearItems)
    filter.addEventListener('input', filterItems)
    document.addEventListener('DOMContentLoaded', displayItems)

    checkUI()
}

init()
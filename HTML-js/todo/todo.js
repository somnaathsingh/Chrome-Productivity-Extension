let addUrl = document.querySelector(".addtodo");
let form = document.querySelector(".todoForm");
let toBeDoneUl = document.querySelector(".toBeDoneul");
let processingUl = document.querySelector(".processingul");
let doneUl = document.querySelector(".doneul");
let notifier = document.querySelector(".notifier");

let save = form.save;

refreshList();



addUrl.addEventListener('click', () => {

    form.style.display = "";
    addUrl.style.display = "none";
});

save.addEventListener('click', () => {
    let item = form.todo.value;

    chrome.storage.local.get('todo-items', function (result) {
        console.log(result);
        let todoItems = [];
        if (result['todo-items'] != null) {
            todoItems = JSON.parse(result['todo-items']);
        }
        let todoOject = { item: item, status: 0 };
        todoItems.push(todoOject);
        let newTodoItems = {};
        newTodoItems['todo-items'] = JSON.stringify(todoItems);
        chrome.storage.local.set(newTodoItems, () => {
            form.style.display = "none";
            form.todo.value = "";
            notifier.innerHTML = "item has been added";
            setTimeout(() => { notifier.innerHTML = "" }, 3000);
            refreshList();
        })
    });


})

function refreshList() {
    toBeDoneUl.innerHTML = "";
    processingUl.innerHTML = "";
    doneUl.innerHTML = "";
    let newHTMLtoBe = "";
    let newHTMLprocess = "";
    let newHTMLdone = "";
    chrome.storage.local.get('todo-items', function (result) {
        let todoItems = [];
        console.log(result);
        if (result['todo-items'] != null) {
            todoItems = JSON.parse(result['todo-items']);
        }
        for (let index = 0; index < todoItems.length; index++) {
            const element = todoItems[index];
            let icon = "";
            let x = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>`
            if (element["status"] == 0) {
                icon = "🔄";
                newHTMLtoBe += `<li data-itemIndex=${index}><span class="item">${element["item"]}</span>
                <div><span class="item_prop">${icon}</span><span class="delete">${x}</span></div>
            </li>`;
            }
            else if (element["status"] == 1) {
                icon = "✅";
                newHTMLprocess += `<li data-itemIndex=${index}><span class="item">${element["item"]}</span>
                <div><span class="item_prop">${icon}</span><span class="delete">${x}</span></div>
            </li>`;
            }
            else {
                newHTMLdone += `<li data-itemIndex=${index}><span class="item">${element["item"]}</span>
                <div><span class="item_prop">${icon}</span><span class="delete">${x}</span></div>
            </li>`;
            }
        }
        toBeDoneUl.innerHTML = newHTMLtoBe;
        processingUl.innerHTML = newHTMLprocess;
        doneUl.innerHTML = newHTMLdone;

        let todoList = document.querySelectorAll('ul li');
        for (let index = 0; index < todoList.length; index++) {
            todoList[index].querySelector('.item_prop').addEventListener('click', function () {
                let callIndex = this.parentNode.parentNode.dataset.itemindex;
                toggle(callIndex);
            });
            todoList[index].querySelector('.delete').addEventListener('click', function () {
                let callIndex = this.parentNode.parentNode.dataset.itemindex;
                itemDelete(callIndex);
            });
        }
    });

}

function toggle(index) {
    console.log(index);
    chrome.storage.local.get('todo-items', function (result) {
        let todoItems = [];
        if (result['todo-items'] != null) {
            todoItems = JSON.parse(result['todo-items']);
        }
        let element = todoItems[index];
        console.log(element);
        if (element["status"] == 0) {
            element["status"] = 1;
        }
        else if (element["status"] == 1) {
            element["status"] = 2;
        }
        let newTodoItems = {};
        newTodoItems['todo-items'] = JSON.stringify(todoItems);
        chrome.storage.local.set(newTodoItems, () => {
            refreshList();
        })
    });
}

function itemDelete(index) {

    chrome.storage.local.get('todo-items', function (result) {
        let todoItems = [];
        if (result['todo-items'] != null) {
            todoItems = JSON.parse(result['todo-items']);
        }
        todoItems.splice(index, 1);
        let newTodoItems = {};
        newTodoItems['todo-items'] = JSON.stringify(todoItems);
        chrome.storage.local.set(newTodoItems, () => {
            refreshList();
        })
    });
}

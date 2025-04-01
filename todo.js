console.log("fail ühendatud");

class Entry {
    constructor(title, description, date) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.done = false;
    }
}

class Todo {
    constructor(){
        this.entries = JSON.parse(localStorage.getItem("entries")) || [];
        this.render();
        document.querySelector("#addButton").addEventListener("click", () => {this.addEntry()});
    }
    //googeldasin, format date in javascript, https://bugfender.com/blog/javascript-date-and-time/
    formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        let currentDate = `${day}/${month}/${year}`;
        return currentDate;
    }

    addEntry() {
        console.log("vajutasin nuppu");
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue));
        console.log(this.entries);
        this.save();
    }

    render() {
        let tasklist = document.querySelector("#taskList");
        tasklist.innerHTML = "";

        //googeldasin, sort array by date, https://www.geeksforgeeks.org/sort-an-object-array-by-date-in-javascript/
        this.entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    
        const ul = document.createElement("ul");
        const doneUl = document.createElement("ul");
        ul.className = "todo-list";
        doneUl.className = "todo-list";
        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "Todo";
        doneHeading.innerText = "Done tasks";


        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";
            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");
            doneButton.innerText = "✔"
            deleteButton.innerText = "X";
            editButton.innerText = "Edit";
            deleteButton.className = "delete";
            doneButton.className = "done";
            editButton.className = "edit";

            deleteButton.addEventListener("click", () => {
                this.entries.splice(entryIndex, 1);
                this.save();
                
            });

            doneButton.addEventListener("click", () => {
                if(this.entries[entryIndex].done){
                    this.entries[entryIndex].done = false;
                } else{
                    this.entries[entryIndex].done = true;
                }
                
                this.save();
            });

            editButton.addEventListener("click", () => {
                this.toggleEditSaveButton(editButton, entryIndex);
            });

            div.className = "task";

            div.innerHTML = `<div>${entryValue.title}</div><div>${entryValue.description}</div><div>${this.formatDate(entryValue.date)}</div>`;
            
            if(this.entries[entryIndex].done){
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else{
                ul.appendChild(li);
            }


            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
        });

        tasklist.appendChild(taskHeading)
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneUl);
        
    }

    //chatgpt write me a function that lets me edit entries, changing the edit button into a save button
    toggleEditSaveButton(editButton, entryIndex) {
        if (editButton.innerText === "Edit") {
            editButton.innerText = "Save";
            this.editEntry(entryIndex);
        } else {
            editButton.innerText = "Edit";
            this.saveEditedEntry(entryIndex);
        }
    }

    editEntry(index){
        const entry = this.entries[index];
        
        document.querySelector("#title").value = entry.title;
        document.querySelector("#description").value = entry.description;
        document.querySelector("#date").value = entry.date;
        
    }

    saveEditedEntry(index) {
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;

        this.entries[index].title = titleValue;
        this.entries[index].description = descriptionValue;
        this.entries[index].date = dateValue;

        this.save();
    }

    save() {
        localStorage.setItem("entries", JSON.stringify(this.entries));
        this.render();
    }
}

const todo = new Todo();
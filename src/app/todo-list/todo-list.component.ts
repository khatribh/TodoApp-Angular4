import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.scss']
})

export class TodoListComponent implements OnInit {
    // Accessing DOM Element
    @ViewChild('f') todoForm: NgForm;

    //properties
    clicked: string;
    todoId: any;
    title: string;
    todoItem: string;
    author: string;
    date: any;
    addItem: boolean;
    updateItem: boolean;
    listEmpty: boolean;
    enterVal: boolean;
    success: string;
    error: string;
    mainHeader: string = "Welcome to TechCrat's Todo List";
    leftTitle: string = "List of Todo Items";
    rightTitle: string = "Add/Update Todo Item";
    todoLists: any;
    authorList: Array<any> = ['Aadesh', 'Bhumika', 'Rohit', 'Meven', 'Li'];

    constructor(private http: HttpClient) { }

    ngOnInit() {
        // Get TODO Lists from JSON File and Display it
        this.http.get('./assets/todoLists.json')
            .subscribe(data => {
                this.todoLists = data;
                for (let item of this.todoLists) {
                    item["todoId"] = Math.floor(Math.random() * 100000000);
                }
            });

        // Calculate height
        var windowHeight = window.innerHeight;
        var headerHeight = document.getElementById('header').clientHeight;
        var footerHeight = document.getElementById('footer').clientHeight;

        // Append total height to the window screen
        var totalHeight = windowHeight - headerHeight - footerHeight;
        document.getElementById("mainContent").setAttribute('style', 'min-height: ' + totalHeight + 'px');
    }

    // Function called on add/update TODO Item
    saveTodoList() {
        this.listEmpty = false;
        this.title = this.todoForm.value.title.trim();
        this.todoItem = this.todoForm.value.todoItem.trim();
        this.author = this.todoForm.value.author;
        this.date = this.todoForm.value.date;
        // Check if title and todo item is empty
        if (this.title != "" && this.todoItem != "") {
            if (this.todoForm.value.todoId) {
                this.todoId = this.todoForm.value.todoId;
                let idArray: Array<string> = [];

                // Update data of selected todo item in the list
                for (let item of this.todoLists) {
                    idArray.push(item.todoId);
                    if (item.todoId == this.todoId) {
                        item.title = this.title.trim();
                        item.todoItem = this.todoItem.trim();
                        item.author = this.author;
                        item.date = this.date;
                    }
                }

                // Add todo item in the list if it has been deleted
                if (idArray.indexOf(this.todoId) < 0) {
                    let todo = {
                        "todoId": this.todoId,
                        "title": this.title.trim(),
                        "todoItem": this.todoItem.trim(),
                        "author": this.author,
                        "date": this.date
                    }
                    this.todoLists.push(todo);
                }
                this.updateItem = true;
                this.success = "TODO Item updated successfully.";
                let timeoutId = setTimeout(() => {
                    this.updateItem = false;
                }, 2000);
            } else {
                // Add todo item in the list
                this.todoId = Math.floor(Math.random() * 100000000);
                let todo = {
                    "todoId": this.todoId,
                    "title": this.title.trim(),
                    "todoItem": this.todoItem.trim(),
                    "author": this.author,
                    "date": this.date
                }
                this.todoLists.push(todo);
                this.addItem = true;
                this.success = "TODO Item added successfully.";
                let timeoutId = setTimeout(() => {
                    this.addItem = false;
                }, 2000);
            }
            this.todoForm.reset();
        } else {
            // No TODO items
            this.enterVal = true;
            this.error = "Fields cannot be left empty";
            let timeoutId = setTimeout(() => {
                this.enterVal = false;
            }, 2000);
        }
    }

    // Delete TODO Item
    deleteTodoItem(id) {
        let i = 0;
        for (let arr of this.todoLists) {
            if (arr.todoId == id) {
                this.todoLists.splice(i, 1);
            }
            i++;
        }
        if (this.todoLists.length < 1) {
            this.listEmpty = true;
            this.error = "No TODO Items available";
        } else {
            this.listEmpty = false;
        }
    }

    // Update TODO Item
    updateTodoItem(todo) {
        this.todoForm.setValue(todo);
    }
}

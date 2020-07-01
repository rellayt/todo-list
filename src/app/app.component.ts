import { Component, OnInit, enableProdMode } from '@angular/core';
import { TmplAstElement } from '@angular/compiler';


@Component({
  selector: 'app-todo',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  taskName = '';
  task: Task;

  task1: Task = new Task('test');

  taskList: Task[] = [];
  activeTaskList: Task[] = [];
  inactiveTaskList: Task[] = [];

  localTaskList: string;

  all = true;
  completed: boolean;
  uncompleted: boolean;
  firstClicked = false;

  load = true;
  save = false;
  init = true;

  ngOnInit() {
    if(this.init)
    {
      enableProdMode();
      this.taskList.push(this.task1);
      this.init = false;
    }
    if(this.load)
    {
      this.taskList = JSON.parse(localStorage.getItem('1'));
      this.load = false;
    }
    if(this.save)
    {
      this.localTaskList = JSON.stringify(this.taskList);
      localStorage.setItem('1', this.localTaskList);
    }
  }


  addTaskToArray() {
    if (!this.firstClicked) {
      this.firstClicked = true;
      this.all = true;
    }
    if (this.taskName !== '') {
      this.task = new Task(this.taskName);
      this.taskList.push(this.task);
      this.activeTaskList.push(this.task);
      this.taskName = '';
      this.tasksRebuild();
    }
    this.save = true;
    this.ngOnInit();
  }
  changeTaskActivity(index: number) {
    if (this.all) {
      if (this.taskList[index].done === true) {
        this.taskList[index].done = false;
        let name = this.taskList[index].name;
        this.inactiveTaskList.forEach((task, index) => {
          if (task.name == name) {
            console.log('Usuwana wartość: ' + this.inactiveTaskList[index].name);
            this.inactiveTaskList.splice(index, 1);
          }
        });
      }
      else if (this.taskList[index].done === false) {
        this.taskList[index].done = true;
        this.inactiveTaskList.push(this.taskList[index]);
        let name = this.taskList[index].name;
        console.log(this.taskList[index].name + ' jest nieaktywny');
        this.activeTaskList.forEach((task, index) => {
          if (task.name === name) {
            this.activeTaskList.splice(index, 1);
          }
        });
      }
    }
    else if (this.completed) {
      if (this.inactiveTaskList[index].done === true) {
        let stop = false;
        let name = this.inactiveTaskList[index].name;
        this.taskList.forEach((task, index) => {
          if (!stop) {
            if (task.name === name) {
              this.taskList[index].done = false;
              stop = true;
            }
          }
        });
        stop = false;
      }
    }
    else if (this.uncompleted) {
      if (this.activeTaskList[index].done === false) {
        let name = this.activeTaskList[index].name;
        this.taskList.forEach((task, index) => {
          if (task.name === name) {
            this.taskList[index].done = true;
          }
        });
      }
    }
    this.tasksRebuild();
  }
  activeDeleteTask(index: number, tName: string, deleted: boolean) {
    if (this.taskList[index].deleted != deleted) {
      this.taskList[index].deleted = deleted;
    }
    this.tasksRebuild();
  }
  deleteTask(index: number) {
    if (this.taskList[index].deleted) {
      this.taskList.splice(index, 1);
    }
    this.tasksRebuild();
  }
  changeList(value) {
    if (value == 'all') {
      this.all = true;
      this.completed = false;
      this.uncompleted = false;
      this.tasksRebuild();
    }
    if (value == 'completed') {
      this.all = false;
      this.completed = true;
      this.uncompleted = false;
      this.tasksRebuild();
    }
    if (value == 'uncompleted') {
      this.all = false;
      this.completed = false;
      this.uncompleted = true;
      this.tasksRebuild();
    }
  }
  tasksRebuild() {
    this.activeTaskList = [];
    this.inactiveTaskList = [];
    this.taskList.forEach((task, index) => {
      if (!task.done) {
        this.activeTaskList.push(task);
      }
      else {
        this.inactiveTaskList.push(task);
      }
    });
    this.save = true;
    this.ngOnInit();
  }
}

class Task {
  constructor(public name: string, public done = false, public deleted = false) {
  }
}


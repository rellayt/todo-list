import { Component, OnInit, enableProdMode, OnChanges, AfterViewChecked } from '@angular/core';

enableProdMode();

@Component({
  selector: 'app-todo',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  taskName = '';
  task: Task;

  public taskList: Task[] = [];
  public activeTaskList: Task[] = [];
  public inactiveTaskList: Task[] = [];

  localTaskList: string;

  all = true;
  completed: boolean;
  uncompleted: boolean;
  firstClicked = false;

  getLocalStorageString = localStorage.getItem('1');

  save = false;

  ngOnInit() {
    if (this.getLocalStorageString !== null) {
      this.taskList = JSON.parse(localStorage.getItem('1'));
    }
  }

  public saveStorage() {
    if (this.save) {
      this.localTaskList = JSON.stringify(this.taskList);
      localStorage.setItem('1', this.localTaskList);
    }
  }
  detectBlankText(): boolean {
    if (this.taskName.length >= 1 && this.taskName.charAt(0) === ' ' || this.taskName.length >= 1 && this.taskName.charAt(1) === ' ') {
      console.log('Whitespace at beginning detected');
      return true;
    }
  }
  detectSameName(): boolean {
    let name = false;
    this.taskList.forEach((task, it) => {
      if (this.taskName === this.taskList[it].name)
      {
        return name = true;
      }
    });
    if (name){
      return true;
    }
    else{
      return false;
    }

  }
  public addTaskToArray() {
    if (this.taskName !== '' && !this.detectBlankText() && !this.detectSameName()) {
      this.task = new Task(this.taskName);
      this.taskList.push(this.task);
      this.taskName = '';
    }
    this.tasksRebuild();
    this.saveStorage();
    this.save = true;
  }
  changeTaskActivity(index: number) {
    if (this.all) {
      if (this.taskList[index].done === true) {
        this.taskList[index].done = false;
        const name = this.taskList[index].name;
        this.inactiveTaskList.forEach((task, it) => {
          if (task.name === name) {
            this.inactiveTaskList.splice(it, 1);
          }
        });
      }
      else if (this.taskList[index].done === false) {
        this.taskList[index].done = true;
        this.inactiveTaskList.push(this.taskList[index]);
        const name = this.taskList[index].name;
        this.activeTaskList.forEach((task, it) => {
          if (task.name === name) {
            this.activeTaskList.splice(it, 1);
          }
        });
      }
    }
    else if (this.completed) {
      if (this.inactiveTaskList[index].done === true) {
        let stop = false;
        const name = this.inactiveTaskList[index].name;
        this.taskList.forEach((task, it) => {
          if (!stop) {
            if (task.name === name) {
              this.taskList[it].done = false;
              stop = true;
            }
          }
        });
        stop = false;
      }
    }
    else if (this.uncompleted) {
      if (this.activeTaskList[index].done === false) {
        const name = this.activeTaskList[index].name;
        this.taskList.forEach((task, it) => {
          if (task.name === name) {
            this.taskList[it].done = true;
          }
        });
      }
    }
    this.tasksRebuild();
  }
  activeDeleteTask(index: number, tName: string, deleted: boolean) {
    if (this.taskList[index].deleted !== deleted) {
      this.taskList[index].deleted = deleted;
    }
    this.tasksRebuild();
  }
  deleteTask(index: number) {
    if (this.taskList[index].deleted) {
      this.taskList.splice(index, 1);
      this.tasksRebuild();
    }
  }
  changeList(value) {
    if (value === 'all') {
      this.all = true;
      this.completed = false;
      this.uncompleted = false;
    }
    if (value === 'completed') {
      this.all = false;
      this.completed = true;
      this.uncompleted = false;
    }
    if (value === 'uncompleted') {
      this.all = false;
      this.completed = false;
      this.uncompleted = true;
    }
    this.tasksRebuild();
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
    this.saveStorage();
    this.save = true;
  }
}

class Task {
  constructor(public name: string, public done = false, public deleted = false) {
  }
}

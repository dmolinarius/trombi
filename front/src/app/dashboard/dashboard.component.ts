import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../services/student.service';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

  students:Student[] = [];
  selectedStudent:string = "";
  hoveredStudent:string = "";

  constructor(
    private studentService:StudentService,
    private imageService:ImageService,
  ) { }

  ngOnInit() {
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getStudents()
      .subscribe(students => this.students = students);
  }

  // hover hyperlink : set focus to enable paste
  over(e): void {
     e.target.focus();
  }

  // leave hyperlink : remove focus
  leave(e): void {
     e.target.blur();
  }

  // drag over module : set active student id
  dragover(e,id): void {
    // dragged over
    this.hoveredStudent = id;
    e.preventDefault();
  }

  // leave module : no active student id
  dragleave(e): void {
    this.hoveredStudent = "";
    e.preventDefault();
  }

  // drop image
  drop(e): void {
    e.preventDefault();
    this.imageService.dropHandler( e,
      data => {
        this.updateStudentImageFromDataURL(this.hoveredStudent,data);
        this.hoveredStudent = "";
      },
      () => this.hoveredStudent = ""
    );
  }

  // paste image
  paste(e,id):void {
    this.imageService.pasteHandler( e,
      data => {
        this.updateStudentImageFromDataURL(id,data);
      }
    );
    e.preventDefault();
  }

  // update local and remote student model with dropped image
  updateStudentImageFromDataURL(id:string, dataURL:string):void {
    let student = this.students.find(s => s.id == id);
    student.image = dataURL.toString();

    // update remote student
    this.studentService.updateStudent(student.id,student)
    /*
    .subscribe(
      value => { console.log('PUT ok with value',value); },
      response => { console.log('PUT error',response); },
      () => { console.log('PUT observable now completed'); }
    );
    */
  }

}

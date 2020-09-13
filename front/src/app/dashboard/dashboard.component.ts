import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

  students:Student[] = [];
  selectedStudent:string = "";
  hoveredStudent:string = "";

  constructor( private studentService:StudentService ) { }

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
  dragover(e): void {
    // dragged over
    let target = (e.target.nodeName == 'DIV') ? e.target : e.target.parentNode;
    this.hoveredStudent = target.id;
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
    this.hoveredStudent = "";

    if ( ! [...e.dataTransfer.items].some(item => {
      let type = item.type;

      // drop image URL
      if ( type == 'text/plain' || type == 'text/x-moz-url' ) {
        console.log('[1] dropped ',type,e.dataTransfer.getData(type));
        // TODO call service to upload image
        return true;
      }

      // drop image from local system - TODO accept other formats
      if ( type == 'image/png' || type == 'image/jpeg' ) {
        let file = e.dataTransfer.files[0]
          , reader = new FileReader()
        ;
        reader.onload = e => {
          let data = e.target.result;
          // store student image
          console.log('[2] dropped', type, data.substr(0,80));
          this.updateStudentImageFromDataURL(this.hoveredStudent,data);
        };
        reader.readAsDataURL(file);
        return true;
      }
    })) {
      // drop failed - TODO issue error message
      console.log('dropped',e.dataTransfer);
    }
  }

  // paste image - solution from :
  // https://stackoverflow.com/questions/6333814/how-does-the-paste-image-from-clipboard-functionality-work-in-gmail-and-google-c
  paste(e):void {
    let items = e.clipboardData.items;
    for ( let index in items ) {
      let item = items[index];
      if ( item.kind === 'file' ) {
        let blob = item.getAsFile()
          , reader = new FileReader()
          , id = e.target.parentNode.id
        ;
        reader.onload = e => {
           let data = e.target.result;
           console.log('paste',id,data.substr(0,80));
           this.updateStudentImageFromDataURL(id,data);
        }
        reader.readAsDataURL(blob);
      }
    }
    e.preventDefault();
  }

  // update local and remote student model with dropped image
  updateStudentImageFromDataURL(id:string, dataURL:string):void {
    let student = this.students.find(s => s.id == id);
    student.image = dataURL.toString();

    // update remote student
    this.studentService.updateStudent(student.id,student)
    .subscribe(
      value => { console.log('PUT ok with value',value); },
      response => { console.log('PUT error',response); },
      () => { console.log('PUT observable now completed'); }
    );
  }
}

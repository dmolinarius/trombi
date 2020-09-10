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
  hoveredStudent;

  constructor(private studentService:StudentService) { }

  ngOnInit() {
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getStudents()
      .subscribe(students => this.students = students);
  }

  dragover(e): void {
    // dragged over
    let target = (e.target.nodeName == 'DIV') ? e.target : e.target.parentNode;
    this.hoveredStudent = target.id;
    e.preventDefault();
  }
  dragleave(e): void {
    this.hoveredStudent = "";
    e.preventDefault();
  }
  drop(e): void {
    e.preventDefault();

    if ( ! [...e.dataTransfer.items].some(item => {
      let type = item.type;

      // dropped distant image
      if ( type == 'text/plain' || type == 'text/x-moz-url' ) {
        console.log('dropped ',type,e.dataTransfer.getData(type));
        // TODO call service to upload image
        return true;
      }
      // dropped local image - TODO accept other formats
      if ( type == 'image/png' || type == 'image/jpeg' ) {
        let file = e.dataTransfer.files[0]
          , reader = new FileReader()
        ;
        reader.onload = e => {
          console.log('dropped image/png',e.target);
        }
        reader.readAsDataURL(file);
        // TODO call service to upload image
        return true;
      }
    })) {
      // drop failed - TODO issue error message
      console.log('dropped',e.dataTransfer);
    }
  }
}

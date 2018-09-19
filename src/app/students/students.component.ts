import { Component, OnInit } from '@angular/core';

import { Student } from '../student';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students: Student[];
  selectedStudent:Student; // ne sert plus pour le moment

  constructor(private studentService:StudentService) { }

  ngOnInit() {
    this.getStudents();
  }

  getStudents():void {
    this.studentService.getStudents().subscribe(students => {
      this.students = students;
    });
  }

  add(first_name:string, last_name:string) {
    first_name = first_name.trim();
    last_name = last_name.trim();
    if ( ! first_name || ! last_name ) return;
    // TODO capitalize names
    this.studentService.addStudent({first_name,last_name} as Student)
      .subscribe( s => this.students.push(s) );
  }

  delete(student:Student) {
    this.studentService.deleteStudent(student)
      .subscribe( () => this.students = this.students.filter(s => s !== student) );
  }
}

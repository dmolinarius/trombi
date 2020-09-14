import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { StudentService }  from '../services/student.service';
import { ImageService }  from '../services/image.service';
import { Student } from '../student';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {

  @Input() student:Student;

  constructor(
    private route:ActivatedRoute,
    private studentService:StudentService,
    private imageService:ImageService,
    private location:Location
  ) {}

  ngOnInit() {
    this.getStudent();
  }

  getStudent():void {
    const id = this.route.snapshot.paramMap.get('id');
    this.studentService.getStudent(id)
      .subscribe(student => this.student = student);
  }

  save():void {
    const id = this.route.snapshot.paramMap.get('id');
    this.studentService.updateStudent(id,this.student)
      .subscribe(
        value => { console.log('PUT ok with value',value); this.goBack(); },
        response => { console.log('PUT error',response); },
        () => { console.log('PUT observable now completed'); }
      );
  }

  goBack():void {
    this.location.back();
  }

  dragover(e) {
    e.preventDefault();
  }
  dragleave(e) {
    e.preventDefault();
  }
  drop(e) {
    e.preventDefault();
    this.imageService.dropHandler(e, d => this.student.image = d.toString());
  }
  paste(e) {
    console.log('student-detail.paste',e);
    e.preventDefault();
    this.imageService.pasteHandler(e, d => this.student.image = d.toString());
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { QuestionBase } from 'src/app/util/question-base';

@Component({
  selector: 'app-dropdown-question',
  templateUrl: './dropdown-question.component.html',
  styleUrls: ['./dropdown-question.component.css']
})
export class DropdownQuestionComponent implements OnInit {
  @Input() question:QuestionBase<String>
  selectedScore:number=0
  constructor() { }

  ngOnInit(): void {
  }

  setMark(value){
    this.selectedScore=value
  }
}

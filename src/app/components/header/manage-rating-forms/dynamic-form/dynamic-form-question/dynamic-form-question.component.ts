import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionService } from 'src/app/services/question-service/question.service';
import { QuestionBase } from "../../../../../util/question-base";


@Component({
  selector: "app-dynamic-form-question",
  templateUrl: "./dynamic-form-question.component.html",
  styleUrls: ["./dynamic-form-question.component.css"],
})
export class DynamicFormQuestionComponent {
  @Input() questions:{sectionId:string,questions: QuestionBase<string>[]};
  @Input() form: FormGroup;
  @Input("questionIndex") index: string;
  constructor(private qs: QuestionService) { }

  ngOnInit(){
  }
  // get isValid() {
  //   return this.form.controls[this.questions.key].valid;
  // }
}

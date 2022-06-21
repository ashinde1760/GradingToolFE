import { Injectable } from "@angular/core";
import { QuestionBase } from "../../util/question-base";
import { FormControl, Validators, FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class QuestionControllerService {
  constructor() {}

  toFormGroup(questions: QuestionBase<string>[]) {
    const group: any = {};


    questions.forEach((question) => {

      group[question.key] = question.required
        ? // ? new FormControl(question.value || "", Validators.required)
          // : new FormControl(question.value || "");
          new FormControl("", Validators.required)
        : new FormControl("");
    });

    return new FormGroup(group);
  }
}

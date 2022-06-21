import { QuestionBase } from "./question-base";

export class QuestionOpenEnd extends QuestionBase<string> {
  controlType = "dropdown";
}

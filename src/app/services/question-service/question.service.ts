import { Injectable } from "@angular/core";
import { QuestionDropDown } from "src/app/util/question-dropdown";
import { QuestionBase } from "../../util/question-base";
import { QuestionRadio } from "../../util/question-radio";
import { QuestionDataService } from "../question-data/question-data.service";

@Injectable({
  providedIn: "root",
})
export class QuestionService {

  dependentQuestionList = [];

  questionWithDependentQuestionMap = new Map();

  constructor(private questionDataService: QuestionDataService) { } //out sourced the json structure

  // TODO: get from a remote source of question metadata

  generateQuestion(
    data: any,
    questions: QuestionBase<string>[],
  ) {
    let attachment = { ...data.questionMetaData.attachment };
    let isAttachmentReq =false;
    let isDisabled = false;

    if (attachment.docAttachment !== "No" || attachment.imageAttachment !== "No") {
      isAttachmentReq=true
    }


    if (this.dependentQuestionList.includes(data.questionId)) {
      isDisabled = true;
    }

    switch (data.questionMetaData.questionType.toLowerCase()) {
      case "multiple choice":
        let maxMC=0;
        data.questionData.options.forEach(element => {
          maxMC=maxMC>element.optionweightage?maxMC:element.optionweightage
        });
        return questions.push(
          new QuestionRadio({
            key: data.questionId,
            label: data.questionData.question,
            options: data.questionData.options,
            type: data.questionMetaData.questionType,
            attachment:{...attachment},
            isAttachmentRequired: isAttachmentReq,
            isEventListenerRequired: data.questionMetaData.dependentQuestions.isPresent,
            disabled: isDisabled,
            maxScore:maxMC
          })
        );
        break;
      case "dropdown":
        let maxDD=0;
        data.questionData.options.forEach(element => {
          maxDD=maxDD>element.optionweightage?maxDD:element.optionweightage
        });
       return questions.push(
          new QuestionDropDown({
            key: data.questionId,
            label: data.questionData.question,
            options: data.questionData.options,
            attachment:{...attachment},
            type: data.questionMetaData.questionType,
            isEventListenerRequired: data.questionMetaData.dependentQuestions.isPresent,
            disabled: isDisabled,
            maxScore:maxDD
          })
        );
        break;
      case "open-ended":
       
        return  questions.push(
          new QuestionBase({
            key: data.questionId,
            label: data.questionData.question,
            type: data.questionMetaData.questionType,
            attachment:{...attachment},
            controlType: data.optionsMetaData.inputField.type,
            isEventListenerRequired: data.questionMetaData.dependentQuestions.isPresent,
            disabled: isDisabled,
            maxScore:data.questionData.weightage
          })
        );
        break;
        case "check-box":
          let maxCB=0;
          data.questionData.options.forEach(element => {
            maxCB+=element.optionweightage
          });
          return  questions.push(
            new QuestionBase({
              key: data.questionId,
              label: data.questionData.question,
              options: data.questionData.options,
              attachment:{...attachment},
              type: data.questionMetaData.questionType,
              isAttachmentRequired: isAttachmentReq,
              isEventListenerRequired: data.questionMetaData.dependentQuestions.isPresent,
              disabled: isDisabled,
              maxScore:maxCB
            })
          );
          break;
    }
  }

  

}

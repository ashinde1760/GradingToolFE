import { Injectable } from "@angular/core";
import { FormType } from '../../util/FormType'
export interface HeadingType {
  surveyId?: string;
  surveyTitle?: string;
  surveyTitleSubdata?: string;
  surveyTime?: string;
  surveyLastUpdatedTime?: string;
}
@Injectable({
  providedIn: "root",
})
export class QuestionDataService {
  request: any = {
    surveyId: "SQI001",
    title: "Survey for Computer Lab",
    titleSubData: "This survey is for Computer programing lab",
    time: "08/08/2020 10:02:32",
    lastUpdate: "08/08/2020 10:02:32",
    surveyData: [
      {
        questionId: "001",
        questionData: {
          question: "Open Area-  for physical activities ?",
          options: [
            {
              optionId: "A",
              optionData: "9000 sq ft ",
              optionWeightage: 5,
              inputField: "no",
            },
            {
              optionId: "B",
              optionData: "5000 sq ft",
              optionWeightage: 4,
              inputField: "no",
            },
            {
              optionId: "C",
              optionData: "3000 sq ft",
              optionWeightage: 3,
              inputField: "no",
            },
            {
              optionId: "D",
              optionData: "1000 sq ft",
              optionWeightage: 2,
              inputField: "no",
            },
          ],
          media: [],
        },
        questionMetaData: {
          questionType: "Multiple choice",
          isMandatory: "Yes",
          attachment: {
            attachmentRequired: "no",
            attachmentType: "",
          },
          dependentQuestions: {
            isPresent: "No",
            questionLinkedWithOption: [],
          },
        },
        optionsMetaData: {
          inputField: {
            inputFieldRequired: "No",
            type: "",
            metaData: {
              validation: {},
            },
          },
        },
      },
      {
        questionId: "002",
        questionData: {
          question:
            "Tools & Equipments as per NCVT/ SSC guidelines(to be refered from respective domain curriculam of MES/SSC) ?",
          options: [
            {
              optionId: "A",
              optionData:
                "If all the trades imparted training in the TC has 100% tools & equipments as mandated & in working condition",
              optionWeightage: 15,
              inputField: "no",
            },
            {
              optionId: "B",
              optionData:
                "If >75% of the equipments are found to be functioning ",
              optionWeightage: 10,
              inputField: "no",
            },
            {
              optionId: "C",
              optionData:
                "If <75% of the equipments are found to be functioning",
              optionWeightage: 0,
              inputField: "no",
            },
          ],
          media: [],
        },
        questionMetaData: {
          questionType: "Multiple choice",
          isMandatory: "Yes",
          attachment: {
            attachmentRequired: "no",
            attachmentType: "",
          },
          dependentQuestions: {
            isPresent: "Yes",
            questionLinkedWithOption: [
              {
                optionId: "A",
                yes: { questionIds: ["003", "004"] },
                no: { questionIds: ["005"] },
              },
              {
                optionId: "B",
                yes: { questionIds: ["004"] },
                no: { questionIds: ["005"] },
              },
            ],
          },
        },
        optionsMetaData: {
          inputField: {
            inputFieldRequired: "No",
            type: "",
            metaData: {
              validation: {},
            },
          },
        },
      },
      {
        questionId: "003",
        questionData: {
          question: "Internet Speed  ?",
          options: [],
          media: [],
        },
        questionMetaData: {
          questionType: "Open-ended",
          isMandatory: "Yes",
          attachment: {
            attachmentRequired: "NO",
            attachmentType: "",
          },
          dependentQuestions: {
            isPresent: "No",
            questionLinkedWithOption: [],
          },
        },
        optionsMetaData: {
          inputField: {
            inputFieldRequired: "Yes",
            // type: "number/text/media/date/duration",
            type: "number",
            metaData: {
              validation: {},
            },
          },
        },
      },
      {
        questionId: "004",
        questionData: {
          question: "CCTV in the common area ?",
          options: [
            {
              optionId: "A",
              optionData:
                "Biometric device installed and used for capturing attendance at hostel",
              optionWeightage: 3,
              inputField: "no",
            },
            {
              optionId: "B",
              optionData: "CCTV installed & working",
              optionWeightage: 2,
              inputField: "no",
            },
          ],
          media: [
            {
              mediaId: "qwrey12",
              mediaName: "121212.jpg",
            },
          ],
        },
        questionMetaData: {
          questionType: "Dropdown",
          isMandatory: "Yes",
          attachment: {
            attachmentRequired: "NO",
            attachmentType: "",
          },
          dependentQuestions: {
            isPresent: "No",
            questionLinkedWithOption: [],
          },
        },
        optionsMetaData: {
          inputField: {
            inputFieldRequired: "No",
            type: "",
            metaData: {
              validation: {},
            },
          },
        },
      },
      {
        questionId: "005",
        questionData: {
          question: "Type of Building ?",
          options: [
            {
              optionId: "A",
              optionData: "Independent Building with enclosed compound wall ",
              optionWeightage: 5,
              inputField: "no",
            },
            {
              optionId: "B",
              optionData:
                "Classrooms for DDU-GKY in an academic institute within a enclosed compound walls",
              optionWeightage: 3,
              inputField: "no",
            },
          ],
          media: [],
        },
        questionMetaData: {
          questionType: "Multiple choice",
          isMandatory: "Yes",
          attachment: {
            attachmentRequired: "NO",
            attachmentType: "",
          },
          dependentQuestions: {
            isPresent: "No",
            questionLinkedWithOption: [],
          },
        },
        optionsMetaData: {
          inputField: {
            inputFieldRequired: "No",
            type: "",
            metaData: {
              validation: {},
            },
          },
        },
      },
    ],
  };

  public get getHeadingData(): HeadingType {
    return {
      surveyId: this.request.formName,
/*      surveyTitle: this.request.title,
      surveyTitleSubdata: this.request.titleSubData,
      surveyTime: this.request.time,*/
      surveyLastUpdatedTime: this.request.lastUpdate,
    };
  }
}

export interface FormType {
  formName: string,
  lastUpdate?: string
  surveyData?: {
    sections: Section[]
  };

}

export interface SurveyData {
  sections: Section[]
}

export interface Section {
  sectionId: string
  sectionScore?: number
  sectionQuestions: SectionQuestions[],
  sectionName?:string
}
export interface SectionQuestions {
  questionId?: string;
  questionData?: QuestionData;
  questionMetaData?: QuestionMetaData;
  optionsMetaData?: OptionsMetaData;
}

export interface QuestionData {
  question?: string;
  options?: Options[];
  media?: any[];
  weightage?: string
}

export interface Options {
  optionId?: string;
  optionData?: string;
  optionweightage?: number;
  inputField?: string;
}

export interface QuestionMetaData {
  questionType?: string;
  help?: string;
  isMandatory?: string;
  attachment?: {
    docAttachment:string,
    imageAttachment:string
  };
  dependentQuestions?: {
    isPresent?: string;
    questionLinkedWithOption?: {
      optionId?: string;
      yes?: { questionIds?: string[] };
      no?: { questionIds?: string[] };
    }[];
  };
}

export interface OptionsMetaData {
  inputField?: {
    inputFieldRequired?: string;
    type?: string;
    metaData?: {
      validation?: any;
    };
  };
}

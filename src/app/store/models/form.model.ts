export class FormModel {
    constructor(
        public _formName: string,
        public _userRole: Array<string>,
        public _isPublish?:boolean,
        public _projectId?: string,
        public _formId?: string,
        public _surveyId?: string,
        public _timeOfCreate?:string
    ) {
    }

}
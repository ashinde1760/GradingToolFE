export interface ITrainingCenterReport{
    "reportHeader": {
        "projectName": string,
        "PIA": string,
        "partnerProjectId": string,
        "partnerSPOCName": string,
        "partnerSPOCPhone": string,
        "partnerSPOCEmailId": string,
        "fieldAuditorName": string,
        "secondaryAuditorName": string,
        "centerId": string,
        "dateOfAudit": string,
        "TCAddress": string,
        "audits": IAudit[]
    },

    "reportBody": {
        "forms": [
          {
            "formName": string,
            "SAScore": number,
            "FAScore": number,
            "maxMarks": number,
            "sectionsDetails": ISectionsDetail[]
          }
        ]
    },
    "warning": ""
}

export interface IAudit{
    "fieldAuditorName": string,
    "secondaryAuditorName": string,
	"auditDate": string,
	"formName": string
}

export interface ISectionsDetail{
    "sectionName": string,
    "SAScore": number,
    "FAScore": number,
    "maxScore": number,
    "sectionId": string
    "scorecard": IScorecard[]
}

export interface IScorecard {
    "parameter": string,
        "maxMarks": number,
        "SAScore": number,
        "FAScore": number,
        "optionsDetails": IOptionsDetail[]
}

export interface IOptionsDetail{
    "optionValue": string,
    "optionWeightage": number
}
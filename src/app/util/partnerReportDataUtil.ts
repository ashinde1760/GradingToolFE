export interface IPartnerReport {
    
  "reportHeader": {
    "projectName": string,
    "PIA": string,
    "partnerProjectId": string,
    "partnerSPOCName": string,
    "partnerSPOCPhone": string,
    "partnerSPOCEmailId": string,
    "fieldAuditorName": string,
    "secondaryAuditorName": string,
    "audits": IAudit[]
  },

  "reportBody": {
    "summaryReport": {
      "centerRating": number,
      "projectGrading": number,
      "finalAvg": number,
      "grade": string
    },
    "centerRatingSummary": ICenterRating[],
    "partnerGradingSummary": {
      "SAScore": number,
      "FAScore": number,
      "maxMarks": number
    }
  },

  "warning": ""
}

export interface IAudit{
  "fieldAuditorName": string,
	"secondaryAuditorName": string,
	"auditDate": string,
	"formName": string,
	"tcName": string
}

export interface ICenterRating {
    "trainingCenter": string,
    "TCAddress": string,
    "TCSPOCName": string,
    "SAScore": number,
    "FAScore": number,
    "maxMarks": number
}
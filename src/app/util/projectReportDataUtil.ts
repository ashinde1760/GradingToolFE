export interface IProjectReport {
    "reportHeader": {
        "projectName": string,
        "date": string,
        "partnersIncluded": number,
        "tcIncluded": number
      },

    "reportBody": {
        "partnersSummary": IPartnerSummery[]
    },
    "warning": ""
}

export interface IPartnerSummery {
    "PIA": string,
    "centerRating": number,
    "projectGrading": number,
    "finalAvg": number,
    "grade": string
}
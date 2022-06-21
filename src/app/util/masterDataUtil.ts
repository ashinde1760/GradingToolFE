export interface dataObject{
      
        "projectDetails": {
            "projectId": string,
            "projectName"?: string,
        },
        projectMappingId?:string
        "partnerDetails": {
            'isGradingEnable'?:boolean,
            "partnerId"?:string,
            "partnerProjectId": string,
            "partnerName"?: string,
            "clientSponsor"?: {
                "firstName": string,
                "lastName": string,
                "phone": string,
                "email": string
            }
            ,
            "clientSponsorId"?:string,
            "traningCentersDetails": {
                "tcId": string,
                "tcName": string,
                "district":string,
                "latitude":string,
                "centerAddress": string,
                "longitude": string
                "centerInCharge"?: {
                    "firstName": string,
                    "lastName":string,
                    "phone": string,
                    "email": string,
                },
                'centerInchargeId'?:string
            }
        }
    
}


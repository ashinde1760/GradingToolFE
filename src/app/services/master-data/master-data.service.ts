import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {


  
  masterDataForm= new FormGroup({
                partnerId:new FormControl(),
                clientSponsorId:new FormControl(),
                tcId:new FormControl(),
                centerInchargeId:new FormControl(),
              'listOfMasterData':new FormArray([])
            })

 
}

// {
//   "projectDetails": {
//     "projectId": "456fsdfdsf4dsf4sd56"
//   },
//   "partnerDetails": {
//     "partnerProjectId": "AWX1",
//     "partnerName": "ActiveWorks",
//     "clientSponsor": {
//       "firstName": "mark",
//       "LastName": "berg",
//       "phone": "9632541258",
//       "email": "mark@gmail.com"
//     },
//     "traningCentersDetails": {
//       "tcId": "Tc1",
//       "tcName": "abc training center",
//       "district": "banglore",
//       "latitude": "15",
//       "centerAddress": "btm layout",
//       "centerInCharge": {
//         "firstName": "new",
//         "LastName": "CenterIncharge",
//         "phone": "9632541278",
//         "email": "new@gmail.com"
//       },
//       "longitude": "456"
//     }
//   }
// }
import { loadMasterData, failedUploadData } from './../../../store/selectors/master-data.selectors';
import { ListPartnerStarts, TrainingCenterDetail, PartnerWithTrainingCenters, ListofClientSponsorStart, ListofCenterInchargeStart, ListofTrainingCenterStart, ClearPartnerData, ListofTrainingCenterEnd } from './../../../store/actions/patner.actions';
import { Observable, Subject, Subscription } from 'rxjs';
import { AddIndividualStart, AddEmptyRowForMasterData, DeleteStart, FilterStarts, UpdateIndividualStart, ListMasterDataStarts, PartnerPayloadType, PartnerDetailsPayloadType, AddMultipleStarts, ClearMasterData, DownloadTemplateStart, FailedUploadData, ResetFailedUploadedData } from './../../../store/actions/master-data.action';
import { Store, select } from '@ngrx/store';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { delay, tap } from 'rxjs/operators';
import { Patner } from '../../../store/models/patner.model';
import { AppState } from '../../../store';
import { getAllProjects } from '../../../store/selectors/projects.selectors';
import { ProjectModel } from '../../../store/models/project.model';
import { loadUsers, getUserByRole } from '../../../store/selectors/user.selectors';
import { User } from '../../../store/models/user';
import { FilterUserStarts } from '../../../store/actions/user.action';
import { loadClientSponsers, loadPartners,loadCenterIncharge, loadTCForPartner } from '../../../store/selectors/partner.selectors';
import {MasterDataService} from '../../../services/master-data/master-data.service'
import { FormArray, FormControl, FormGroup, NgModel } from '@angular/forms';
import { dataObject} from '../../../util/masterDataUtil'
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { ofType } from '@ngrx/effects';
import { Event } from '@angular/router';
import { FetchProjectsStart } from 'src/app/store/actions/project.actions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-master-data-management',
  templateUrl: './master-data-management.component.html',
  styleUrls: ['./master-data-management.component.css'],
  animations:[trigger('mediaOption',[
    state('collapsed',style({
      height:0,
      overflow:'hidden'
    })),
    state('expanded',style({
      height:'70px',
      overflow:'unset',
      backgroundColor: 'white',
      zIndex: '1'
    })),
    transition('collapsed=>expanded',[animate('300ms ease-out')]),
    transition('expanded=>collapsed',[animate('300ms ease-in')])
  ])]
})
export class MasterDataManagementComponent implements OnInit, OnDestroy {
  fileName = ""
  masterDataFormListRef:FormArray=null
  showFilter = false;
  searchBy = null;
  searchString = "";
  selectedIndex=null;;
  @ViewChild('fileInput')
  fileInputElement:ElementRef
  // masterData$: Observable<Patner[]>;
  tcId:string
  patnerId: string;
  partnerName: string;
  projectName:string
  enableEdit = false;
  centerInchargeSelected=null
  clientSponsorSelected=null
  enableEditIndex = null;
  isNew: boolean = false;
  patnerList = [];
  file:File=null
  selectedProjectId=null
  traingCenterList: Array<TrainingCenterDetail> = [];
  projectList$: Observable<ProjectModel[]>;
  users$: Observable<User[]>;
  partners$: Observable<PartnerWithTrainingCenters[]>;
  private subject: Subject<string> = new Subject();
  disableButton: boolean = false;
  clientSponsors$:Observable<{}[]>
  centerInchargeList$:Observable<{}[]>
  TCforPartner$:Observable<{}[]>
  loadMasterDataSub:Subscription
  masterData:dataObject[]
  showuploadOptions=false;
  isFailedDataTableOpened: boolean = false;
  failedUploadData: FailedUploadData;
  failedUploadDataSub: Subscription;
  isLoading: boolean = false;
  isApplyDisabled: boolean = true;
  selectedRowCount: number = 0;
  isAllButtonChecked: boolean = false;

  constructor(private store: Store<AppState>,public masterDataUtil:MasterDataService, private loadingSpinner: LoadingSpinnerService, private toastr: ToastrService) {}

  // filter data by given any parameter.
  filetrBy(projectName, partnerName, tcId) {
    this.loadingSpinner.isLoading.next(true);
    this.subject.next(projectName);
    this.store.dispatch(new FilterStarts({
      projectName: projectName,
      partnerName: partnerName,
      tcId: tcId
    }));
  }

  setApply(userprojectName, userpartnerName, usertcId){
    this.isApplyDisabled = (userprojectName === "" || typeof userprojectName === "undefined")&&(userpartnerName === "" || typeof userpartnerName === "undefined")&&(usertcId ==="" || typeof usertcId === "undefined");
  }

  closeModal(){
    this.file=null,
    this.selectedProjectId=null;
    this.fileInputElement.nativeElement.value="";
  }

  clickOutsideOfDropbox(){
    this.showuploadOptions = false;
  }

  //select the all master data to operate on it like delete.
  selectAll(event){
    let checkEle = event.target.closest("form").getElementsByClassName("checkbox");
    if(event.target.checked){
      this.selectedRowCount = 0;
      for (var ele of checkEle){
        ele.getElementsByTagName("input")[0].checked = true;
        this.selectedRowCount++;
      }  
    }
    else{
      this.selectedRowCount = checkEle.length;
      for (var ele of checkEle){
        ele.getElementsByTagName("input")[0].checked = false;
        this.selectedRowCount--;
      }
    }
  }

  // on checked the master data
  onChecked(event, i){
    if(event.target.checked){
      this.enableEditIndex = i;
      this.selectedRowCount++;
    }else{
      this.selectedRowCount--;
      this.enableEdit = false;
      this.enableEditIndex = null;
    }

    let checkEle = event.target.closest("form").getElementsByClassName("checkbox");
    this.isAllButtonChecked = checkEle.length == this.selectedRowCount ? true: false;
    if(!this.isAllButtonChecked){
      event.target.closest("form").getElementsByClassName("selectall")[0].checked = false;   
    }
  }

  ngOnDestroy(){
    this.masterDataUtil.masterDataForm.get('partnerId').reset(null);
    this.masterDataUtil.masterDataForm.get('clientSponsorId').reset(null);
    this.masterDataUtil.masterDataForm.get('centerInchargeId').reset(null);
    this.masterDataUtil.masterDataForm.get('tcId').reset(null);
    (this.masterDataUtil.masterDataForm.get('listOfMasterData') as FormArray).clear();
    this.store.dispatch(new ClearMasterData());
    this.store.dispatch(new ClearPartnerData());
    if(this.loadMasterDataSub){
      this.loadMasterDataSub.unsubscribe();
    }
    if(this.failedUploadDataSub){
      this.failedUploadDataSub.unsubscribe();
    }
  }

  //to add single master data manually set the empty form at starting.
  addIndivisual() {
    if(!this.isNew){
      this.enableEdit = true;
      this.isNew=true;
      this.enableEditIndex=0;
      (this.masterDataUtil.masterDataForm.get('listOfMasterData') as FormArray).controls.unshift(new FormGroup({
        isGradingEnable:new FormControl(false),
        projectId:new FormControl(),  
        partnerProjectId: new FormControl(),
        partnerName: new FormControl(),
        csName:new FormControl(),
        csEmail:new FormControl(),
        csNumber:new FormControl(),
        tcId:new FormControl(),
        tcName:new FormControl(),
        district:new FormControl(),
        latitude: new FormControl(),
        centerAddress: new FormControl(),
        ciName:new FormControl(),
        ciEmail:new FormControl(),
        ciNumber:new FormControl(),
        longitude: new FormControl(),
        projectName:new FormControl()
      }))
    }
    // this.preparePatnerandTrainingCenterList();

  }

  changeshowUploadOptions(){
    this.showuploadOptions=!this.showuploadOptions
  }

  // to add the new master data filled in the form
  saveMasterData(event){
    let i = (event.target as HTMLElement).closest("form").querySelector("td.checkbox >input:checked").id;
    let masterDataItem=this.masterDataFormListRef['controls'][i]
    let partnerIdRef=this.masterDataUtil.masterDataForm.get('partnerId')
    let clientSponsorIdRef=this.masterDataUtil.masterDataForm.get('clientSponsorId')
    let centerInchargeIdRef=this.masterDataUtil.masterDataForm.get('centerInchargeId')
   
    let masterDataObject:dataObject
    // if(this.enableEdit){
    //    this.getTraingCenterDetailsbyPartner(i)
    // this.getcenterInCharge(i)
    // this.getTraingCenterDetailsbyTcId(i)
    // this.setClientSponsor(i)
    // }
  
    masterDataObject={
      projectDetails:{
        projectId:masterDataItem.get('projectId').value
      },
      partnerDetails:{
        isGradingEnable:masterDataItem.get('isGradingEnable').value,
        ...((partnerIdRef.value==null) && {partnerName:masterDataItem.get('partnerName').value}),
        ...((partnerIdRef.value!==null) && {partnerId:partnerIdRef.value}),
        partnerProjectId:masterDataItem.get('partnerProjectId').value,
        traningCentersDetails:{
          centerAddress:masterDataItem.get('centerAddress').value,
          district:masterDataItem.get('district').value,
          latitude:masterDataItem.get('latitude').value,
          longitude:masterDataItem.get('longitude').value,
          tcId:masterDataItem.get('tcId').value,
          tcName:masterDataItem.get('tcName').value,
          ...((centerInchargeIdRef.value==null) && {centerInCharge:{
            
            firstName:masterDataItem.get('ciName').value?masterDataItem.get('ciName').value.split(" ")[0]?masterDataItem.get('ciName').value.split(" ")[0]:'':'',
                  lastName:masterDataItem.get('ciName').value?masterDataItem.get('ciName').value.split(" ")[1]?masterDataItem.get('ciName').value.split(" ")[1]:'':'',
                  phone:masterDataItem.get('ciNumber').value+'',
                  email:masterDataItem.get('ciEmail').value
          }}),
          ...((centerInchargeIdRef.value!==null) && {centerInchargeId:centerInchargeIdRef.value}),
          
        },
        ...((clientSponsorIdRef.value==null) && {clientSponsor:{
          firstName:masterDataItem.get('csName').value?masterDataItem.get('csName').value.split(" ")[0]?masterDataItem.get('csName').value.split(" ")[0]:'':'',
          lastName:masterDataItem.get('csName').value?masterDataItem.get('csName').value.split(" ")[1]?masterDataItem.get('csName').value.split(" ")[1]:'':'',
          phone:masterDataItem.get('csNumber').value+'',
          email:masterDataItem.get('csEmail').value
        }}),
        ...((clientSponsorIdRef.value!==null) && {clientSponsorId:clientSponsorIdRef.value}),


      }
      
    }
    if(this.isNew){
      this.loadingSpinner.isLoading.next(true);
      this.store.dispatch(new AddIndividualStart(masterDataObject))
    }else if(this.enableEdit){
      if(masterDataItem.get('partnerProjectId').value != ""){
        if(masterDataItem.get('tcName').value != ""){
          if(masterDataItem.get('centerAddress').value != "" && masterDataItem.get('district').value != ""){
            this.loadingSpinner.isLoading.next(true);
            this.store.dispatch(new UpdateIndividualStart({
              projectMappingId:this.masterData[i].projectMappingId,
              masterData:masterDataObject
            }));
            if(this.tcId!==''||this.projectName!==''||this.partnerName!==''){
                this.tcId=''
                this.projectName=''
                this.partnerName=''
            }
          }else{
            this.toastr.error('Please enter the center address or district');
            this.store.dispatch(new ListMasterDataStarts());
          }
        }else{
          this.toastr.error('Please enter the training center name');
          this.store.dispatch(new ListMasterDataStarts());
        }
      }else{
        this.toastr.error('Please enter the partner project id');
        this.store.dispatch(new ListMasterDataStarts());
      }
    }
   
    this.isNew=false;
    this.enableEdit=false;
    this.enableEditIndex=null;
    this.isAllButtonChecked = false;
    this.selectedRowCount = 0;
    clientSponsorIdRef.setValue(null);
    centerInchargeIdRef.setValue(null);
    partnerIdRef.setValue(null);
  }

  //set client sponser deatils by selecting one of client sponser from list.
  setClientSponsor(i){
    this.clientSponsors$.subscribe((listofClientSponsors:any[])=>{
     this.clientSponsorSelected= listofClientSponsors.findIndex((element:any)=>{ 
        return (element.firstName+" "+element.lastName)==this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].get('csName').value
      })
      if(this.clientSponsorSelected!==-1){
        this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].patchValue({
          csName:listofClientSponsors[this.clientSponsorSelected].firstName+" "+listofClientSponsors[this.clientSponsorSelected].lastName,
          csNumber:listofClientSponsors[this.clientSponsorSelected].phone,
          csEmail:listofClientSponsors[this.clientSponsorSelected].email
        })
        this.masterDataUtil.masterDataForm.patchValue({
          clientSponsorId:listofClientSponsors[this.clientSponsorSelected].userId
        })
      }
      else{
        this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].patchValue({
          csNumber:null,
          csEmail:null
        })
        this.masterDataUtil.masterDataForm.patchValue({
          clientSponsorId:null
        })
      }
    })
  }

  onClick(val) {
    (val as HTMLInputElement).click()
  }
  
  addFile(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
     this.file = fileList[0];
    }
    //   let formData: FormData = new FormData();
    //   formData.append('clientMasterData', file); uploadExcel
    //   this.store.dispatch(new AddMultipleStarts(formData));
    // }

  }

  //to upload file to add master data.
  uploadFile(s:NgModel){
    s.control.markAsUntouched({
      onlySelf:true
    });
    if(this.file!==null){
      this.loadingSpinner.isLoading.next(true);
      let formData: FormData = new FormData();
      formData.append('uploadExcel', this.file);
      this.store.dispatch(new AddMultipleStarts({projectId:this.selectedProjectId,data:formData}));

      this.failedUploadDataSub =  this.store.select(failedUploadData).subscribe(data =>{
        if(data.failuresRecordsCount > 0){
          this.isFailedDataTableOpened = true;
          this.failedUploadData = data;
        }
      });
    }
    this.file=null;
    this.selectedProjectId=null;
    this.fileInputElement.nativeElement.value="";
  }

  //to close failed data table which is opend after uploading the master data file to show success and failed record.
  closeFailedDataTable(){
    this.store.dispatch(new ListMasterDataStarts());
    this.store.dispatch(new ResetFailedUploadedData());
    this.isFailedDataTableOpened = false;
    //this.failedUploadData.failureRecords = [];
    // this.failedUploadData.failuresRecordsCount = 0;
    // this.failedUploadData.totalRecord = 0;
    if(this.failedUploadDataSub){
      this.failedUploadDataSub.unsubscribe();
    }
  }

  updateFile(s:NgModel){
    s.control.markAsUntouched({
      onlySelf:true
    });
    this.showuploadOptions=false
    this.file=null
    this.selectedProjectId=null
  }

  //to download the master template file.
  downloadFile(){
    let fileType = "masterDataManagement";
    this.store.dispatch(new DownloadTemplateStart({ fileType })); 
  }
  
  cancel() {
    let i = this.enableEditIndex;
    if(this.isNew){
      (this.masterDataUtil.masterDataForm.get('listOfMasterData') as FormArray).removeAt(0)
      this.isNew=false

    }else if(this.enableEdit){
      this.enableEdit=false,
      this.enableEditIndex=null
      this.masterDataUtil.masterDataForm.patchValue({
        partnerId:null,
        clientSponsorId:null,
        tcId:null,
        centerInchargeId:null,
      });
      (this.masterDataUtil.masterDataForm.get('listOfMasterData') as FormArray).controls[i].setValue({projectId:(this.masterData[i].projectDetails.projectId),  
        isGradingEnable:this.masterData[i].partnerDetails.isGradingEnable,
        partnerProjectId: (this.masterData[i].partnerDetails.partnerProjectId),
        partnerName: (this.masterData[i].partnerDetails.partnerName),
        csName:(this.masterData[i].partnerDetails.clientSponsor.firstName+" "+this.masterData[i].partnerDetails.clientSponsor.lastName),
        csEmail:(this.masterData[i].partnerDetails.clientSponsor.email),
        csNumber:(this.masterData[i].partnerDetails.clientSponsor.phone),
        tcId:(this.masterData[i].partnerDetails.traningCentersDetails.tcId),
        tcName:(this.masterData[i].partnerDetails.traningCentersDetails.tcName),
        district:(this.masterData[i].partnerDetails.traningCentersDetails.district),
        latitude: (this.masterData[i].partnerDetails.traningCentersDetails.latitude),
        centerAddress: (this.masterData[i].partnerDetails.traningCentersDetails.centerAddress),
        ciName:(this.masterData[i].partnerDetails.traningCentersDetails.centerInCharge.firstName+" "+this.masterData[i].partnerDetails.traningCentersDetails.centerInCharge.lastName),
        ciEmail:(this.masterData[i].partnerDetails.traningCentersDetails.centerInCharge.email),
        ciNumber:(this.masterData[i].partnerDetails.traningCentersDetails.centerInCharge.phone),
        longitude: (this.masterData[i].partnerDetails.traningCentersDetails.longitude),
        projectName:(this.masterData[i].projectDetails.projectName)})
    }
    this.enableEdit = false;
    this.enableEditIndex= null;
  }

  list() {
    this.isApplyDisabled = true;
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new ListMasterDataStarts());
  }

  delete(event) { 
    let checkEle = event.target.closest("form").getElementsByClassName("checkbox");
    let projectMappingIds = [];
    for (var ele of checkEle) { 
      let checkedElement = ele.getElementsByTagName("input")[0].checked;
      if(checkedElement) {
        let checkedElementId = ele.getElementsByTagName("input")[0].id;
        let mappingId = this.masterData[checkedElementId].projectMappingId
        projectMappingIds.push(mappingId);
      }
    }
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new DeleteStart(projectMappingIds));
    this.selectedRowCount = 0;
    this.isAllButtonChecked = false;
    event.target.closest("form").getElementsByClassName("selectall")[0].checked = false;   
    this.store.dispatch(new ListMasterDataStarts());
  }

  ngOnInit(): void {
    this.masterDataFormListRef=(this.masterDataUtil.masterDataForm.get('listOfMasterData') as FormArray)
    this.loadingSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new FetchProjectsStart())
    this.store.dispatch(new ListMasterDataStarts());
    this.store.dispatch(new ListPartnerStarts());
    this.store.dispatch(new ListofClientSponsorStart())
    this.store.dispatch(new ListofCenterInchargeStart())
    this.loadMasterDataSub=this.store.select(loadMasterData).subscribe(dataObjectArray=>{
      this.masterData=[...dataObjectArray];
      // if((this.masterDataUtil.masterDataForm.get('listOfMasterData') as FormArray).length==0){
        (this.masterDataUtil.masterDataForm.get('listOfMasterData') as FormArray).clear();
        dataObjectArray.forEach((dataObject)=>{
          (this.masterDataUtil.masterDataForm.get('listOfMasterData') as FormArray).push(
            new FormGroup({projectId:new FormControl(dataObject.projectDetails.projectId), 
              isGradingEnable:new FormControl(dataObject.partnerDetails.isGradingEnable), 
              partnerProjectId: new FormControl(dataObject.partnerDetails.partnerProjectId),
              partnerName: new FormControl(dataObject.partnerDetails.partnerName),
              csName:new FormControl(dataObject.partnerDetails.clientSponsor.firstName+" "+dataObject.partnerDetails.clientSponsor.lastName),
              csEmail:new FormControl(dataObject.partnerDetails.clientSponsor.email),
              csNumber:new FormControl(dataObject.partnerDetails.clientSponsor.phone),
              tcId:new FormControl(dataObject.partnerDetails.traningCentersDetails.tcId),
              tcName:new FormControl(dataObject.partnerDetails.traningCentersDetails.tcName),
              district:new FormControl(dataObject.partnerDetails.traningCentersDetails.district),
              latitude: new FormControl(dataObject.partnerDetails.traningCentersDetails.latitude),
              centerAddress: new FormControl(dataObject.partnerDetails.traningCentersDetails.centerAddress),
              ciName:new FormControl(dataObject.partnerDetails.traningCentersDetails.centerInCharge.firstName+" "+dataObject.partnerDetails.traningCentersDetails.centerInCharge.lastName),
              ciEmail:new FormControl(dataObject.partnerDetails.traningCentersDetails.centerInCharge.email),
              ciNumber:new FormControl(dataObject.partnerDetails.traningCentersDetails.centerInCharge.phone),
              longitude: new FormControl(dataObject.partnerDetails.traningCentersDetails.longitude),
              projectName:new FormControl(dataObject.projectDetails.projectId)})
              )
            })
      // }       
        });
  
    this.projectList$ = this.store.pipe(select(getAllProjects));
    this.users$ = this.store.pipe(select(loadUsers));
    this.partners$ = this.store.pipe(select(loadPartners));
    this.clientSponsors$=this.store.pipe(select(loadClientSponsers));
    this.centerInchargeList$=this.store.pipe(select(loadCenterIncharge));
    this.TCforPartner$=this.store.pipe(select(loadTCForPartner));
  }

  //to edit the record make the list selected item as ediable.
  enableEditMethod(event) {
    let i = event.target.closest("form").querySelector("td.checkbox >input:checked").id;
    this.enableEdit=true;
    this.enableEditIndex= i;
    this.partners$.subscribe(partners => {
      partners.forEach(partner => {
        if (partner['partnerName'] === this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].get('partnerName').value) {
          this.masterDataUtil.masterDataForm.patchValue({
            partnerId:partner.partnerId,
            clientSponsorId:partner.clientSponsorId
          })    
        }
      })
    })

    this.TCforPartner$.subscribe(TrainingCenters => {
      TrainingCenters.forEach((TC:{
        "centerInchargeLastName": string,
        "centerInchargeFirstName": string,
        "district": string,
        "latitude": string,
        "centerInchargeContact":string,
        "centerInchargeEmail": string,
        "tcId": string,
        "tcName":string,
        "centerAddress": string,
        "centerInchargeId": string,
        "longitude":string
    }) => {
        if (TC['tcId'] === this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].get('tcId').value) {
          this.masterDataUtil.masterDataForm.patchValue({
            centerInchargeId:TC.centerInchargeId
          })  
        }
      })
    })

    this.centerInchargeList$.subscribe((listofCenterIncharge:any[])=>{
      this.centerInchargeSelected= listofCenterIncharge.findIndex((element:any)=>{      
         return (element.firstName+" "+element.lastName)==this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].get('ciName').value
       })
       if(this.centerInchargeSelected!==-1){
         this.masterDataUtil.masterDataForm.patchValue({
           centerInchargeId:listofCenterIncharge[this.centerInchargeSelected].userId
         })
       }
    })

     this.clientSponsors$.subscribe((listofClientSponsors:any[])=>{
      this.clientSponsorSelected= listofClientSponsors.findIndex((element:any)=>{
         return (element.firstName+" "+element.lastName)==this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].get('csName').value
       })
       if(this.clientSponsorSelected!==-1){
         this.masterDataUtil.masterDataForm.patchValue({
           clientSponsorId:listofClientSponsors[this.clientSponsorSelected].userId
         })
       }
     
    })
  }

 getValue(Ref:HTMLInputElement){
 }

 //to get details of training center by given partner 
  getTraingCenterDetailsbyPartner(i) {
    let foundProject=false
    // this.masterDataUtil.masterDataForm.get('projectId').setValue(e.target.value)
    this.partners$.subscribe(partners => {
      partners.forEach(partner => {
        if (partner['partnerName'] === this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].get('partnerName').value) {
          this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].patchValue({
            csName:partner.clientSponsorFirstName+" "+partner.clientSponsorLastName,
            csEmail:partner.clientSponsorEmail,
            csNumber:partner.clientSponsorContact
          });
          this.masterDataUtil.masterDataForm.patchValue({
            partnerId:partner.partnerId,
            clientSponsorId:partner.clientSponsorId
          })
          foundProject=true
          this.store.dispatch(new ListofTrainingCenterStart(partner.partnerId))
          
        }

      })
      if(!foundProject){
        this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].patchValue({
          csName:null,
          csEmail:null,
          csNumber:null,
          tcId:null
        });
        this.masterDataUtil.masterDataForm.patchValue({
          partnerId:null,
          clientSponsorId:null
        })
        this.store.dispatch(new ListofTrainingCenterEnd([]))
        this.getTraingCenterDetailsbyTcId(i)
      }
    })

  }

// to get training center details by given tcId.
  getTraingCenterDetailsbyTcId(i) {
    let foundTC=false

    // this.masterDataUtil.masterDataForm.get('projectId').setValue(e.target.value)
    this.TCforPartner$.subscribe(TrainingCenters => {
      TrainingCenters.forEach((TC:{
        "centerInchargeLastName": string,
        "centerInchargeFirstName": string,
        "district": string,
        "latitude": string,
        "centerInchargeContact":string,
        "centerInchargeEmail": string,
        "tcId": string,
        "tcName":string,
        "centerAddress": string,
        "centerInchargeId": string,
        "longitude":string
    }) => {
        if (TC['tcId'] === this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].get('tcId').value) {
          this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].patchValue({
            
            
            tcName:TC.tcName,
            district:TC.district,
            latitude:TC.latitude,
            centerAddress:TC.centerAddress,
            ciEmail:TC.centerInchargeEmail,
            ciName:TC.centerInchargeFirstName+" "+TC.centerInchargeLastName,
            ciNumber:TC.centerInchargeContact,
            longitude:TC.longitude,
          });
          this.masterDataUtil.masterDataForm.patchValue({
            centerInchargeId:TC.centerInchargeId
          })
          foundTC=true
          
        }

      })
      if(!foundTC){
        this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].patchValue({
          district:null,
            latitude:null,
            centerAddress:null,
            ciEmail:null,
            ciName:null,
            ciNumber:null,
            longitude:null,
            tcName:null
        });
        this.masterDataUtil.masterDataForm.patchValue({
          centerInchargeId:null
        })
      }
    })

  }
  
  // to get center in charge
  getcenterInCharge(i){

    this.centerInchargeList$.subscribe((listofCenterIncharge:any[])=>{
     this.centerInchargeSelected= listofCenterIncharge.findIndex((element:any)=>{   
        return (element.firstName+" "+element.lastName)==this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].get('ciName').value
      })
      if(this.centerInchargeSelected!==-1){
        this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].patchValue({
          ciName:listofCenterIncharge[this.centerInchargeSelected].firstName+" "+listofCenterIncharge[this.centerInchargeSelected].lastName,
          ciNumber:listofCenterIncharge[this.centerInchargeSelected].phone,
          ciEmail:listofCenterIncharge[this.centerInchargeSelected].email
        })
        this.masterDataUtil.masterDataForm.patchValue({
          centerInchargeId:listofCenterIncharge[this.centerInchargeSelected].userId
        })
      }
      else{
        this.masterDataUtil.masterDataForm.get('listOfMasterData')['controls'][i].patchValue({
          ciNumber:null,
          ciEmail:null
        })
        this.masterDataUtil.masterDataForm.patchValue({
          centerInchargeId:null
        })
      }
    })
  }  
}


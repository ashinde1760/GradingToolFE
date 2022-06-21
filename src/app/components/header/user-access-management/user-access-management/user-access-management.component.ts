import { DownloadTemplateStart, FailedUploadData, UpdateStatusStarts } from './../../../../store/actions/user.action';
import { failedUploadData, getProcessState, getSuccess } from './../../../../store/selectors/user.selectors';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { getError } from '../../../../store/selectors/user.selectors';
import { ListUserStarts, AddEmptyRow, DeleteUserStart, AddUserStarts, UpdateUserStarts, AddMultipleUsersStarts, FilterUserRequest, FilterUserStarts, ResetFailedUploadedData, RemoveUserRow } from '../../../../store/actions/user.action';
import { User } from '../../../../store/models/user';
import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store';
import { Observable, Subject, of, Subscription } from 'rxjs';
import { loadUsers } from '../../../../store/selectors/user.selectors';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner/loading-spinner.service';
import { UserEffects } from 'src/app/store/effects/user.effects';
import { LogoutEnd } from 'src/app/store/actions/auth.actions';


@Component({
  selector: 'app-user-access-management',
  templateUrl: './user-access-management.component.html',
  styleUrls: ['./user-access-management.component.css', './user-access-management.component.scss'],
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
export class UserAccessManagementComponent implements OnInit, OnDestroy {

  users: User[];
  targetUser$: Observable<User>;
  responseOfDelet$: Observable<string>;
  errorMessage$: Observable<string>;
  successMessage$: Observable<string>;
  @ViewChild('input')
  fileInputElement:ElementRef
  file:File=null
  fileName = "";
  newDynamic$: Observable<User[]>;
  enableEdit = false;
  enableEditIndex = null;
  disableButton: boolean = false;
  isOld: boolean = true;
  OldUser: any = {};
  isNew: boolean = true;
  showFilter = false;
  searchBy = null;
  searchString = "";
  showFialedMsg: boolean = false;
  message: string;
  uploadedData: any;
  private subject: Subject<string> = new Subject();
  isAddingRowForFirstTime: boolean = false;
  phoneNo: string = '';
  showError: boolean = false;
  showEmailError: boolean = false;
  emailAddress: string = '';
  isActive: boolean = false;
  showuploadOptions=false;
  isFailedDataTableOpened: boolean = false;
  failedUploadData: FailedUploadData;
  failedUploadDataSub: Subscription;
  isLoading: boolean = false;
  loadUserSubscription: Subscription;
  isApplyDisabled: boolean = true;
  checkedRows: number = 0;
  deleteUsersSub: Subscription;
  emailHover: boolean = true;
  
isAllButtonChecked: boolean = false;

  constructor(private router: Router, private store: Store<AppState>, private httpClient: HttpClient, private toastr: ToastrService, private loadingSpinner: LoadingSpinnerService, private userEffect: UserEffects) { }

  ngOnInit(): void {
    this.loadingSpinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new ListUserStarts());
    this.loadUserSubscription = this.store.pipe(select(loadUsers)).subscribe((data) =>{
      this.users = data;
    });
    this.errorMessage$ = this.store.select(getError);
    this.successMessage$ = this.store.select(getSuccess);
   }

   ngOnDestroy(){
    this.isFailedDataTableOpened = false;
    if(this.failedUploadDataSub){
      this.failedUploadDataSub.unsubscribe();
    }
    if(this.loadUserSubscription){
      this.loadUserSubscription.unsubscribe();
    }
    if(this.deleteUsersSub){
      this.deleteUsersSub.unsubscribe();
    }
   }

   selectAll(event){
    let checkEle = event.target.closest("form").getElementsByClassName("checkbox");
    if(event.target.checked){
      this.checkedRows = 0;
      for (var ele of checkEle) { 
        ele.getElementsByTagName("input")[0].checked = true;
        this.checkedRows++;
      }
    }
    else{
      this.checkedRows = checkEle.length;
      for (var ele of checkEle) { 
        ele.getElementsByTagName("input")[0].checked = false;
        this.checkedRows--;
      }
    }
  }

  onChecked(event){
    if(event.target.checked){
      this.checkedRows++;
    }else{
      this.checkedRows--;
      this.enableEdit = false;
    }
    let checkEle = event.target.closest("form").getElementsByClassName("checkbox");
    this.isAllButtonChecked = checkEle.length == this.checkedRows ? true: false;
    if(!this.isAllButtonChecked){
      event.target.closest("form").getElementsByClassName("selectall")[0].checked = false;   
    }
  }

  onEdit(event){
    this.isNew = true;
    this.enableEdit = true;
    let checkEle = event.target.closest("form").getElementsByClassName("checkbox");
    for (var ele of checkEle) { 
      let checkedElement = ele.getElementsByTagName("input")[0].checked;
      if(checkedElement) {
        let checkedElementId = ele.getElementsByTagName("input")[0].id;
        this.enableEditIndex = checkedElementId;
        let userId = this.users[checkedElementId].userId;
      }
    }
  }

  editUser(event){
    let checkEle = event.target.closest("form").getElementsByClassName("checkbox");
    event.target.closest(".user-data").querySelector("form.filter-control").reset();
    for (var ele of checkEle) { 
      let checkedElement = ele.getElementsByTagName("input")[0].checked;
      if(checkedElement){
        let checkedElementId = ele.getElementsByTagName("input")[0].id;
        let userId = this.users[checkedElementId].userId;
        let row = ele.getElementsByTagName("input")[0].closest("tr");
        let firstName = row.querySelector('input[name="firstName"]').value;
        let lastName = row.querySelector('input[name="lastName"]').value;
        let phone = row.querySelector('input[name="phone"]').value;
        let email = row.querySelector('input[name="email"]').value;
        let role = row.querySelector('select[name="role"]').value;
        if (firstName !== '') {
          if (this.checkPhone(phone)) {
            if (this.checkEmail(email)) {
              this.loadingSpinner.isLoading.next(true);
              if (!this.isNew) {
                this.checkedRows = 0
                this.enableEdit = false;
                this.disableButton = false;
                this.isNew = true;
                this.isAddingRowForFirstTime = false;
                this.store.dispatch(new AddUserStarts({
                  firstName: firstName,
                  lastName: lastName,
                  phone: phone,
                  email: email,
                  role: role
                }))
                this.phoneNo = '';          
              } else {
                this.isAddingRowForFirstTime = false;
                this.edit(firstName, lastName, phone, email, role, userId);
              }
            }
            else
            this.toastr.error("Please provide valid Email Address", 'Error!');
          }
          else
          this.toastr.error("Please provide valid Phone Number", 'Error!');
        } else
        this.toastr.error("Please provide FirstName", 'Error!');
      }
    }
  }

  onDelete(event){
    let checkEle = event.target.closest("form").getElementsByClassName("checkbox");
    let userIds = [];
    for (var ele of checkEle) { 
      let checkedElement = ele.getElementsByTagName("input")[0].checked;
      if(checkedElement) {
        let checkedElementId = ele.getElementsByTagName("input")[0].id;
        let userId = this.users[checkedElementId].userId;
        userIds.push(userId);
      }
    }
    this.deleteUsersSub = this.userEffect.deleteUsers(userIds).subscribe(
      (data) =>{
        this.checkedRows = 0;
        let failureLength = data["failure"].length;
        let successLength = data["success"].length;
        if(successLength != 0){
          this.toastr.success(successLength + " user(s) deleted. \n" + failureLength + " user(s) not deleted.");
        }else if(failureLength != 0){
          this.toastr.error("All selected user(s) not deleted.");
        }
        this.loadingSpinner.isLoading.next(true);
        this.store.dispatch(new ListUserStarts());
        this.loadUserSubscription = this.store.pipe(select(loadUsers)).subscribe((data) =>{
          this.users = data;
        });
        event.target.closest("form").getElementsByClassName("selectall")[0].checked = false;
      },
      (error: HttpErrorResponse) =>{
        if(error.error["errorCode"] == 401){
          this.router.navigateByUrl('/auth');
          this.store.dispatch(new LogoutEnd());
        }
        this.toastr.error(error.error["message"],'Failed');
        this.store.dispatch(new ListUserStarts());
        this.loadUserSubscription = this.store.pipe(select(loadUsers)).subscribe((data) =>{
          this.users = data;
        });
    });
  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  addFilter() {
    this.showFilter = true
  }
  removeFilter() {
    this.showFilter = false
    this.searchBy = ""
  }
  modifyFilter(event: Event) {
    this.searchBy = ((event.target) as HTMLInputElement).value
  }

  show_hide() {
    var click = document.getElementById("dropdown-list");
    if (click.style.display === "none")
      click.style.display = "block";
    else
      click.style.display = "none";
  }

  callModifyComp() {
    this.router.navigate(['user-access-management/modifyUser']);
  }

  closeModal(){
    this.file=null;
    this.fileInputElement.nativeElement.value="";
  }

  enableEditMethod(i, name) {
    this.isNew = true;
    this.enableEdit = true;
    this.enableEditIndex = i;
  }

  addNew() {
    if (!this.isAddingRowForFirstTime) {
      this.isNew = false;
      this.enableEdit = true;
      this.enableEditIndex = 0;
      this.isAddingRowForFirstTime = true;
      this.store.dispatch(new AddEmptyRow({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        role: "",
        status: "",
        userId: ""
      }));
    }
  }

  changeshowUploadOptions(){
    this.showuploadOptions=!this.showuploadOptions;
  }

  edit(firstName, lastName, phone, email, role, userId) {
    this.enableEdit = false;
    this.disableButton = false;
    this.isNew = true;
    this.checkedRows = 0
    this.enableEditIndex = null;
    this.store.dispatch(new UpdateUserStarts({
      userId: userId,
      user: {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        role: role
      }
    }));
  }

  cancel(event) {
    let checkEle = event.target.closest("form").getElementsByClassName("checkbox");
    for (var ele of checkEle) { 
      let checkedElement = ele.getElementsByTagName("input")[0].checked;
      if(checkedElement) {
        let checkedElement = ele.getElementsByTagName("input")[0].closest("tr");
        let currentUser = this.users[this.enableEditIndex];
        checkedElement.querySelector('input[name="firstName"]').value = currentUser.firstName;
        checkedElement.querySelector('input[name="lastName"]').value = currentUser.lastName;
        checkedElement.querySelector('input[name="phone"]').value = currentUser.phone;
        checkedElement.querySelector('input[name="email"]').value = currentUser.email;
        checkedElement.querySelector('select[name="role"]').value = currentUser.role;
        if(currentUser.status != null){
          let isChecked = currentUser.status == 'active';
          if(checkedElement.querySelector('input#togBtn')){
            checkedElement.querySelector('input#togBtn').checked = isChecked;
          }
        }
      }
    }
    this.enableEdit = false;
    if(!this.isNew){
      this.store.dispatch(new RemoveUserRow());
      this.isNew = true;
      this.isAddingRowForFirstTime = false;
    }
  }

  onFileUpload(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
    }
  }

  uploadFile(){
    if(this.file!==null){ 
      this.loadingSpinner.isLoading.next(true);
      let formData: FormData = new FormData();
      formData.append('multipeUsers', this.file);
      this.store.dispatch(new AddMultipleUsersStarts(formData));
    }
    this.file=null;
    this.fileInputElement.nativeElement.value="";  
    this.failedUploadDataSub =  this.store.select(failedUploadData).subscribe(data =>{
      if(data.failedRecordCount > 0){
        this.isFailedDataTableOpened = true;
        this.failedUploadData = data;
      }
    });
  }

  closeFailedDataTable(){
    this.store.dispatch(new ListUserStarts());
    this.store.dispatch(new ResetFailedUploadedData());
    this.isFailedDataTableOpened = false;
    if(this.failedUploadDataSub){
      this.failedUploadDataSub.unsubscribe();
    }
  }

  downloadFile(){
    let fileType = "userAccessManagement";
    this.store.dispatch(new DownloadTemplateStart({ fileType })); 
  }

  filetrBy(firstName, phoneNo, role) {
    this.checkedRows = 0;
    this.loadingSpinner.isLoading.next(true);
    this.subject.next(firstName);
    this.store.dispatch(new FilterUserStarts({
      firstName: firstName,
      phoneNo: phoneNo,
      role: role
    }))
  }

  deleteFieldValue(userId) {
    this.store.dispatch(new DeleteUserStart(userId));
  }

  listUser() {
    this.checkedRows = 0;
    this.isApplyDisabled = true;
    this.loadingSpinner.isLoading.next(true);
    this.store.dispatch(new ListUserStarts());
  }

  setApply(firstName, phoneNo, role){
    this.isApplyDisabled = firstName===''&&phoneNo===''&&role==='';
  }


  checkPhone(phone) {
    var phoneNum = "[7-9]{1}[0-9]{9}";
    if (phone.match(phoneNum)) {
      return true;
    }
    else {
      return false;
    }
  }

  checkEmail(emailAddress) {
    var email = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    if (emailAddress.match(email)) {
      return true;
    }
    else {
      return false;
    }
  }

  changeStatus(e, userId) {
    this.loadingSpinner.isLoading.next(true);
    if (e.target.checked)
      this.store.dispatch(new UpdateStatusStarts({ userId: userId, status: "active" }))
    else
      this.store.dispatch(new UpdateStatusStarts({ userId: userId, status: "disable" }))
  }
}
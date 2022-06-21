// const ip = 'gradingtool.reactiveworks.net/gradingTool'

const ip = 'localhost:8080/gradingTool'
// const ip = 'gradingtool.reactiveworks.net/dev-gradingTool'
export const AuthBaseUrl = `http://${ip}/user/login`
export const VarifyUserByOtpUrl = `http://${ip}/user/verifyOtpFirstTimeLogin`
export const CreatePasswordUrl =  `http://${ip}/user/createPasswordFirstTimeLogin`
export const DeleteMultipleUsersUrl = `http://${ip}/user/deleteMultipleUsers`
export const ForgetPassReqOTPUrl = `http://${ip}/user/forgetPassword/sendOtp`
export const ForgetPassVerifyOTPUrl = `http://${ip}/user/forgetPassword/verifyOtp`
export const ForgetPassCreatePassUrl = `http://${ip}/user/forgetPassword/createNewPassword`

export const ProjectBaseUrl = `http://${ip}/project/`
export const UserUrl =`http://${ip}/user/`
export const MasterDataUrl =`http://${ip}/masterData`
export const SchedulerUrl=`http://${ip}/scheduler`

export const SurveyBaseUrl = ProjectBaseUrl + 'survey/'
export const PartnerUrl =`http://${ip}/partner`
export const DownReportUrl =`http://${ip}/report`
export const FormURL =`http://${ip}/project/form`
export const FetchFormsURL=`http://${ip}/project/`

export const clientSponserList=`http://${ip}/user/filter?role=Client-Sponsor`
export const centerInchargeList=`http://${ip}/user/filter?role=Center-In-Charge`
export const trainingCenterwithPartnerId=`http://${ip}/partner/`
export const ViewReportUrl = `http://${ip}/report`
export const DownloadReportUrl = `http://${ip}/report/download`
export const DownloadAttachmentUrl = `http://${ip}/report/attachments/download`
export const accountDetailsUrl = `http://${ip}/user/accountDetails`
export const resetPassword = `http://${ip}/user/resetPassword`
export const downloadTemplateUrl = `http://${ip}/media/resource`

export const getProgressData=`http://${ip}/project/progressMeter/`
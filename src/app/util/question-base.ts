interface Type {

  value?: any;
  key?: string;
  label?: string;
  required?: boolean;
  order?: number;
  controlType?: string;
  type?: string;
  attachment?:{};
  isAttachmentRequired?: boolean;
  disabled?: boolean;
  isEventListenerRequired?: boolean;
  help?: string;
  isMediaAvailable?: boolean;
  options?: { optionId: string, optionData: string, optionWeightage: number, inputField: string }[];
  maxScore:number
}
export class QuestionBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  attachment:{};
  isAttachmentRequired: boolean;
  help: string;
  isMediaAvailable: boolean;
  disabled: boolean;
  isEventListenerRequired?: boolean;
  options: { optionId: string, optionData: string, optionWeightage: number, inputField: string }[];
  maxScore?:number

  constructor(props: Type) {
    this.key = props.key || "";
    this.label = props.label || "";
    this.required = !!props.required;
    // this.order = props.order === undefined ? 1 : props.order;

    this.controlType = props.controlType || "";
    this.type = props.type || "";
    this.isAttachmentRequired = !!props.isAttachmentRequired;
    this.disabled = !!props.disabled;
    this.isEventListenerRequired = props.isEventListenerRequired;
    this.options = props.options || [];
    this.help = props.help
    this.isMediaAvailable = props.isMediaAvailable
    this.attachment={...props.attachment}
    this.maxScore=props.maxScore
  }
}

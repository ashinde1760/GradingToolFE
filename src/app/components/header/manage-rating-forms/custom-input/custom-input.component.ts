import { Component, OnInit, Input, AfterViewChecked } from "@angular/core";
import {
  FormControlName,
  FormGroup,
  ControlValueAccessor,
} from "@angular/forms";

@Component({
  selector: "app-custom-input",
  templateUrl: "./custom-input.component.html",
  styleUrls: ["./custom-input.component.css"],
})
export class CustomInputComponent {
  @Input() isDisabled: boolean;
  @Input() formGroup: FormGroup;
  @Input() formControlName: FormControlName;
  @Input() id: string;
  @Input() type: string;
  @Input() isEventListenerRequired: string;
  constructor() {
  }
  onChange(id: string) {

  }
  ngOnInit() {
  }
}

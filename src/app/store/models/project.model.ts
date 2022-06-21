export class ProjectModel {
  constructor(
    private _projectId: string,
    private _surveyId: string,
    private _title: string,
    private _description: string,
    private _startDate: string,
    private _endDate: string,
    private _selfAssesmentDeadLine: string,
    private _selected: boolean = false
  ) {
  }

  get surveyId(): string {
    return this._surveyId;
  }

  set surveyId(value: string) {
    this._surveyId = value;
  }

  get projectId(): string {
    return this._projectId;
  }

  set projectId(value: string) {
    this._projectId = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get startDate(): string {
    return this._startDate;
  }

  set startDate(value: string) {
    this._startDate = value;
  }

  get endDate(): string {
    return this._endDate;
  }

  set endDate(value: string) {
    this._endDate = value;
  }

  get selfAssesmentDeadLine(): string {
    return this._selfAssesmentDeadLine;
  }

  set selfAssesmentDeadLine(value: string) {
    this._selfAssesmentDeadLine = value;
  }


  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
  }
}

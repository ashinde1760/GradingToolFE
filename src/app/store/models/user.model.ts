export class UserModel {
  constructor(
    private _firstName: string,
    private _lastName: string,
    private _userRole: string,
    private _jwtToken: string,
    private _accessToken: string,
    private _status: string, 
    private _oneTimeAccessToken?: string
  ) {
  }

  public get firstName(): string {
    return this._firstName;
  }
  public get lastName(): string {
    return this._lastName;
  }
  public get userRole(): string {
    return this._userRole;
  }
  public get jwtToken(): string {
    return this._jwtToken;
  }
  public get accessToken(): string {
    return this._accessToken;
  }

  public get status(): string{
    return this._status;
  }

  public get oneTimeAccessToken(): string{
    return this._oneTimeAccessToken;
  }
}

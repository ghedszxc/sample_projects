declare type TPermission = {
  action: string;
  subject: string;
};

declare class MPermission implements TPermission {
  action: string;
  subject: string;
  constructor({ action = "", subject = "" } = {} as TPermission) {
    this.action = action;
    this.subject = subject;
  }
}

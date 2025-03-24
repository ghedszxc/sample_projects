declare type TConfigForms = {
  _id: string;
  typeOfForm?: string; // Bicycle Parking Records Form
  isActivate?: boolean;
  isShowFirstSignature?: boolean;
  isShowSecondSignature?: boolean;
  isShowThirdSignature?: boolean;
  isAgreeLabel?: string;
  firstLabel?: string;
  secondLabel?: string;
  thirdLabel?: string;
  fourthLabel?: string;
  // Common fields:
  site: string;
  createdAt?: string | Date; // timestamp
  updatedAt?: string | Date;
};

declare type TGetAllConfigForms = {
  items: TConfigForms[];
  pageRange: string;
  pages: number;
};

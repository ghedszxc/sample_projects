declare type TQrCodeTemplate = {
  _id?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  updatedBy?: string;
  site: string;
  status?: string;
  A4Enabled?: boolean;
  A4Orientation?: string;
  A4FrontWysiwyg?: string;
  A4FrontQRCodeTop?: number;
  A4FrontQRCodeLeft?: number;
  A4FrontQRCodeSize?: number;
  A4FrontPassSize?: number;
  A4FrontPassTop?: number;
  A4FrontPassLeft?: number;
  A4BackWysiwyg?: string;
  A4BackQRCodeTop?: number;
  A4BackQRCodeLeft?: number;
  A4BackQRCodeSize?: number;
  A4BackPassSize?: number;
  A4BackPassTop?: number;
  A4BackPassLeft?: number;
  CCEnabled?: boolean;
  CCOrientation?: string;
  CCFrontWysiwyg?: string;
  CCFrontQRCodeTop?: number;
  CCFrontQRCodeLeft?: number;
  CCFrontQRCodeSize?: number;
  CCFrontPassSize?: number;
  CCFrontPassTop?: number;
  CCFrontPassLeft?: number;
  CCBackWysiwyg?: string;
  CCBackQRCodeTop?: number;
  CCBackQRCodeLeft?: number;
  CCBackQRCodeSize?: number;
  CCBackPassSize?: number;
  CCBackPassTop?: number;
  CCBackPassLeft?: number;
  prefixPass?: string;
  A4FrontQREnabled?: boolean;
  A4BackQREnabled?: boolean;
  CCFrontQREnabled?: boolean;
  CCBackQREnabled?: boolean;
  // prefixKey?: string;
};

declare type TQrCodeTemplateResponse = {
  items: TQrCodeTemplate[];
  pageRange: string;
  pages: number;
};

export default function useResident() {
  class MResident implements TResident {
    _id: string;
    givenName: string;
    surname: string;
    email: string;
    prefix: string;
    primaryPhone: string;
    nric: string;
    // passport: string;
    dateOfBirth: Date;
    vehicleModel: string;
    vehicleNo: string;
    vehicleColor: string;
    password: string;
    site: Record<string, any>;
    block: Record<string, any>;
    level: Record<string, any>;
    unitNumber: Record<string, any>;
    residentType: string;
    profilePicture: string;
    tenantDocument: Array<Record<string, any>>;
    organization: string;
    arrivalDate: Date;
    arrivalTime: Date;
    duration: string;
    purposeOfVisit: string;
    carRegistration: Array<Record<string, any>>;
    constructor(
      {
        _id = "",
        givenName = "",
        surname = "",
        email = "",
        prefix = "",
        primaryPhone = "",
        nric = "",
        //passport = "",
        dateOfBirth,
        vehicleModel = "",
        vehicleNo = "",
        vehicleColor = "",
        password = "",
        site = {
          _id: "",
          name: "",
        },
        block = {
          _id: "",
          name: "",
        },
        level = {
          _id: "",
          name: "",
        },
        unitNumber = {
          _id: "",
          name: "",
        },
        residentType = "",
        profilePicture = "",
        tenantDocument = [],
        organization = "",
        arrivalDate,
        arrivalTime,
        duration,
        purposeOfVisit,
        carRegistration = [],
      } = {} as TResident,
    ) {
      this._id = _id;
      this.givenName = givenName;
      this.surname = surname;
      this.email = email;
      this.prefix = prefix;
      this.primaryPhone = primaryPhone;
      this.nric = nric;
      //this.passport = passport;
      this.dateOfBirth = dateOfBirth;
      this.vehicleModel = vehicleModel;
      this.vehicleNo = vehicleNo;
      this.vehicleColor = vehicleColor;
      this.password = password;
      this.site = site;
      this.block = block;
      this.level = level;
      this.unitNumber = unitNumber;
      this.residentType = residentType;
      this.profilePicture = profilePicture;
      this.tenantDocument = tenantDocument;
      this.organization = organization;
      this.arrivalDate = arrivalDate;
      this.arrivalTime = arrivalTime;
      this.duration = duration;
      this.purposeOfVisit = purposeOfVisit;
      this.carRegistration = carRegistration;
    }
  }

  const resident = useState<TResident>(
    "resident",
    (): TResident => new MResident(),
  ) as unknown as Ref<TResident>;

  function setResidentValue(value = new MResident()) {
    resident.value = value;
  }

  const validate = (exceptions: string[] = []) => {
    let toBeValidated = resident.value;
    let emptyItems: string[] = [];
    if (exceptions.length > 0) {
      exceptions.forEach((exception) => {
        delete (toBeValidated as any)[exception];
      });
    }
    const validation = Object.values(toBeValidated).map((item, index) => {
      return new Promise((resolve, reject) => {
        if (!item) {
          emptyItems.push(Object.keys(toBeValidated)[index]);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
    const result = Promise.all(validation).then(() => {
      if (emptyItems.length > 0) {
        return {
          status: false,
          emptyItems,
          message: `${emptyItems.join(", ")} required.`,
        };
      } else {
        return {
          status: true,
          emptyItems,
          message: "All fields are valid.",
        };
      }
    });
    return result;
  };

  return {
    resident,
    validate,
    setResidentValue,
  };
}

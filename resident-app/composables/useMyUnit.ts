export default function useMyUnit() {
  class MUnitResident implements TUnitResident {
    _id: string;
    givenName: string;
    surname: string;
    email: string;
    prefix: string;
    primaryPhone: string;
    relationship: string;
    constructor(
      {
        _id = "",
        givenName = "",
        surname = "",
        email = "",
        prefix = "",
        primaryPhone = "",
        relationship = "",
      } = {} as TUnitResident,
    ) {
      this._id = _id;
      this.givenName = givenName;
      this.surname = surname;
      this.email = email;
      this.prefix = prefix;
      this.primaryPhone = primaryPhone;
      this.relationship = relationship;
    }
  }

  const resident = useState<TUnitResident>(
    "resident",
    (): TUnitResident => new MUnitResident(),
  ) as unknown as Ref<TUnitResident>;

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
  async function addUnitResident(_resident: any) {
    const { error, data } = await useLocalFetch("/api/my-unit", {
      method: "POST",
      body: JSON.stringify(_resident),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    console.log("result here", result);
    if (result && result?.value?.insertedId) {
      return Promise.resolve(result.value.insertedId as string);
    }
    if (result && result?.value?.message?.insertedId) {
      return Promise.resolve(result.value.message?.insertedId as string);
    }
  }
  async function getUnitResident(
    residentData: { page?: number; limit?: number } = { page: 1, limit: 2 },
  ) {
    const { error, data } = await useLocalFetch(`/api/my-unit/search`, {
      method: "POST",
      body: JSON.stringify(residentData),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    console.log("List Result", result);

    if (result) {
      return Promise.resolve(result.value as string);
    }
  }

  return {
    resident,
    validate,
    addUnitResident,
    getUnitResident,
  };
}

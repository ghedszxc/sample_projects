export default function useOnlineForms() {
  async function addUpdateCorrespondenceAddress(UCA: any) {
    const { error, data } = await useLocalFetch(
      "/api/update-correspondence-address/v1",
      {
        method: "POST",
        body: JSON.stringify(UCA),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result?.value?.insertedId) {
      return Promise.resolve(result.value.insertedId as string);
    }
  }

  async function addBulkDeliveryMovingInOut(BulkDelivery: any) {
    const { error, data } = await useLocalFetch(
      "/api/bulk-delivery-moving-in-out/v1",
      {
        method: "POST",
        body: JSON.stringify(BulkDelivery),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result?.value?.insertedId) {
      return Promise.resolve(result.value.insertedId as string);
    }
  }
  async function addRenovationForm(RenovationData: any) {
    const { error, data } = await useLocalFetch("/api/renovation/v1", {
      method: "POST",
      body: JSON.stringify(RenovationData),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result?.value?.insertedId) {
      return Promise.resolve(result.value.insertedId as string);
    }
  }

  async function createGiroApplication(giroApplication: any) {
    const { error, data } = await useLocalFetch("/api/giro-application/v1", {
      method: "POST",
      body: JSON.stringify(giroApplication),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result?.value?.insertedId) {
      return Promise.resolve(result.value.insertedId as string);
    }
  }

  async function createCarPark(carPark: any) {
    const { error, data } = await useLocalFetch("/api/car-park-label/v1", {
      method: "POST",
      body: JSON.stringify(carPark),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result?.value?.insertedId) {
      return Promise.resolve(result.value.insertedId as string);
    }
  }

  return {
    addUpdateCorrespondenceAddress,
    addBulkDeliveryMovingInOut,
    createGiroApplication,
    addRenovationForm,
    createCarPark,
  };
}

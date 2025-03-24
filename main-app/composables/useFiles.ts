export default function useFiles() {
  async function getSpecificImage(id: string): Promise<string | Blob> {
    const { error, data } = await useLocalFetch(`/api/files/${id}`, {
      method: "GET",
      responseType: "blob",
    });

    if (error?.value?.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data?.value) {
      const isBlob = data.value instanceof Blob;

      if (isBlob) {
        return Promise.resolve(data.value);
      }

      const base64String = data.value as string;
      return Promise.resolve(base64String);
    }

    return Promise.reject("No data received");
  }

  return {
    getSpecificImage,
  };
}

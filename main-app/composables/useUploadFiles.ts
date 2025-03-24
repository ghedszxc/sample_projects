export default function useUploadFiles() {
  let files = ref<any>([]);

  const attachedFiles = useState(
    "attachedFiles",
    (): Array<{ data: File }> | any[] => [],
  );
  const filesUrlUploaded = useState(
    "filesUrlUploaded",
    (): Array<{ data: File }> => [],
  );
  const isFileUploading = useState("isFileUploading", () => false);

  function uploadFile(file: any): Promise<object> {
    isFileUploading.value = true;
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file.data);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/files/upload?status=draft`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          file.progress = Math.round((event.loaded / event.total) * 100);
          // Handle progress (optional)
          if (file.progress === 100)
            setTimeout(() => {
              isFileUploading.value = false;
            }, 2000);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({ _id: response.id, name: file.name }); // Resolve with the id from the response
          } catch (error) {
            reject(new Error("Failed to parse server response"));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(formData);
    });
  }

  // Use async/await to handle the file uploads
  async function uploadFileUtil(fileString: any): Promise<any> {
    const results: any = [];
    // Iterate over file objects asynchronously
    for (const file of fileString) {
      try {
        if (typeof file === "string") {
          results.push(file);
          continue;
        }
        const fileId = await uploadFile(file); // Await the file upload
        results.push(fileId); // Collect the file ID
        files.value = [];
      } catch (e) {
        console.log("Error occurred while attaching images.", e);
      }
    }

    return results; // Return array of file IDs
  }

  // Show uploaded files
  function showUploadedFiles(fileString: any) {
    const fileStr = toRaw(fileString);
    filesUrlUploaded.value = fileStr.map((i: { url: string }) => i.url);
  }

  return {
    files,
    attachedFiles,
    filesUrlUploaded,
    isFileUploading,
    uploadFile,
    uploadFileUtil,
    showUploadedFiles,
  };
}

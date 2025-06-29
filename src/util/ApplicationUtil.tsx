const renameFile = (originalFile: any, newName: string) => {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
};

const generateUniqueID = (name: string) => {
  return name + Math.random().toString(16).slice(2);
};

const getFileExtension = (file: String) => {
  const dotIndex = file.indexOf(".");
  return file.substring(dotIndex + 1, file.length);
};

const getFileNameWithoutExtension = (file: String) => {
    const dotIndex = file.indexOf(".");
    return file.substring(0, dotIndex);
  };

const generateUniqueNumber = () => {
  var arr = [];
  while (arr.length < 2) {
    var randomnumber = Math.ceil(Math.random() * 100);
    if (arr.indexOf(randomnumber) === -1) {
      arr.push(randomnumber);
    }
  }
  console.log('genrateUniqueNumber',arr);
  
};

const compressImage = (imageFile:any, quality:any) => {
  return new Promise((resolve, reject) => {
      const $canvas = document.createElement("canvas");
      const image = new Image();
      image.onload = () => {
          $canvas.width = image.width;
          $canvas.height = image.height;
          //@ts-ignore
          $canvas.getContext("2d").drawImage(image, 0, 0);
          $canvas.toBlob(
              (blob) => {
                  if (blob === null) {
                      return reject(blob);
                  } else {
                      resolve(blob);
                  }
              },
              "image/jpeg",
              quality / 100
          );
      };
      // image.src = URL.createObjectURL(imageFile);
  });
};

const ApplicationUtil = {
  renameFile,
  generateUniqueID,
  getFileExtension,
  getFileNameWithoutExtension,
  generateUniqueNumber,
  compressImage
};

export default ApplicationUtil;

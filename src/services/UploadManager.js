import imageService from "./ImageService";
import axios from "axios";
import Compressor from 'compressorjs';

// use a different axios instance for uploading images.
const axiosInstance = axios.create({
  timeout: 5000
});

export default class UploadManager {
  constructor(imagesProvider, isPrivate) {
    this.imagesProvider = imagesProvider;
    this.isPrivate = isPrivate;
  }

  async uploadAll() {
    const result = [];
    let defaultImg = null;
    const isPrivate = this.isPrivate;
    for (const image of this.imagesProvider()) {
      // not uploaded
      if (image.file) {
        let imageToUpload = image.file;

        if (!isPrivate) {
          imageToUpload = await new Promise((resolve, reject) => {
            new Compressor(image.file, {
              maxWidth: 800,
              success(optimizedFile) {
                resolve(optimizedFile);
              },
              error(error) {
                reject(error);
              }
            });
          });
        }

        const uploadForm = await this._uploadFile(imageToUpload, isPrivate);
        if(image.default){
          defaultImg = uploadForm.id
        }
        result.push(uploadForm.id);
      } else {
        if(image.default){
          defaultImg = image.id
        }
        result.push(image.id);
      }
    }
    return {result,defaultImg};
  }

  async _uploadFile(image, isPrivate) {
    const contentType = image.type;
    const uploadForm = await imageService.create({
      isPrivate,
      contentType,
    });

    await axiosInstance.put(uploadForm.uploadUrl, image, {
      headers: {
        'Content-Type': contentType
      }
    });

    return uploadForm;
  }
};

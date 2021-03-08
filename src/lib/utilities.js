import axios from 'axios'
import { useState } from "react";
import firebase from "./firebase-utilities";
import UploadManager from "../services/UploadManager"
import imageService from '../services/ImageService';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  timeout: 10000
});

axiosInstance.interceptors.request.use(async function(request) {
  const user = await new Promise(resolve => {
    const authUser = firebase.auth().currentUser;
    if (authUser != null) {
      resolve(authUser);
    } else {
      firebase.auth().onAuthStateChanged(resolve);
    }
  });

  if (user) {
    const idToken = await user.getIdToken(false);
    request.headers.common["Masterframing-X-Auth-Token"] = idToken;
  }
  return request;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export function useInput(initial) {
  const [value, setValue] = useState(initial);
  return [
    value,
    setValue,
    {
      value,
      onChange: e => {
        setValue(e.target.value);
      },
    },
  ]
}

export function useToggleInput(initial) {
  const [checked, setChecked] = useState(initial);
  return [
    checked,
    setChecked,
    {
      checked,
      onChange: e => {
        setChecked(!checked);
      },
    },
  ]
}

export function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

export function formatPriceCode(priceCode) {
  let id;
  let displayName;
  if (typeof priceCode === "string") {
    id = priceCode;
    displayName = priceCode;
  } else if (priceCode) {
    id = priceCode.id;
    displayName = priceCode.displayName;
  } else {
    id = "new"
    displayName = "None"
  }
  return (
    <a href={`/admin/price-code/${id}`}>{displayName}</a>
  );
}

export const imageLoad = (src) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        resolve(img);
      };
    } catch (error) {
      reject(error);
    }
  });
};

// TODO: Will be used while Checkout

export const uploadImages = async (img) => {
    let imgFile = await dataURItoBlob(img);
    const imageUploader = new UploadManager(
    () => [
      {
        file: imgFile,
      },
    ],
    true
  );
  let res = await imageUploader.uploadAll();
  const images = await Promise.all(res.result.map((img) => imageService.get(img)));
  return images[0];
};

export const validURL = (str) => {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], {type: mimeString});
}

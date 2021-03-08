import ImageUploading from "react-images-uploading";
import { useEffect, useState } from "react";

export default function MultiImageUpload({ images, setImages }) {

  const [renderedImages, setRenderedImages] = useState(images)
  function onImagesChange(imageList, addUpdateIndex) {
    if(imageList.length>0){
      imageList = imageList.map(e=>{
        return {...e,default:false}
      })
      imageList[imageList.length-1].default = true
    }
    setRenderedImages(imageList);
  }
  useEffect(()=>{
    if(images && images.length>0){
      let findDefault = images.find(e=>{
        return e.default === true
      })
      if(!findDefault){
        images[images.length-1].default = true
      }
      setRenderedImages(images)
    }

  },[images])

  useEffect(()=>{
    setImages(renderedImages);
  },[renderedImages])

  let changeDefault = (index) =>{
    let newDefault = renderedImages
    newDefault = newDefault.map(e=>{
      e.default = false
      return e
    })
    newDefault[index].default = true
    setRenderedImages(newDefault)
  }

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onImagesChange}
      dataURLKey="url"
    >
      {({
        imageList = [],
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
        <div className="image-upload col-md-12 border rounded">
          <div
            className="text-center align-text-bottom position-absolute w-100 mt-2"
            onClick={onImageUpload}
          >
            <p>Click here to upload</p>
          </div>
          <div className="row m-3 mt-5">
            {renderedImages.map((image, index) => (
              <div key={index} className="col-md-3 text-center">
                <div className="float-right">
                  <div className="row">
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={() => onImageRemove(index)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                  </div>
                  <div className="row">
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={() => changeDefault(index)}
                  >
                    <span aria-hidden="true" style={{color:image.default?"blue":"#777777"}}>&#10003;</span>
                  </button>
                  </div>
                </div>
                <img src={image.url} alt="" width={200} height={200} />
              </div>
            ))}
          </div>
        </div>
      )}
    </ImageUploading>
  );
}

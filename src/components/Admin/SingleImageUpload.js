import ImageUploading from "react-images-uploading";

export default function SingleImageUpload({ image, setImage }) {
  function onImagesChange(imageList, addUpdateIndex) {
    setImage(imageList);
  }

  return (
    <ImageUploading
      value={image}
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
              {imageList.map((image, index) => (
                <div key={index} className="col-md-3 text-center">
                  <div className="float-right">
                    <button
                      type="button"
                      className="close"
                      aria-label="Close"
                      onClick={() => onImageRemove(index)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
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

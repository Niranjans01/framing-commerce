import { MdFileUpload, MdInfoOutline } from "react-icons/md";
import { AiOutlineWarning, AiOutlineCheckCircle } from 'react-icons/ai'
import { IoMdCloseCircle } from 'react-icons/io'
import { useState, useEffect, useRef } from 'react'
import Card from "react-bootstrap/Card";
import ImageUploading from 'react-images-uploading'
import { Row, Col } from 'react-bootstrap'
import { Tooltip } from "react-tippy";
import { useProduct } from "../../contexts/ProductContext";
import { useToasts } from "react-toast-notifications";

const UploadZone = () => {
  const maxNumber = 1

  const {
    dimHeight,
    setDimHeight,
    dimWidth,
    setDimWidth,
    setRatio,
    setImage,
    setImgHeightCM,
    setImgWidthCM,
    images,
    setImages,
    configurations,
    setResetDim
  } = useProduct();

  const imgEl = useRef(null);
  const dpcm = 118.1102 //300 dpi

  const [ requiredQuality, setRequiredQuality ] = useState(null)
  const [ photoQuality, setPhotoQuality ] = useState(false)

  const [ imgHeight, setImgHeight ] = useState(0)
  const [ imgWidth, setImgWidth ] = useState(0)
  const { addToast } = useToasts();

  // useEffect(() => {
  //   setRequiredQuality(computeMinSize(dimWidth, dimHeight, dpcm))
  //   setPhotoQuality(isGoodQuality(dimWidth, dimHeight, dpcm, imgWidth, imgHeight))
  // }, [dimHeight, dimWidth])

  const onChange = (imageList, addUpdateIndex) => {
    if(imageList.length>0 && (imageList[0].file.size)/1048576<40){
      setImages(imageList)
      setImage(imageList.length > 0 ? imageList[0] : null)
    }
    else{
      addToast(`Max. Upload file size is 40mb.`, {appearance: 'error', autoDismiss: true});
    }
  }

  const clearImage = () => {
    setImage(null);
    setImages([]);
    setRatio(null);
  };

  const eucledianDistance = (height1,width1,height2,width2) => {
    let a = height1 - height2
    let b = width1 - width2
    return Math.sqrt(a*a + b*b)
  }

  const handleSize = () => {
    if (imgEl && imgEl.current) {
      const ratio = imgEl.current.width / imgEl.current.height
      setImgHeight(imgEl.current.naturalHeight)
      setImgWidth(imgEl.current.naturalWidth)
      setRatio(ratio)
        setDimWidth(parseFloat((60 * ratio).toFixed(2)));
        setDimHeight(60);
        setImgHeightCM(60);
        setImgWidthCM(parseFloat((60 * ratio).toFixed(2)));

      setRequiredQuality(computeMinSize(dimWidth, dimHeight, dpcm))
      setPhotoQuality(
                isGoodQuality(
                  dimHeight * ratio,
                  dimWidth * ratio,
                  dpcm,
                  imgEl.current.naturalWidth,
                  imgEl.current.naturalHeight
                )
              );
    }
  }

  const isGoodQuality = (printWidth, printHeight, dpcm, imgWidth, imgHeight) => {
    const goodW = printWidth/38 * dpcm;
    const goodH = printHeight/38 * dpcm;
    const ratioW = imgWidth/38 / goodW
    const ratioH = imgHeight/38 / goodH
    const dist = (eucledianDistance(printHeight,printWidth,imgWidth,imgHeight)/dpcm)/(imgHeight/imgWidth)
    const value = Math.ceil(dist)-dist
    if(imgWidth>imgHeight){
      return value>0.75
    }
    else{
      return value>0.15
    }
    // if(printWidth>printHeight){
    //   return ratioW >= 0.6 && ratioH>=0.4;
    // }
    // else{
    //   return ratioW >= 0.4 && ratioH>=0.6;
    // }
  }

  const computeMinSize = (printWidth, printHeight, dpcm) => {
    return [
      Math.ceil((0.4 * printWidth * dpcm)/38),
      Math.ceil((0.6 * printHeight * dpcm)/38),
    ];
  }

  return (
    <div className="product-details space-mb-mobile-only--50">
      <Card className="single-my-account space-mb--10">
        <Card.Header className="panel-heading">
          <h4 className="panel-title">Upload your image (optional)</h4>
        </Card.Header>
        <Card.Body>
          <div className="product-content__upload">
            <ImageUploading
              onChange={onChange}
              value={images}
              dataURLKey="data_url"
              maxNumber={maxNumber}
              multiple={false}
              resolutionType="absolute"
            >
              {({ imageList, onImageUpload, isDragging, dragProps }) =>
                imageList && imageList.length > 0 ? (
                  <div className="product-small-image-wrapper" {...dragProps}>
                    {imageList.map((image) => (
                      <div
                        className="product-small-image-wrapper--upload mx-auto"
                        key={image.data_url}
                      >
                        <img
                          className="img-fluid"
                          key={1}
                          src={image.data_url}
                          ref={imgEl}
                          onLoad={handleSize}
                        />
                      </div>
                    ))}
                    <button onClick={clearImage}>
                      <IoMdCloseCircle />
                    </button>
                  </div>
                ) : (
                  <div className="space-mt--30 space-mb--30" {...dragProps}>
                    <div className="space-mb--10">
                      <button
                        className="lezada-button lezada-button--small lezada-button--icon--left"
                        style={
                          isDragging
                            ? {
                                color: "black",
                                border: "1px solid black",
                                backgroundColor: "white",
                              }
                            : {
                                color: "white",
                                border: "1px solid black",
                                backgroundColor: "black",
                              }
                        }
                        onClick={onImageUpload}
                      >
                        <MdFileUpload /> Choose a file to upload
                      </button>
                    </div>
                    <span>Or drag & drop your image here</span>
                    <br/>
                    <span>Max. file size: 40mb</span>
                  </div>
                )
              }
            </ImageUploading>
          </div>
          {images.length > 0 ? (
            <div className="product-options space-mt--30">
              <Row>
                <Col md={6} xs={6} className="product-options__option-name">
                  <span>Maximum Photo Size</span>
                </Col>
                <Col md={5} xs={5}>
                  {
                    requiredQuality && requiredQuality.length>1 && (<span>{`${requiredQuality[0]} x ${requiredQuality[1]} cm`}</span>)
                  }
                </Col>
                <Col md={1} xs={1} className="product-options__more-info">
                  <Tooltip
                    position="bottom"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={false}
                    duration={200}
                    html={
                      <p>
                        Maximum size of image in cm for the desired width
                        and height
                      </p>
                    }
                  >
                    <MdInfoOutline />
                  </Tooltip>
                </Col>
              </Row>
              <Row>
                <Col md={11} xs={11} className="product-options__option-name">
                  {photoQuality ? (
                    <span>
                      <span className="success-message">
                        <AiOutlineCheckCircle />
                      </span>{" "}
                      Photo Quality:{" "}
                      <span className="success-message">
                        <b>Great!</b>
                      </span>
                    </span>
                  ) : (
                    <span>
                      <span className="error-message">
                        <AiOutlineWarning />
                      </span>{" "}
                      Photo Quality:{" "}
                      <span className="error-message">
                        <b>Poor</b>
                      </span>
                    </span>
                  )}
                </Col>
                <Col md={1} xs={1} className="product-options__more-info">
                  <Tooltip
                    position="bottom"
                    trigger="mouseenter"
                    animation="shift"
                    arrow={false}
                    duration={200}
                    html={
                      <p>
                        This indicates the quality of the image when printed at
                        the specified width and height
                      </p>
                    }
                  >
                    <MdInfoOutline />
                  </Tooltip>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default UploadZone

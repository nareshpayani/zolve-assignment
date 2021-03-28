import React,{useCallback,useEffect, useState, useRef} from 'react'
import { Paper,Button } from "@material-ui/core";
import '../App.css'
import Webcam from "react-webcam";
import Slider from '@material-ui/core/Slider'
import Cropper from 'react-easy-crop'
import cropImage from '../utils/cropImage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../components/Footer';

function Selfie() {
    const [dimensions, setDimensions] = useState({ 
        height: window.innerHeight,
        width: window.innerWidth
    })
    const [imgSrc, setImgSrc] = useState(null)
    const [mode, setMode] = useState("selfie")
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [initialCroppedAreaPixels, setInitialCroppedAreaPixels] = useState(undefined)
    const [croppedImage, setCroppedImage] = useState(null)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [zoom, setZoom] = useState(1)
    const [permission, setPermission] = useState(true)
    
    useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })    
        }
        window.addEventListener('resize', handleResize)
    })


    const webcamRef = useRef(null);  
    const capture = useCallback(
        () => {
            setMode("crop")
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc)
        },
        [webcamRef]
    );
    
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        // console.log(croppedArea, croppedAreaPixels)
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handelCrop = async () => {
        try {
            const croppedImage = await cropImage(
              imgSrc,
              croppedAreaPixels,
            )
            setCroppedImage(croppedImage)
            setMode("cropped")
            
          } catch (e) {
            console.error(e)
        }
    }

    const handleUpload = () => {
        
        // upload to server
        // axios.post().then()
        handleRetake()
        toast("Image Uploaded!")
    }

    const handleRetake = () =>{
        setMode("selfie")
        setCroppedImage(null)
        setImgSrc(null)
        setCroppedAreaPixels(null)
    }

    const onError = (props) =>{
        toast.error("Camera permission is denied, Plese allow it from broser setting to take selfie.",
        {
            autoClose: 5000,
        })
        setPermission(false)
    }
    
    const videoConstraints = {
        width : dimensions.width*0.7,
        height : dimensions.height*0.7,
        facingMode: "user"
    };

    return (
        <>
            <Paper className="paper">
                {
                    !permission?<h1>camera permission denied..</h1>:''
                }
                {
                    mode === "selfie"?
                        <Webcam
                            audio={false}
                            height={dimensions.height*0.7}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={dimensions.width*0.7}
                            videoConstraints={videoConstraints}
                            mirrored={true}
                            onUserMediaError={onError}
                        /> 
                    : ""
                }
                {  
                    mode === "crop"?
                        <>
                            <div className="crop-container">
                                <Cropper
                                    image={imgSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    initialCroppedAreaPixels={initialCroppedAreaPixels}
                                />
                            </div>
                            <div className="controls">
                                <Slider
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e, zoom) => setZoom(zoom)}
                                    classes={{ container: 'slider' }}
                                />
                                <>
                                    <Button variant="contained" color="primary" style={{marginLeft:'10px'}} onClick={()=>handleRetake()}>Retake</Button>
                                    <Button variant="contained" color="primary" style={{marginLeft:'10px'}} onClick={()=>handelCrop()}>Crop</Button>
                                </>
                            </div>
                        </> : ""
                }
                {
                    mode === "cropped" ? 
                        <>
                            <img src={croppedImage} /> 
                            <div>
                                <Button variant="contained" color="primary" style={{marginLeft:'10px'}} onClick={()=>handleUpload()}>Upload</Button>
                            </div>
                        </> : ""
                }
                <div className="selfie-controlls">
                    {
                        mode === "selfie" ? <Button disabled={!permission} variant="contained" color="primary"onClick={capture}>Take Selfie</Button> : ""
                    }
                </div>
                <ToastContainer  autoClose={2000} />
            </Paper>
            {
            mode === "crop"? "" :  <Footer/>
            }
        </>
    );
}
  
export default Selfie;
  
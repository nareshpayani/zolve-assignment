import {TextField, Paper } from "@material-ui/core";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import { useLocation } from "react-router-dom";
import { useState } from "react";
import '../App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../components/Footer";

function Clipboard() {
    const location = useLocation()
    const [input, setInput] = useState(location.search.substring(3))
    
    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if(input.length>0)
            toast("Text copied successully!")
    };

    return (
        <>
        <Paper className="paper">
            <div >
                <TextField 
                    style={{marginTop:'10px'}} variant="outlined" 
                    inputProps={{style:{padding: "7px 5px"}}}
                    value={input}
                    onChange={(event)=>setInput(event.target.value)}
                    />
                <IconButton 
                    onClick={()=>copyToClipboard(input)} style={{marginLeft:'10px'}} 
                    variant="outlined" color="primary">
                    <FileCopyIcon />
                    <p style={{fontSize:'12px', marginLeft:'7px'}}>Copy to clipboard</p>
                </IconButton>
            </div>
            <div >
                <p style={{fontSize:'22px', marginLeft:'7px'}}>Paste here for test</p>
                <TextField
                    id="outlined-multiline-static"
                    label="Paste here"
                    multiline
                    inputProps={{style:{padding: "7px 5px", width:'100%'}}}
                    rows={4}
                    style={{marginBottom:'10px'}}
                    placeholder="Paste here..."
                    variant="outlined"
                />
            </div>
            <ToastContainer autoClose={5000} />
        </Paper>
        <Footer/>
        </>
    );
}

export default Clipboard;
  
import React, { useState, useEffect } from "react";
import "../styles.css";
import TextField from '@material-ui/core/TextField';
import Dropzone from "react-dropzone";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import axios from "axios";
import ReactPlayer from 'react-player'

export default function DropFile() {
  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const [show , setShow] = useState(false);
  const [fileExtension, setFileExtension] = useState("");
  const [filename, setfilename] = useState("");

  useEffect(() => {
    let file = window.localStorage.getItem('filename')
    setShow(window.localStorage.getItem('show'))
    setfilename(file);
    setFileExtension(file.split('.').pop());
  }, []);


  const handleDrop = acceptedFiles => {
    setfilename("")
    let file = acceptedFiles
    const data = new FormData();
    data.append("file", file[0]);

    console.log(acceptedFiles)

    axios.post("http://localhost:5000/uploader", data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      console.log(res)
      setfilename(res.data.filename)
      setShow(true);
      window.localStorage.setItem('show', true);
    })
  }



  function uploadClickhandler(e){
    e.preventDefault();
    // setfilename("")
    window.localStorage.setItem('filename', file.name);
    const data = new FormData();
    data.append("file", file);

    axios.post("http://localhost:5000/uploader", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(res => {
      console.log(res)
      setfilename(res.data.filename)
      setShow(true);
      window.localStorage.setItem('show', true);
    })
  }

  

  function urlhandler(e){

    const data = new FormData();
    data.append("url", url);
    
    axios.post("http://localhost:5000/url", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(res => {
      console.log(res)
      setfilename(res.data.filename)
      setShow(true);
      window.localStorage.setItem('show', true);
    })
    // setShow(true)

    const newString = url.slice(24,43)
    const urlFilename = newString.replace(/[?=]/g, "_");
    window.localStorage.setItem('filename', urlFilename + ".mp4");
    e.preventDefault()
  }

    
  const onChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onChangeText = (e) => {
    setUrl(e.target.value)
    console.log(e.target.value)
  }
      
    
  return (
    <div className="App">
        <h1>Object detection</h1>
        <Grid container spacing={5}>
            <Grid item xs={6}>
                <Dropzone onDrop={handleDrop}>
                    {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: "dropzone" })}>
                        <input {...getInputProps()} />
                        <p>Drag'n'drop files, or click to select files</p>
                    </div>
                    )}
                </Dropzone>
                <form onSubmit={uploadClickhandler}>
                  <label htmlFor="file">Choose image</label>
                  <input type="file" name={file} onChange={onChangeFile} />
                  <button variant="contained" color="secondary">
                      add
                  </button>
                </form>
                {/* <button onclic></button> */}
                <p>- OR -</p>
                <form noValidate autoComplete="off" style={{ display: "flex", alignItems: "center" }}> 
                  <TextField id="standard-basic" label="Insert url" onChange={onChangeText} value={url} name={url}/>
                  <Button variant="contained" color="secondary" onClick={urlhandler}>
                      Go
                  </Button>
                </form>
            </Grid>
            <Grid item xs={6}>
            {show ? 
              fileExtension === "mp4"? 
              <ReactPlayer
                playing={false}
                key = {`/runs/exp/${filename}`}
                url={`/runs/exp/${filename}`}
                width='100%'
                height='100%'
                controls = {true}
              />
              : <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
                  <img src={`/runs/exp/${filename}`} alt="result" width="50%"></img>
              </div>
              : null
            }
            </Grid>
        </Grid> 
    </div>
  );
}
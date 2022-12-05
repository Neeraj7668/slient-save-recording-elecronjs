import React, { useEffect, useState } from "react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import song from "../Recording/audio.mp3";
const { ipcRenderer } = window.require("electron");
// const fs = window.require("fs");
const AudioRecording = () => {
  const [fileList, setFileList] = useState([]);

  const [dir, setDir] = useState(null);

  const [audioDetails, setAudioDetails] = useState({
    url: null,
    blob: null,
    chunks: null,
    duration: {
      h: 0,
      m: 0,
      s: 0,
    },
  });

  useEffect(() => {
    ipcRenderer.send("song-list");
    ipcRenderer.on("song-list", (e, arg) => {
      const taskSaved = JSON.parse(arg);
      console.log("song list", taskSaved);
      setDir(taskSaved.dir);
      setFileList(taskSaved.temp);
    });
  }, []);

  const handleAudioStop = (data) => {
    console.log(data, "stop");
    setAudioDetails(data);
  };

  const handleAudioUpload = (file) => {
    console.log(file, audioDetails);

    var reader = new FileReader();
    reader.readAsDataURL(audioDetails.blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      // console.log(base64data);

      ipcRenderer.send("save-recordings", base64data);
    };
    // let blob = new Blob(chunks, { type: "audio/mp3;" });

    // var superBuffer = new Blob(file, { type: "video/webm" });

    // chunks = [];
    // let audioURL = window.URL.createObjectURL(blob);
    // audio.src = audioURL;
    // var data = new FormData();
    // var request = new XMLHttpRequest();
    // data.append("file", blob);
    // request.open("post", "/upload");
    // request.send(data);
    // console.log("File sent");
  };

  const handleCountDown = (data) => {
    console.log(data);
  };

  const handleReset = () => {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    };
    setAudioDetails(reset);
  };

  console.log(window.location.origin + "/Recording/beats.mp3", "song");

  return (
    <div>
      {fileList?.map((item, index) => (
        <audio key={index} controls>
          <source src={song} type="audio/mp3" />
        </audio>
      ))}

      <Recorder
        record={true}
        title={"New recording"}
        audioURL={audioDetails.url}
        showUIAudio
        handleAudioStop={(data) => handleAudioStop(data)}
        handleAudioUpload={(data) => handleAudioUpload(data)}
        handleCountDown={(data) => handleCountDown(data)}
        handleReset={() => handleReset()}
        mimeTypeToUseWhenRecording={`audio/webm`} // For specific mimetype.
      />
    </div>
  );
};

export default AudioRecording;

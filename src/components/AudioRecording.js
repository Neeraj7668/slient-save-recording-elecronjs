import React, { useEffect, useState } from "react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
const { ipcRenderer } = window.require("electron");

const AudioRecording = () => {
  const [fileList, setFileList] = useState([]);

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

  const [dir, setDir] = useState("");

  const handleAudioStop = (data) => {
    console.log(data, "stop");
    setAudioDetails(data);
  };

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleCountDown = (data) => {
    // console.log(data);
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

  useEffect(() => {
    ipcRenderer.send("song-list");
    ipcRenderer.on("song-list", (e, arg) => {
      const taskSaved = JSON.parse(arg);
      console.log(taskSaved, "taskSaved");
      setDir(taskSaved.newFolder);
      setFileList(taskSaved.temp);
    });
  }, []);

  const handleAudioUpload = () => {
    var reader = new FileReader();
    reader.readAsDataURL(audioDetails.blob);
    reader.onloadend = function () {
      var base64data = reader.result;
      // console.log(base64data);
      let data = {
        buffer: base64data,
        name: makeid(7),
      };

      ipcRenderer.send("save-recordings", data);

      ipcRenderer.send("save-recordings-status");
      ipcRenderer.on("save-recordings-status", (e, arg) => {
        const taskSaved = JSON.parse(arg);
        console.log(taskSaved, "save-recordings-status");

        let arr = fileList.filter((item) => item.file !== audioDetails.url);

        arr.push({ file: audioDetails.url, isNew: true });

        setFileList(arr);
        handleReset();
      });
    };
  };

  return (
    <div>
      {fileList.map((item, index) => (
        <div key={index}>
          {item?.isNew ? (
            <>
              <audio controls>
                <source src={item.file} type="audio/mp3" />
              </audio>
              <p style={{ color: "green" }}>
                New Record Song:{item?.isNew && "New"}
              </p>
            </>
          ) : (
            <>
              <audio controls>
                <source
                  src={
                    process.env.NODE_ENV === "production"
                      ? `${dir}/${item}`
                      : "Recording/" + item.file
                  }
                  type="audio/mp3"
                />
              </audio>
              <p style={{ color: "red" }}>
                New Record Song:{!item?.isNew && "Old"}
              </p>
            </>
          )}
        </div>
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

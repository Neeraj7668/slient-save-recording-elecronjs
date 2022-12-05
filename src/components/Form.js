import React, { useState, useEffect } from "react";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import ReadData from "./ReadData";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { FormControl, Input, InputLabel } from '@mui/material';
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const { ipcRenderer } = window.require('electron')


const Form = () => {
    const [taskList, setTaskList] = useState([])
    const [msg, setMsg] = useState(false);
    const [alertType, setAlertType] = useState(false);
    const [editAction, setEditAction] = useState(false);
    const [_id, setId] = useState(null);

    const [addFormData, setAddFormData] = useState({
        title: "", description: ""
    });

    const handleForm = (e) => {
        const { name, value } = e.target
        const data = { ...addFormData }
        data[name] = value;
        setAddFormData(data);
    }

    const [open, setOpen] = React.useState(false);

    const handleReset = () => {
        setAddFormData({
            name: "",
            description: ""
        })
    }

    const handleEditFormChange = (data) => {
        setAddFormData({
            name: data?.name,
            description: data?.description
        })
        setId(data?._id)
        setEditAction(true)
    };





    const handleAddFormSubmit = () => {
        if (!addFormData.name || !addFormData.description) {
            setMsg("All fields are required")
            setAlertType(true)
            setOpen(true)
            return false;
        }

        if (editAction) {
            addFormData["_id"] = _id
            ipcRenderer.send("update-task", addFormData)
        } else {

            ipcRenderer.send("new-task", addFormData);
        }
        handleReset()
        ipcRenderer.send("get-tasks");
    };

    const handleDeleteClick = (detailId) => {
        const newDetails = [...taskList];
        const index = taskList.findIndex((detail) => detail?._id === detailId);
        newDetails.splice(index, 1);
        setTaskList(newDetails);
        ipcRenderer.send("delete-task", detailId)
    };

    useEffect(() => {
        ipcRenderer.send("get-tasks");
        ipcRenderer.on("get-tasks", (e, arg) => {
            const taskSaved = JSON.parse(arg);
            setTaskList(taskSaved);
        })
        ipcRenderer.on("delete-task-success", (e, arg) => {
            if (arg) {
                setMsg("task deleted successfully")
                setAlertType(false)
                setOpen(true)
                return false
            }
        })
        ipcRenderer.on("new-task-created", (e, arg) => {
            if (arg) {
                setMsg("New Task has been created successfully")
                setAlertType(false)
                setOpen(true)
                return false
            }
        })
        ipcRenderer.on("update-task-success", (e, arg) => {
            if (arg) {
                setMsg("Task has been updated successfully")
                setAlertType(false)
                setOpen(true)
                setEditAction(false)
                return false
            }
        })
    }, [])
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    return (
        <div className="app-container">
            <div className="m-2">

                <h5>Add Task</h5>

                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 0, width: '20ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >

                    <TextField
                        id="outlined-uncontrolled1"
                        label="Name"
                        value={addFormData.name || ""}
                        name="name"
                        onChange={handleForm}
                    />
                    <TextField
                        id="outlined-uncontrolled2"
                        label="Description"
                        value={addFormData.description || ""}

                        name="description"
                        onChange={handleForm}

                    />

                    <Button variant="contained" startIcon={editAction ? <ModeEditOutlineIcon /> : <AddCircleIcon />} onClick={() => handleAddFormSubmit()}>
                        {editAction ? "Edit" : "Add"}
                    </Button>

                </Box>
            </div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={alertType ? "error" : "success"} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {taskList.map((detail, index) => (
                        <ReadData key={index}
                            handleEditFormChange={handleEditFormChange}
                            detail={detail}
                            handleDeleteClick={handleDeleteClick}
                        />

                    ))}
                </tbody>
            </table>



        </div>
    );
};


export default Form
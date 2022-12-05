import React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
const ReadData = ({ handleEditFormChange, detail, handleDeleteClick }) => {
    return (
        <>
            <tr>
                <td>{detail?.name}</td>
                <td>{detail?.description}</td>
                <td>
                    <Button
                        variant="contained"
                        className="mr-5"
                        style={{ marginRight: "10px" }}
                        startIcon={<ModeEditOutlineIcon />}
                        onClick={() => handleEditFormChange(detail)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        className="ml-5"
                        color="warning"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(detail?._id)}
                    >
                        Delete
                    </Button>
                </td>
            </tr>
        </>
    );
};

export default ReadData;

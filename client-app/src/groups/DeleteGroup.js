import { React, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import './DeleteForm.css';
import config from '../config.js';
import axios from 'axios';

/*
this method is used to create a request to the server in order to
delete a group
*/
const delete_group = async function(group_id) {
    var url = config.HOST + '/groups/' + group_id;

    return axios
        .delete(url)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw error;
        });
}

export default function DeleteContact(props) {
    const [open, setOpen] = [props.open, props.setOpen];

    const handleYesButton = () => {
        if (null != props.selectedRow)
            delete_group(props.selectedRow.id)
                .then((response) => {
                    const statusCode = response.status;
                    console.log(statusCode);
                    toast.success(response.data.message, { autoClose: 750, });
                    props.doRefreshPage();
                })
                .catch((error) => {
                    // toast.error('Error while deleting the contact.');
                    toast.error(error.response.data.message, { autoClose: 750, });
                });
            
        setOpen(false);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <ToastContainer/>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete group</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the group? You cannot delete a group if there are members in it.
                    </DialogContentText>
                </DialogContent>
                <Divider/>
                <div className="delete-action-container">
                    <div className="delete-action-left">
                        <Tooltip title="Yes">
                            <IconButton onClick={handleYesButton}>    
                                <ThumbUpAltIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div className="delete-action-right">
                        <Tooltip title="No">
                            <IconButton onClick={handleClose}>    
                                <ThumbDownIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </Dialog>
        </div>
    ); 
}
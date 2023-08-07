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
remove a contact from a group
*/
const delete_contact_from_group = async function(contactId, groupId) {
    const url = config.HOST + '/contacts/' + contactId + '/groups/' + groupId;

    return axios
        .delete(url)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw error;
        });
}

export default function DeleteGroupMember(props) {
    const [open, setOpen] = [props.open, props.setOpen];

    const handleYesButton = () => {
        if (null != props.selectedGroup && null != props.selectedRow)
            console.log(props.selectedRow.id, props.selectedGroup.id);
            delete_contact_from_group(props.selectedRow.id, props.selectedGroup.id)
                .then((response) => {
                    const statusCode = response.status;
                    console.log(statusCode);
                    toast.success(response.data.message, { autoClose: 750, });
                    props.setRequireRefresh(true);
                    props.refreshSelectedRow();
                })
                .catch((error) => {
                    toast.error('Error while exiting the group.', { autoClose: 750, });
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
                <DialogTitle>Remove contact</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove the contact from the group?
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
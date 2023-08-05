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

const delete_contact = async function(contact_id) {
    var url = config.HOST + '/contacts/' + contact_id;

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
            delete_contact(props.selectedRow.id)
                .then((response) => {
                    const statusCode = response.status;
                    console.log(statusCode);
                    toast.success(response.data.message);
                    props.doRefreshPage();
                })
                .catch((error) => {
                    toast.error('Error while deleting the contact.');
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
                <DialogTitle>Delete contact</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the contact? Deleting the contact will delete all the phone numbers.
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
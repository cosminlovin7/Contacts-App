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

const delete_phone_number = async function(phone_number_id) {
    var url = config.HOST + '/phone_numbers/' + phone_number_id;

    return axios
        .delete(url)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw error;
        });
}

export default function DeletePhoneNumber(props) {
    const [open, setOpen] = [props.open, props.setOpen];

    const handleYesButton = () => {
        if (null != props.selectedContact)
            delete_phone_number(props.selectedContact.id)
                .then((response) => {
                    const statusCode = response.status;
                    console.log(statusCode);
                    toast.success(response.data.message);
                    props.setRequireRefresh(true);
                    props.refreshSelectedRow();
                })
                .catch((error) => {
                    toast.error('Error while inserting new contact.');
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
                        Are you sure you want to delete the phone number?
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
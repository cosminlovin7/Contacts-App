import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config.js';
import axios from 'axios';

/*
this method is used to create a request to the server in order to
insert a new phone number
*/
const insert_phone_number = async function(contactId, phoneNumber) {
    const url = config.HOST + '/contacts/' + contactId + '/phone_numbers';

    const body = {
        phoneNumber: phoneNumber
    }

    return axios
        .post(url, body)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw error;
        });
}

export default function AddContactToGroup(props) {
    const [open, setOpen] = [props.open, props.setOpen];
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    
    const containsOnlyDigits = (str) => /^\d*$/.test(str);
    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);

        if (!containsOnlyDigits(event.target.value) || event.target.value.length != 10) {
            setPhoneNumberError('Phone Number is not correct. The phone number must be 10 digits long.');
        } else {
            setPhoneNumberError('');
        }
    }

    const handleSaveButton = () => {
        if (phoneNumberError != '') {
            return;
        }

        const contactId = props.selectedRow != null ? props.selectedRow.id : null
        if (contactId == null) {
            return;
        }

        insert_phone_number(contactId, phoneNumber)
            .then((response) => {
                const statusCode = response.status;
                console.log(statusCode);
                toast.success(response.data.message, { autoClose: 750, });
                props.setRequireRefresh(true);
                props.refreshSelectedRow();
            })
            .catch((error) => {
                // toast.error('Error while inserting new contact.');
                toast.error(error.response.data.message, { autoClose: 750, });
            });
            
        setOpen(false);
    }

    const handleClose = () => {
        setPhoneNumber('');
        setPhoneNumberError('');
        setOpen(false);
    }

    return (
        <div>
            <ToastContainer/>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Add phone number</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Add a phone number to the contact.
                    </DialogContentText>
                    <br/>
                    <TextField
                        margin="dense" 
                        id="phoneNumber" 
                        label="Phone Number" 
                        fullWidth
                        value={phoneNumber}
                        type="tel"
                        onChange={handlePhoneNumberChange}
                        error={phoneNumberError != ''}
                        helperText={phoneNumberError}/>
                </DialogContent>
                <Divider/>
                <DialogActions>
                    <Button onClick={handleSaveButton}>Save</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
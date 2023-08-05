import { React, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddContact.css';
import config from '../config.js';
import axios from 'axios';

const insert_contact = async function(firstName, lastName, phoneNumber) {
    var url = config.HOST + '/contacts';
    const body = {
        firstName: firstName,
        lastName: lastName,
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

export default function AddContact(props) {
    const [open, setOpen] = [props.open, props.setOpen];
    const [firstName, setFirstName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
        console.log(event.target.value);

        if (event.target.value.length > 50) {
            setFirstNameError('First Name is too long. Max. characters allowed: 50.');
        } else {
            setFirstNameError('');
        }
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
        console.log(event.target.value);

        if (event.target.value.length > 50) {
            setLastNameError('Last Name is too long. Max. characters allowed: 50.');
        } else {
            setLastNameError('');
        }
    }

    const containsOnlyDigits = (str) => /^\d*$/.test(str);

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
        console.log(event.target.value);

        if (!containsOnlyDigits(event.target.value) || event.target.value.length != 10) {
            setPhoneNumberError('Phone Number is not correct. The phone number must be 10 digits long.');
        } else {
            setPhoneNumberError('');
        }
    }

    const handleSaveButton = () => {
        console.log('save button clicked ' + firstName + ' ' + lastName);
        if (firstNameError != '' || lastNameError != '' || phoneNumberError != '') {
            return;
        }
 
        insert_contact(firstName, lastName, phoneNumber)
            .then((response) => {
                const statusCode = response.status;
                console.log(statusCode);
                if (statusCode == 201) {
                    toast.success(response.data.message);
                    props.doRefreshPage();
                } else if (statusCode == 409) {
                    toast.warn(response.data.error);
                }
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
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Add Contact</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Add a new contact to the agend.
                    </DialogContentText>
                    <br/>
                    <TextField
                        margin="dense" 
                        id="firstName" 
                        label="First Name" 
                        type="text" 
                        fullWidth 
                        onChange={handleFirstNameChange}
                        error={firstNameError != ''}
                        helperText={firstNameError}/>
                    <TextField 
                        margin="dense" 
                        id="lastName" 
                        label="Last Name" 
                        type="text" 
                        fullWidth 
                        onChange={handleLastNameChange}
                        error={lastNameError != ''}
                        helperText={lastNameError}/>
                    <TextField 
                        margin="dense" 
                        id="phoneNumber" 
                        label="Phone Number" 
                        type="tel" 
                        fullWidth 
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
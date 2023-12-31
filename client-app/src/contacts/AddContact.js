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
import config from '../config.js';
import axios from 'axios';

/*
this method is used to send a request to the server in order to
insert a new contact
*/
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
        setFirstName(event.target.value.trim());
        console.log(event.target.value);

        if (event.target.value.length > 50) {
            setFirstNameError('First name is too long. Max. characters allowed: 50.');
        } else if (event.target.value.includes(" ")) {
            setFirstNameError('First name should not contain spaces.');
        } else {
            setFirstNameError('');
        }
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value.trim());
        console.log(event.target.value);

        if (event.target.value.length > 50) {
            setLastNameError('Last name is too long. Max. characters allowed: 50.');
        } else if (event.target.value.includes(" ")) {
            setLastNameError('Last name should not contain spaces.');
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
                toast.success(response.data.message, { autoClose: 750, });
                props.doRefreshPage();
            })
            .catch((error) => {
                // toast.error('Error while inserting new contact.');
                toast.error(error.response.data.message, { autoClose: 750, });
            });

        setOpen(false);
    }

    const handleClose = () => {
        setFirstName('');
        setFirstNameError('');
        setLastName('');
        setLastNameError('');
        setPhoneNumber('');
        setPhoneNumberError('');
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
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
this method is used to create a request to the server in order to
update an existing contact
*/
const update_contact = async function(id, firstName, lastName) {
    var url = config.HOST + '/contacts/' + id;
    const body = {
        firstName: firstName,
        lastName: lastName
    }

    return axios
        .put(url, body)
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

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value.trim());
        console.log(event.target.value);

        if (event.target.value.length > 50) {
            setFirstNameError('First Name is too long. Max. characters allowed: 50.');
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
            setLastNameError('Last Name is too long. Max. characters allowed: 50.');
        } else if (event.target.value.includes(" ")) {
            setLastNameError('Last name should not contain spaces.');
        }else {
            setLastNameError('');
        }
    }

    const handleSaveButton = () => {
        console.log('save button clicked ' + firstName + ' ' + lastName);
        if (firstNameError != '' || lastNameError != '') {
            return;
        }
 
        update_contact(props.selectedRow.id, firstName, lastName)
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
        setFirstName('');
        setFirstNameError('');
        setLastName('');
        setLastNameError('');
        setOpen(false);
    }

    return (
        <div>
            <ToastContainer/>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Edit contact</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Edit contact's properties.
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
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
insert a new operator
*/
const insert_operator = async function(name, prefix) {
    var url = config.HOST + '/operators';
    const body = {
        name: name,
        prefix: prefix
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

export default function AddOperator(props) {
    const [open, setOpen] = [props.open, props.setOpen];
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [prefix, setPrefix] = useState('');
    const [prefixError, setPrefixError] = useState('');

    const handleNameChange = (event) => {
        if (event.target.value.length > 50) {
            setNameError('Name is too long. Max. characters allowed: 50.');
        } else if (event.target.value.includes(" ")) {
            setNameError('Name should not contain spaces.');
        } else {
            setNameError('');
        }
        setName(event.target.value.trim());
    }

    const containsOnlyDigits = (str) => /^\d*$/.test(str);
    const handlePrefixChange = (event) => {
        if (!containsOnlyDigits(event.target.value) || event.target.value.length != 3) {
            setPrefixError('Prefix is not valid. It must be 3 digits long.');
        } else {
            setPrefixError('');
        }
        setPrefix(event.target.value);
    }

    const handleSaveButton = () => {
        if (nameError != '' || prefixError != '' || name.length == 0 || prefix.length == 0) {
            return;
        }

        insert_operator(name, prefix)
            .then((response) => {
                const statusCode = response.status;
                console.log(statusCode);
                toast.success(response.data.message, { autoClose: 750, });
                props.doRefreshPage();
            })
            .catch((error) => {
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
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Add Operator</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Add a new operator.
                    </DialogContentText>
                    <br/>
                    <TextField 
                        margin="dense" 
                        id="name" 
                        label="Name" 
                        type="text" 
                        fullWidth 
                        onChange={handleNameChange}
                        error={nameError != ''}
                        helperText={nameError}/>
                    <TextField 
                        margin="dense" 
                        id="prefix" 
                        label="Prefix" 
                        type="tel" 
                        fullWidth 
                        onChange={handlePrefixChange}
                        error={prefixError != ''}
                        helperText={prefixError}/>
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
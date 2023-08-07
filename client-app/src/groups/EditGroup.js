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
update a group
*/
const update_group = async function(id, name) {
    var url = config.HOST + '/groups/' + id;
    const body = {
        name: name
    }

    return axios
        .put(url, body)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

export default function EditGroup(props) {
    const [open, setOpen] = [props.open, props.setOpen];
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value.trim());
        console.log(event.target.value);

        if (event.target.value.length > 50) {
            setName('Name is too long. Max. characters allowed: 50.');
        } else if (event.target.value.includes(" ")) {
            setNameError('Name should not contain spaces.');
        } else {
            setNameError('');
        }
    }

    const handleSaveButton = () => {
        console.log('save button clicked ' + name);
        if (nameError != '') {
            return;
        }
 
        update_group(props.selectedRow.id, name)
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
        setName('');
        setNameError('');
        setOpen(false);
    }

    return (
        <div>
            <ToastContainer/>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Edit group</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Edit group's properties.
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
import { React, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import './AddOperator.js';

export default function AddOperator(props) {
    const [open, setOpen] = [props.open, props.setOpen];
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [prefix, setPrefix] = useState('');
    const [prefixError, setPrefixError] = useState('');

    const handleNameChange = (event) => {
        if (event.target.value.length > 50) {
            setNameError('Name is too long. Max. characters allowed: 50.');
        } else {
            setNameError('');
        }
        setName(event.target.value);
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
        if (nameError != '' || prefixError != '') {
            return;
        }

        setOpen(false);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
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
import { React, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import './AddGroup.css';

export default function AddGroup(props) {
    const [open, setOpen] = [props.open, props.setOpen];
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');

    const handleNameChange = (event) => {
        if (event.target.value.length > 50) {
            setNameError('Name is too long. Max. characters allowed: 50.');
        } else {
            setNameError('');
        }
        setName(event.target.value);
    }

    const handleSaveButton = () => {
        if (nameError != '') {
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
                <DialogTitle>Add Group</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Add a new group.
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
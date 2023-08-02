import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

function createData(name, size) {
    return { name, size };
}

const rows = [
    createData('Family', 2),
    createData('Friends', 1),
];

export default function AddContactToGroup(props) {
    const [open, setOpen] = [props.open, props.setOpen];
    const [group, setGroup] = useState('');
    
    const handleGroupChange = (event) => {
        setGroup(event.target.value);
    }

    const handleSaveButton = () => {
        console.log('selected group ' + group);
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Add to group</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Add a contact to a group.
                    </DialogContentText>
                    <br/>
                    <FormControl fullWidth>
                        <InputLabel id="group-select-label">Group</InputLabel>
                        <Select
                            labelId="group-select-label"
                            id="group-select"
                            value={group}
                            label="Group"
                            onChange={handleGroupChange}
                            >
                            {rows.map((row) => (
                                <MenuItem key={row.name} value={row.name}>{row.name}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
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
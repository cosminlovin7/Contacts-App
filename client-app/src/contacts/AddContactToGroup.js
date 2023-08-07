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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config.js';
import axios from 'axios';

/*
this method is used to send a request to the backend in order to 
create a relationship between a contact and a group
*/
const insert_contact_to_group = async function(contactId, groupId) {
    const url = config.HOST + '/contacts/' + contactId + '/groups';

    const body = {
        groupId: groupId
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
    const [group, setGroup] = useState('');
    const [groupError, setGroupError] = useState('');
    
    const handleGroupChange = (event) => {
        setGroup(event.target.value);
        setGroupError('');
    }

    const handleSaveButton = () => {
        console.log('selected group ' + group);
        console.log('selected row', props.selectedRow)
        if (props.selectedRow == null) {
            setOpen(false);
        }
        if ('' == group) {
            setGroupError('You must select a group.');
            return;
        }

        insert_contact_to_group(props.selectedRow.id, group)
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
        setGroup('');
        setGroupError('');
        setOpen(false);
    }

    return (
        <div>
            <ToastContainer/>
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
                            error={groupError != ''}
                            >
                            {null != props.groupsData ? (
                                props.groupsData.groups.map((group) => {
                                    return (
                                        <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                                    );
                                })
                            ) : ''}

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
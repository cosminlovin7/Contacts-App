import { React, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config.js';
import axios from 'axios';

/*
this method is used to create a request to the server in order to
update an existing operator
*/
const update_operator = async function(operator_id, operator_name, operator_prefix) {
    var url = config.HOST + '/operators/' + operator_id;
    const body = {
        name: operator_name,
        prefix: operator_prefix
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

export default function EditOperator(props) {
    const [open, setOpen] = [props.open, props.setOpen];
    const [openDeleteOperatorModal, setOpenDeleteOperatorModal] = useState(false);
    const [name, setName] = useState(props.selectedRow.name);
    const [nameError, setNameError] = useState('');
    const [prefix, setPrefix] = useState(props.selectedRow.prefix);
    const [prefixError, setPrefixError] = useState('');

    const handleNameChange = (event) => {
        if (event.target.value.length > 50) {
            setNameError('Name is too long. Max. characters allowed: 50.');
        } else if (event.target.value.includes(" ")) {
            setNameError('Name should not contain spaces.');
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
        console.log(name, prefix)

        update_operator(props.selectedRow.id, name, prefix)
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

    const handleDeleteButton = () => {
        setOpenDeleteOperatorModal(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleDialogClose = () => {
        props.setOpen(false);
    }

    const handleDialogExited = () => {
        props.handleDialogExited();
    }


    return (
        <div>
            <ToastContainer/>
            <Dialog 
                open={open}
                onClose={handleDialogClose}
                onTransitionExited={handleDialogExited}
                fullWidth>
                <DialogTitle>Edit operator</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        Edit the properties of the operator.
                    </DialogContentText>
                    <br/>
                    <TextField 
                        margin="dense" 
                        id="name" 
                        label="Name" 
                        type="text" 
                        fullWidth 
                        value={name}
                        onChange={handleNameChange}
                        error={nameError != ''}
                        helperText={nameError}/>
                    <TextField 
                        margin="dense" 
                        id="prefix" 
                        label="Prefix" 
                        type="tel" 
                        fullWidth 
                        value={prefix}
                        onChange={handlePrefixChange}
                        error={prefixError != ''}
                        helperText={prefixError}/>
                </DialogContent>
                <Divider/>
                <DialogActions>
                    <Tooltip title="Save changes">
                        <IconButton onClick={handleSaveButton}>
                            <SaveIcon/>
                        </IconButton>
                    </Tooltip>
                </DialogActions>
            </Dialog>
        </div>
    );
}
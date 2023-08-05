import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar.js';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import AddGroup from './AddGroup.js';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/DefaultPage.css';
import config from '../config.js';
import axios from 'axios';

const fetchGroups = async function() {
    return axios
        .get(config.HOST + '/groups')
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
};

const table_row_styles = {
    background: 'rgb(0,174,191)',
    background: '-moz-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: '-webkit-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: 'linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#00aebf",endColorstr="#00ffab",GradientType=1)'
}

export default function Groups() {
    const [openModal, setOpenModal] = useState(false);
    const [openGroupDetails, setOpenGroupDetails] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [requireRefresh, setRequireRefresh] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [groupsData, setGroupsData] = useState(null);

    function doRefreshPage() {
        setOpenModal(false);
        setOpenGroupDetails(false);
        setRefreshPage(!refreshPage);
        setRequireRefresh(false);
        setSelectedRow(null);
        setGroupsData(null);
    }

    useEffect(() => {
        fetchGroups()
            .then((data) => {
                console.log('Data fetched successfully:', data);
                toast.success('Groups loaded successfully.');
                setGroupsData(data);
            })
            .catch((error) => {
                console.error('Error while fetching the groups:', error);
                toast.error('Error while loading data.');
            })
    }, [refreshPage]);

    const handleAddGroup = () => {
        setOpenModal(true);
    }

    function handleRowClick(row) {
        console.log(row);
        setSelectedRow(row);
        setOpenGroupDetails(true);
    }

    function handleDialogClose() {
        setOpenGroupDetails(false);
    }

    function handleDialogExited() {
        setSelectedRow(null);
        if (requireRefresh) {
            doRefreshPage()
        }
    }

    return (
        <div className = "container">
            <ToastContainer/>
            <div className = "menu-bar">
                <MenuBar value={1}/>
            </div>
            <div className = "panel">
                <div className = "tool-bar">
                    <div className = "button">
                        <Tooltip title="Add new group">
                            <IconButton onClick={handleAddGroup}>    
                                <AddCircleIcon/>
                            </IconButton>
                        </Tooltip>
                        <AddGroup open={openModal} setOpen={setOpenModal} doRefreshPage={doRefreshPage}/>
                    </div>
                </div>
                <div className = "content">
                    <TableContainer component={Card}>
                        <Table sx={{ minWidth: 475 }}>
                            <TableHead>
                                <TableRow style={table_row_styles}>
                                    <TableCell >Name</TableCell>
                                    <TableCell align="right">Size</TableCell>
                                </TableRow>
                            </TableHead>
                            {null != groupsData ? (<TableBody>
                                {groupsData.groups.map((group) => (
                                    <TableRow sx={{ cursor: 'pointer' }} hover key={group.id} onClick={() => handleRowClick(group)}>
                                        <TableCell >{group.name}</TableCell>
                                        <TableCell align="right">{group.size}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>) : <TableBody/>}
                        </Table>
                    </TableContainer>
                </div>
            </div>

            <Dialog
                open={openGroupDetails}
                onClose={handleDialogClose}
                onTransitionExited={handleDialogExited}
                fullWidth
            >
                <DialogTitle>{"Group Details"}</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        <b>Name:</b> {selectedRow != null ? selectedRow.name : 'Name not set'}
                    </DialogContentText>
                    <Accordion>
                        <AccordionSummary>
                            <b>Members</b>
                        </AccordionSummary>
                        {/* <AccordionDetails style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {selectedRow != null ? <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {selectedRow.phoneNumbers.map((phoneNumber, index) => (
                                    <li key={index}>
                                        {'' != phoneNumber.operatorName ? 
                                        (<div className="phone-number-container"><div className="ph-left">{phoneNumber.number}({phoneNumber.operatorName})</div><div className="ph-right"><Tooltip title="Remove phone number"><IconButton onClick={() => handleOnRemovePhoneNumber(phoneNumber)}><PhonelinkEraseIcon/></IconButton></Tooltip></div></div>) : 
                                        (<div className="phone-number-container"><div className="ph-left">{phoneNumber.number}</div><div className="ph-right"><Tooltip title="Remove phone number"><IconButton onClick={() => handleOnRemovePhoneNumber(phoneNumber)}><PhonelinkEraseIcon/></IconButton></Tooltip></div></div>)}
                                    </li>
                
                                ))}
                            </ul> : ''}
                        </AccordionDetails> */}
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    {/* <Tooltip title="Add to group">
                        <IconButton onClick={handleAddContactToGroup}>
                            <GroupAddIcon/>
                        </IconButton>
                    </Tooltip>
                    <AddContactToGroup open={openCTGModal} setOpen={setOpenCTGModal} setRequireRefresh={setRequireRefresh}/>
                    <Tooltip title="Add phone number">
                        <IconButton onClick={handleAddPhoneNumber}>
                            <AddIcCallIcon/>
                        </IconButton>
                    </Tooltip>
                    <AddPhoneNumber open={openAddPhoneModal} setOpen={setOpenAddPhoneModal} selectedRow={selectedRow} setRequireRefresh={setRequireRefresh} refreshSelectedRow={refreshSelectedRow}/>
                    <Tooltip title="Delete contact">
                        <IconButton onClick={handleDeleteContact}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                    <DeleteContact open={openDeleteContactModal} setOpen={setOpenDeleteContactModal} selectedRow={selectedRow} doRefreshPage={doRefreshPage}/> */}
                </DialogActions>
            </Dialog>
        </div>
    );
};
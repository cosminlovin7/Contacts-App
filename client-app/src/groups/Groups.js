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
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteGroupMember from './DeleteGroupMember.js';
import DeleteGroup from './DeleteGroup.js';
import EditIcon from '@mui/icons-material/Edit';
import EditGroup from './EditGroup.js';
import 'react-toastify/dist/ReactToastify.css';
import '../components/DefaultPage.css';
import './Groups.css';
import config from '../config.js';
import axios from 'axios';

/*
this method is used to create a request to the server in order to
get all the groups
*/
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

/*
this method is used to create a request to the server in order to
get a group based on its id
*/
const fetchGroup = async function(groupId) {
    return axios
        .get(config.HOST + '/groups/' + groupId)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

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
    const [openDeleteGroupMemberModal, setOpenDeleteGroupMemberModal] = useState(false);
    const [openDeleteGroupModal, setOpenDeleteGroupModal] = useState(false);
    const [openEditGroupModal, setOpenEditGroupModal] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [requireRefresh, setRequireRefresh] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [groupsData, setGroupsData] = useState(null);
    const [selectedContact, setSelectedContact ] = useState(null);

    function doRefreshPage() {
        setOpenModal(false);
        setOpenGroupDetails(false);
        setOpenDeleteGroupMemberModal(false);
        setOpenEditGroupModal(false);
        setRefreshPage(!refreshPage);
        setRequireRefresh(false);
        setSelectedRow(null);
        setGroupsData(null);
        setSelectedContact(null);
    }

    useEffect(() => {
        fetchGroups()
            .then((data) => {
                console.log('Data fetched successfully:', data);
                toast.success('Groups loaded successfully.', { autoClose: 750, });
                setGroupsData(data);
            })
            .catch((error) => {
                console.error('Error while fetching the groups:', error);
                toast.error('Error while loading data.', { autoClose: 750, });
            })
    }, [refreshPage]);

    const handleAddGroup = () => {
        setOpenModal(true);
    }

    function handleRowClick(row) {
        console.log(row);
        fetchGroup(row.id)
            .then((data) => {
                console.log(data.group);
                setSelectedRow(data.group);
            })
            .catch((error) => {
                console.error('Error while fetching the groups:', error);
            })

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

    const handleDeleteGroup = () => {
        console.log('delete group button pressed.');
        setOpenDeleteGroupModal(true);
    }

    const handleEditGroup = () => {
        setOpenEditGroupModal(true);
    }

    function handleOnRemoveMember(member) {
        console.log('remove from group button clicked', member, selectedRow);
        setSelectedContact(member);
        setOpenDeleteGroupMemberModal(true);
    }

    function refreshSelectedRow() {
        if (null != selectedRow)
            fetchGroup(selectedRow.id)
                .then((data) => {
                    console.log(data.group);
                    setSelectedRow(data.group);
                })
                .catch((error) => {
                    console.error('Error while fetching the groups:', error);
                })
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
                        <AccordionDetails style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {selectedRow != null ? <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {selectedRow.members.map((member, index) => (
                                    <li key={index}>
                                        <div className="member-container"><div className="m-left">{member.name}</div><div className="m-right"><Tooltip title="Remove phone number"><IconButton onClick={() => handleOnRemoveMember(member)}><PersonRemoveIcon/></IconButton></Tooltip></div></div>
                                    </li>
                
                                ))}
                            </ul> : ''}
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Tooltip title="Edit group">
                        <IconButton onClick={handleEditGroup}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <EditGroup open={openEditGroupModal} setOpen={setOpenEditGroupModal} selectedRow={selectedRow} setRequireRefresh={setRequireRefresh} refreshSelectedRow={refreshSelectedRow}/>
                    <Tooltip title="Delete group">
                        <IconButton onClick={handleDeleteGroup}>
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                    <DeleteGroup open={openDeleteGroupModal} setOpen={setOpenDeleteGroupModal} selectedRow={selectedRow} doRefreshPage={doRefreshPage}/>
                </DialogActions>
            </Dialog>
            <DeleteGroupMember open={openDeleteGroupMemberModal} setOpen={setOpenDeleteGroupMemberModal} selectedRow={selectedContact} selectedGroup={selectedRow} setRequireRefresh={setRequireRefresh} refreshSelectedRow={refreshSelectedRow}/>
        </div>
    );
};
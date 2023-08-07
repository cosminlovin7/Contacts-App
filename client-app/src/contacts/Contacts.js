import { React, useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar.js';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import AddContact from './AddContact.js';
import AddContactToGroup from './AddContactToGroup.js';
import AddPhoneNumber from './AddPhoneNumber.js';
import DeleteContact from './DeleteContact.js';
import DeletePhoneNumber from './DeletePhoneNumber.js';
import DeleteGroupMember from './DeleteGroupMember.js';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Tooltip from '@mui/material/Tooltip';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import AddIcCallIcon from '@mui/icons-material/AddIcCall';
import { ToastContainer, toast } from 'react-toastify';
import PhonelinkEraseIcon from '@mui/icons-material/PhonelinkErase';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import EditIcon from '@mui/icons-material/Edit';
import EditContact from './EditContact.js';
import 'react-toastify/dist/ReactToastify.css';
import '../components/DefaultPage.css';
import './Contacts.css'
import config from '../config.js';
import axios from 'axios';

const table_row_styles = {
    background: 'rgb(0,174,191)',
    background: '-moz-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: '-webkit-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: 'linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#00aebf",endColorstr="#00ffab",GradientType=1)'
};

/*
this method is used to create a request to the server in order to
get all the contacts in the database
*/
const fetchContacts = async function() {
    return axios
        .get(config.HOST + '/contacts')
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
};

/*
this method is used to create a request to the server in order to
get a page of filtered contacts based on some parameters
*/
const fetchContactsFiltered = async function(page, filterName, filterPhoneNumber, filterGroup, filterOperator) {
    var url = config.HOST + '/contacts/page/' + page + '/filter?';
    if ('' != filterName)
        url += 'name=' + filterName;
    if ('' != filterPhoneNumber)
        url += '&phone_number=' + filterPhoneNumber;
    if ('' != filterGroup)
        url += '&group_id=' + filterGroup;
    if ('' != filterOperator)
        url += '&mobile_network_operator=' + filterOperator;

    return axios
        .get(url)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

/*
this method is used to create a request to the server in order to
get the total number of filtered contacts
*/
const fetchContactsFilteredCount = async function(filterName, filterPhoneNumber, filterGroup, filterOperator) {
    var url = config.HOST + '/contacts/count/filter?';
    if ('' != filterName) {
        console.log(filterName)
        url += 'name=' + filterName;
    }
    if ('' != filterPhoneNumber) {
        console.log(filterPhoneNumber)
        url += '&phone_number=' + filterPhoneNumber;
    }
    if ('' != filterGroup) {
        console.log(filterGroup)
        url += '&group_id=' + filterGroup;
    }
    if ('' != filterOperator) {
        console.log(filterOperator)
        url += '&mobile_network_operator=' + filterOperator;
    }

    return axios
        .get(url)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

/*
this method is used to create a request to the server in order to
get a contact based on its id
*/
const fetchContactById = async function(contact_id) {
    var url = config.HOST + '/contacts/' + contact_id;

    return axios
        .get(url)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

/*
this method is used to create a request to the server in order to
get all the groups created
*/
const fetchGroups = async function() {
    var url = config.HOST + '/groups';

    return axios
        .get(url)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export default function Contacts() {
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openCTGModal, setOpenCTGModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openAddPhoneModal, setOpenAddPhoneModal] = useState(false);
    const [openDeleteContactModal, setOpenDeleteContactModal] = useState(false);
    const [openDeletePhoneNumberModal, setOpenDeletePhoneNumberModal] = useState(false);
    const [openDeleteGroupMemberModal, setOpenDeleteGroupMemberModal] = useState(false);
    const [openEditContactModal, setOpenEditContactModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [filterName, setFilterName] = useState('');
    const [filterPhoneNumber, setFilterPhoneNumber] = useState('');
    const [filterGroup, setFilterGroup] = useState('');
    const [filterOperator, setFilterOperator] = useState('');
    const [filteredContactsData, setFilteredContactsData] = useState(null);
    const [filteredContactsCount, setFilteredContactsCount] = useState(0);
    const [contactsData, setContactsData] = useState(null);
    const [page, setPage] = useState(0);
    const [pageFiltered, setPageFiltered] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [requireRefresh, setRequireRefresh] = useState(false);
    const [groupsData, setGroupsData] = useState(null);
    
    function doRefreshPage() {
        setOpenProfileModal(false);
        setOpenCTGModal(false);
        setOpenModal(false);
        setOpenAddPhoneModal(false);
        setOpenDeleteContactModal(false);
        setOpenDeletePhoneNumberModal(false);
        setOpenDeleteGroupMemberModal(false);
        setOpenEditContactModal(false);
        setSelectedRow(null);
        setFilteredContactsData(null);
        setFilteredContactsCount(0);
        setPage(0);
        setFilterName('');
        setFilterPhoneNumber('');
        setFilterGroup('');
        setFilterOperator('');
        setPageFiltered(false);
        setRefreshPage(!refreshPage);
        setSelectedContact(null);
        setRequireRefresh(false);
        setGroupsData(null);
        setContactsData(null);
        setSelectedGroup(null);
    }

    useEffect(() => {
        if (pageFiltered) {
            fetchContactsFiltered(page, filterName, filterPhoneNumber, filterGroup, filterOperator)
                .then((data) => {
                    console.log('Data fetched successfully:', data);
                    toast.success('Filtered contacts loaded successfully.', { autoClose: 750, });
                    setFilteredContactsData(data);
                })
                .catch((error) => {
                    // toast.error('Error while loading filtered data.');
                    toast.error(error.response.data.message, { autoClose: 750, });
                })

            fetchContactsFilteredCount(filterName, filterPhoneNumber, filterGroup, filterOperator)
                .then((data) => {
                    console.log('Contacts count: ', data);
                    setFilteredContactsCount(data.contact);
                })
                .catch((error) => {
                    // toast.error('Error while fetching the contacts filtered count.');
                    toast.error(error.response.data.message, { autoClose: 750, });
                })
        }

    }, [page, pageFiltered, refreshPage]);

    useEffect(() => {
        fetchContacts()
            .then((data) => {
                console.log('Data fetched successfully:', data);
                toast.success('Contacts loaded successfully.', { autoClose: 750, });
                setContactsData(data);
            })
            .catch((error) => {
                // toast.error('Error while fetching the contacts.');
                toast.error(error.response.data.message, { autoClose: 750, });
            })

        fetchGroups()
            .then((data) => {
                console.log('Groups fetched: ', data);
                setGroupsData(data);
            })
            .catch((error) => {
                // toast.error('Error while fetching the groups.');
                toast.error(error.response.data.message, { autoClose: 750, });
            })
    }, [refreshPage])

    const handleAddContact = () => {
        setOpenModal(true);
    }

    const handleAddContactToGroup = () => {
        setOpenCTGModal(true);
    }

    const handleAddPhoneNumber = () => {
        setOpenAddPhoneModal(true);
    }

    const handleDeleteContact = () => {
        setOpenDeleteContactModal(true);
    }

    const handleEditContact = () => {
        setOpenEditContactModal(true);
    }

    function refreshSelectedRow() {
        if (null != selectedRow)
            fetchContactById(selectedRow.id)
                .then((data) => {
                    setSelectedRow(data.contact);
                })
                .catch((error) => {
                    // toast.error('Error while fetching the contact.');
                    toast.error(error.response.data.message, { autoClose: 750, });
                })
    }

    function handleRowClick(row) {
        console.log(row);
        fetchContactById(row.id)
            .then((data) => {
                setSelectedRow(data.contact);
            })
            .catch((error) => {
                toast.error(error.response.data.message, { autoClose: 750, });
            })

        setOpenProfileModal(true);
    }

    function handleDialogClose() {
        setOpenProfileModal(false);
    }

    function handleDialogExited() {
        setSelectedRow(null);
        console.log(filterGroup);
        if (requireRefresh) {
            doRefreshPage()
        }
    }

    const handleFilterNameChange = (event) => {
        setFilterName(event.target.value);
        console.log(event.target.value);
    }

    const handleFilterPhoneNumberChange = (event) => {
        setFilterPhoneNumber(event.target.value);
        console.log(event.target.value);
    }

    const handleFilterGroupChange = (event) => {
        setFilterGroup(event.target.value);
        console.log(event.target.value);
    }

    const handleFilterOperatorChange = (event) => {
        setFilterOperator(event.target.value);
    }

    const handleSearchFilter = () => {
        // doRefreshPage();

        setPage(0);
        setRefreshPage(!refreshPage);
        setPageFiltered(true);
    }

    const handleRefreshPage = () => {
        doRefreshPage();
    }

    const handleChangePage = (event, newPage) => {
        console.log('page changed');
        setPage(newPage);
        setFilteredContactsData(null);
    }

    function handleOnRemovePhoneNumber(phoneNumber) {
        console.log('remove phone number function called.', phoneNumber);
        setSelectedContact(phoneNumber);
        setOpenDeletePhoneNumberModal(true);
    }

    function handleOnRemoveGroup(group) {
        console.log ('remove from group function called', group);
        setSelectedGroup(group);
        setOpenDeleteGroupMemberModal(true);
    }

    return (
        <div className = "container">
            <ToastContainer/>
            <div className = "menu-bar">
                <MenuBar value={0}/>
            </div>
            <div className = "panel">
                <div className = "tool-bar">
                    <div className = "button left">
                        <Tooltip title="Add new contact">
                            <IconButton onClick={handleAddContact}>    
                                <AddCircleIcon/>
                            </IconButton>
                        </Tooltip>
                        <AddContact open={openModal} setOpen={setOpenModal} doRefreshPage={doRefreshPage}/>
                    </div>
                </div>
                <div className = "content" >
                    <Paper sx={{ minWidth: 475, overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 350 }}>
                        <Table >
                            <TableHead>
                                <TableRow style={table_row_styles}>
                                    <TableCell >Name</TableCell>
                                </TableRow>
                            </TableHead>
                            {null != contactsData ? (<TableBody>
                                {contactsData.contacts.map((contact, index) => {
                                    return (
                                    <TableRow sx={{ cursor: 'pointer' }} hover key={index} onClick={() => handleRowClick(contact)}>
                                        <TableCell >{contact.name}</TableCell>
                                    </TableRow>
                                    );
                                })}
                            </TableBody>) : <TableBody/>}
                        </Table>
                    </TableContainer>
                    </Paper>
                </div>

                <div className = "tool-bar">
                    <div className = "button left"></div>
                    <div className = "button right">
                        <TextField
                            margin="dense" 
                            id="operator" 
                            label="Operator" 
                            type="text"  
                            value={filterOperator}
                            sx={{ width: '150px', marginLeft: '2px', marginRight: '2px' }}
                            onChange={handleFilterOperatorChange}/>
                        <FormControl>
                            <InputLabel id="group-select-label">Group</InputLabel>
                            <Select
                                labelId="group-select-label"
                                id="group-select"
                                value={filterGroup}
                                label="Group"
                                sx={{ width: '150px', marginLeft: '2px', marginRight: '2px', marginBottom: '4px', marginTop: '8px' }}
                                onChange={handleFilterGroupChange}
                                >
                                    {null != groupsData ? (
                                        groupsData.groups.map((group, index) => {
                                            return (
                                                <MenuItem key={index} value={group.name}>{group.name}</MenuItem>
                                            );
                                        })
                                    ) : ''}
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense" 
                            id="name" 
                            label="Name" 
                            type="text"
                            value={filterName}  
                            sx={{ width: '75px', marginLeft: '2px', marginRight: '2px' }}
                            onChange={handleFilterNameChange}/>
                        <TextField
                            margin="dense" 
                            id="phoneNumber" 
                            label="Phone Number" 
                            value={filterPhoneNumber}
                            type="tel"  
                            sx={{ width: '150px', marginLeft: '2px', marginRight: '2px'}}
                            onChange={handleFilterPhoneNumberChange}/>
                        <Tooltip title="Search">
                            <IconButton onClick={handleSearchFilter}>    
                                <SearchIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Refresh page">
                            <IconButton onClick={handleRefreshPage}>    
                                <RestartAltIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className = "content">
                    <TableContainer component={Card}>
                        <Table style={{ tableLayout: 'fixed' }}>
                            <TableHead>
                                <TableRow style={table_row_styles}>
                                    <TableCell >Name</TableCell>
                                    <TableCell align="right">Group</TableCell>
                                    <TableCell align="right">Phone Number</TableCell>
                                    <TableCell align="right">Mobile Network Operator</TableCell>
                                </TableRow>
                            </TableHead>
                            {null != filteredContactsData && true == pageFiltered ? (<TableBody>
                                {filteredContactsData.contacts.map((contact, index) => {
                                    return (
                                    <TableRow sx={{ cursor: 'pointer' }} hover key={index} onClick={() => handleRowClick(contact)}>
                                        <TableCell >{contact.name}</TableCell>
                                        <TableCell align="right">{null != contact.group ? contact.group.name : 'N/A'}</TableCell>
                                        <TableCell align="right">{null != contact.phoneNumber ? contact.phoneNumber.number : 'N/A'}</TableCell>
                                        <TableCell align="right">{'' != contact.operatorName ? contact.operatorName : 'N/A'}</TableCell>
                                    </TableRow>
                                    );
                                })}
                            </TableBody>) : <TableBody/>}
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10]}
                        component="div"
                        count={filteredContactsCount}
                        rowsPerPage={10}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                </div>
            </div>

            <Dialog
                open={openProfileModal}
                onClose={handleDialogClose}
                onTransitionExited={handleDialogExited}
                fullWidth
            >
                <DialogTitle>{"Contact Profile"}</DialogTitle>
                <Divider/>
                <DialogContent>
                    <DialogContentText>
                        <b>Name:</b> {selectedRow != null ? selectedRow.name : 'Name not set'}
                    </DialogContentText>
                    <Accordion>
                        <AccordionSummary>
                            <b>Phone Numbers</b>
                        </AccordionSummary>
                        <AccordionDetails style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {selectedRow != null ? <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {selectedRow.phoneNumbers.map((phoneNumber, index) => (
                                    <li key={index}>
                                        {'' != phoneNumber.operatorName ? 
                                        (<div className="phone-number-container"><div className="ph-left">{phoneNumber.number}({phoneNumber.operatorName})</div><div className="ph-right"><Tooltip title="Remove phone number"><IconButton onClick={() => handleOnRemovePhoneNumber(phoneNumber)}><PhonelinkEraseIcon/></IconButton></Tooltip></div></div>) : 
                                        (<div className="phone-number-container"><div className="ph-left">{phoneNumber.number}</div><div className="ph-right"><Tooltip title="Remove phone number"><IconButton onClick={() => handleOnRemovePhoneNumber(phoneNumber)}><PhonelinkEraseIcon/></IconButton></Tooltip></div></div>)}
                                    </li>
                                ))}
                            </ul> : ''}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <b>Groups</b>
                        </AccordionSummary>
                        <AccordionDetails style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {selectedRow != null ? <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {selectedRow.groups.map((group, index) => (
                                    <li key={index}>
                                        <div className="group-container"><div className="g-left">{group.name}</div><div className="g-right"><Tooltip title="Remove from group"><IconButton onClick={() => handleOnRemoveGroup(group)}><GroupRemoveIcon/></IconButton></Tooltip></div></div>
                                    </li>
                                ))}
                            </ul> : ''}
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Tooltip title="Edit contact">
                        <IconButton onClick={handleEditContact}>
                            <EditIcon/>
                        </IconButton>
                    </Tooltip>
                    <EditContact open={openEditContactModal} setOpen={setOpenEditContactModal} selectedRow={selectedRow} setRequireRefresh={setRequireRefresh} refreshSelectedRow={refreshSelectedRow}/>
                    <Tooltip title="Add to group">
                        <IconButton onClick={handleAddContactToGroup}>
                            <GroupAddIcon/>
                        </IconButton>
                    </Tooltip>
                    <AddContactToGroup open={openCTGModal} setOpen={setOpenCTGModal} setRequireRefresh={setRequireRefresh} groupsData={groupsData} selectedRow={selectedRow} refreshSelectedRow={refreshSelectedRow}/>
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
                    <DeleteContact open={openDeleteContactModal} setOpen={setOpenDeleteContactModal} selectedRow={selectedRow} doRefreshPage={doRefreshPage}/>
                </DialogActions>
            </Dialog>
            <DeletePhoneNumber open={openDeletePhoneNumberModal} setOpen={setOpenDeletePhoneNumberModal} selectedContact={selectedContact} setRequireRefresh={setRequireRefresh} refreshSelectedRow={refreshSelectedRow}/>
            <DeleteGroupMember open={openDeleteGroupMemberModal} setOpen={setOpenDeleteGroupMemberModal} selectedRow={selectedRow} selectedGroup={selectedGroup} setRequireRefresh={setRequireRefresh} refreshSelectedRow={refreshSelectedRow}/>
        </div>
    );
}
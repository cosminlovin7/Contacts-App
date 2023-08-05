import { React, useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar.js';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import AddContact from './AddContact.js';
import AddContactToGroup from './AddContactToGroup.js';
import AddPhoneNumber from './AddPhoneNumber.js';
import DeleteContact from './DeleteContact.js';
import DeletePhoneNumber from './DeletePhoneNumber.js';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Card from '@mui/material/Card';
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

const fetchContacts = async function(page) {
    return axios
        .get(config.HOST + '/contacts/page/' + page)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
};

const fetchContactsCount = async function() {
    return axios
        .get(config.HOST + '/contacts/count')
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

const fetchContactsFiltered = async function(page, filterName, filterPhoneNumber, filterGroup, filterOperator) {
    var url = config.HOST + '/contacts/page/' + page + '/filter?';
    if ('' != filterName)
        url += 'name=' + filterName;
    if ('' != filterPhoneNumber)
        url += '&phone_number=' + filterPhoneNumber;
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

const fetchContactsFilteredCount = async function(filterName, filterPhoneNumber, filterGroup, filterOperator) {
    var url = config.HOST + '/contacts/count/filter?';
    if ('' != filterName)
        url += 'name=' + filterName;
    if ('' != filterPhoneNumber)
        url += '&phone_number=' + filterPhoneNumber;
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
    const [selectedRow, setSelectedRow] = useState(null);
    const [filterName, setFilterName] = useState('');
    const [filterPhoneNumber, setFilterPhoneNumber] = useState('');
    const [filterGroup, setFilterGroup] = useState('');
    const [filterOperator, setFilterOperator] = useState('');
    const [contactsData, setContactsData] = useState(null);
    const [contactsCount, setContactsCount] = useState(0);
    const [page, setPage] = useState(0);
    const [pageFiltered, setPageFiltered] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [requireRefresh, setRequireRefresh] = useState(false);
    const [groupsData, setGroupsData] = useState(null);

    function doRefreshPage() {
        setOpenProfileModal(false);
        setOpenCTGModal(false);
        setOpenModal(false);
        setOpenAddPhoneModal(false);
        setOpenDeleteContactModal(false);
        setSelectedRow(null);
        setFilterName('');
        setFilterPhoneNumber('');
        setFilterGroup('');
        setContactsData(null);
        setContactsCount(0);
        setPage(0);
        setPageFiltered(false);
        setRefreshPage(!refreshPage);
        setSelectedContact(null);
        setRequireRefresh(false);
        setGroupsData(null);
    }

    useEffect(() => {
        if (!pageFiltered) {
            fetchContacts(page)
                .then((data) => {
                    console.log('Data fetched successfully:', data);
                    toast.success('Contacts loaded successfully.');
                    setContactsData(data);
                })
                .catch((error) => {
                    console.error('Error while fetching the contacts:', error);
                    toast.error('Error while loading data.');
                })

            fetchContactsCount()
                .then((data) => {
                    console.log('Contacts count: ', data);
                    setContactsCount(data.contact);
                })
                .catch((error) => {
                    console.error('Error while fetching the countacts count:', error);
                })
        } else {
            fetchContactsFiltered(page, filterName, filterPhoneNumber, filterGroup, filterOperator)
                .then((data) => {
                    toast.success('Filtered contacts loaded successfully.');
                    setContactsData(data);
                })
                .catch((error) => {
                    toast.error('Error while loading filtered data.');
                })

            fetchContactsFilteredCount(filterName, filterPhoneNumber, filterGroup, filterOperator)
                .then((data) => {
                    setContactsCount(data.contact);
                })
                .catch((error) => {
                    toast.error('Error while fetching the contacts filtered count.');
                })
        }

        fetchGroups()
            .then((data) => {
                setGroupsData(data);
            })
            .catch((error) => {
                toast.error('Error while fetching the contacts filtered count.');
            })

    }, [page, pageFiltered, refreshPage]);

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

    function refreshSelectedRow() {
        if (null != selectedRow)
            fetchContactById(selectedRow.id)
                .then((data) => {
                    setSelectedRow(data.contact);
                })
                .catch((error) => {
                    toast.error('Error while fetching the contact.');
                })
    }

    function handleRowClick(row) {
        console.log(row);
        fetchContactById(row.id)
            .then((data) => {
                setSelectedRow(data.contact);
            })
            .catch((error) => {
                toast.error('Error while fetching the contact.');
            })

        setOpenProfileModal(true);
    }

    function handleDialogClose() {
        setOpenProfileModal(false);
    }

    function handleDialogExited() {
        setSelectedRow(null);
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
        setContactsData(null);
    }

    function handleOnRemovePhoneNumber(phoneNumber) {
        console.log('remove phone number function called.', phoneNumber);
        setSelectedContact(phoneNumber);
        setOpenDeletePhoneNumberModal(true);
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
                                        groupsData.groups.map((group) => {
                                            return (
                                                <MenuItem key={group.id} value={group.name}>{group.name}</MenuItem>
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
                            {null != contactsData ? (<TableBody>
                                {contactsData.contacts.map((contact) => {
                                    return (
                                    <TableRow sx={{ cursor: 'pointer' }} hover key={contact.id + contact.phoneNumber.number} onClick={() => handleRowClick(contact)}>
                                        <TableCell >{contact.name}</TableCell>
                                        <TableCell align="right">N/A</TableCell>
                                        <TableCell align="right">{contact.phoneNumber.number}</TableCell>
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
                        count={contactsCount}
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
                            {/* {selectedRow != null ? <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {selectedRow.groups.map((group, index) => (
                                    <li key={index}>{group}</li>
                                ))}
                            </ul> : ''} */}
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Tooltip title="Add to group">
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
                    <DeleteContact open={openDeleteContactModal} setOpen={setOpenDeleteContactModal} selectedRow={selectedRow} doRefreshPage={doRefreshPage}/>
                </DialogActions>
            </Dialog>
            <DeletePhoneNumber open={openDeletePhoneNumberModal} setOpen={setOpenDeletePhoneNumberModal} selectedContact={selectedContact} setRequireRefresh={setRequireRefresh} refreshSelectedRow={refreshSelectedRow}/>
        </div>
    );
}
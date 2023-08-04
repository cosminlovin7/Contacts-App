import { React, useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar.js';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import AddContact from './AddContact.js';
import AddContactToGroup from './AddContactToGroup.js';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/DefaultPage.css';
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
        })
}

export default function Contacts() {
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openCTGModal, setOpenCTGModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [filterName, setFilterName] = useState('');
    const [filterPhoneNumber, setFilterPhoneNumber] = useState('');
    const [filterGroup, setFilterGroup] = useState('');
    const [filterOperator, setFilterOperator] = useState('');
    const [contactsData, setContactsData] = useState(null);
    const [contactsCount, setContactsCount] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        fetchContacts(page)
            .then((data) => {
                console.log('Data fetched successfully:', data);
                toast.success('Data loaded successfully.');
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
    }, [page]);

    const handleAddContact = () => {
        setOpenModal(true);
    }

    const handleAddContactToGroup = () => {
        setOpenCTGModal(true);
    }

    function handleRowClick(row) {
        console.log(row);
        setOpenProfileModal(true);
        setSelectedRow(row);
    }

    function handleDialogClose() {
        setOpenProfileModal(false);
    }

    function handleDialogExited() {
        setSelectedRow(null);
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
        console.log(filterName);
        console.log(filterPhoneNumber);
        console.log(filterGroup);
        console.log(filterOperator);
    }

    const handleResetFilter = () => {
        setFilterName('');
        setFilterPhoneNumber('');
        setFilterGroup('');
        setFilterOperator('');

        console.log('reset filter called');
    }

    const handleChangePage = (event, newPage) => {
        console.log('page changed');
        setPage(newPage);
        setContactsData(null);
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
                        <AddContact open={openModal} setOpen={setOpenModal}/>
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
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
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
                        <Tooltip title="Reset filter">
                            <IconButton onClick={handleResetFilter}>    
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
                    <DialogContentText>
                        <b>Phone Number:</b> {selectedRow != null ? selectedRow.phoneNumber.number : 'Phone Number not set'}
                    </DialogContentText>
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
                    <AddContactToGroup open={openCTGModal} setOpen={setOpenCTGModal}/>
                </DialogActions>
            </Dialog>
        </div>
    );
}
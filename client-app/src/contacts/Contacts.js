import { React, useState } from 'react';
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
import '../components/DefaultPage.css';

function createData(firstName, lastName, groups, phoneNumber, mobileNetworkOperator) {
    return { firstName, lastName, groups, phoneNumber, mobileNetworkOperator };
}
  
const rows = [
    createData('Cosmin', 'Lovin', ['Family'], '0753690515', 'DIGI'),
    createData('Bianca', 'Besnea', ['Family', 'Friends'], '0753690516', 'TELEKOM'),
    createData('Alin', 'Popescu', [], '0766051234', 'Orange')
];

const table_row_styles = {
    background: 'rgb(0,174,191)',
    background: '-moz-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: '-webkit-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: 'linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#00aebf",endColorstr="#00ffab",GradientType=1)'
}

export default function Contacts() {
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openCTGModal, setOpenCTGModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

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

    return (
        <div className = "container">
            <div className = "menu-bar">
                <MenuBar value={0}/>
            </div>
            <div className = "panel">
                <div className = "tool-bar">
                    <div className = "button">
                        <Tooltip title="Add new contact">
                            <IconButton onClick={handleAddContact}>    
                                <AddCircleIcon/>
                            </IconButton>
                        </Tooltip>
                        <AddContact open={openModal} setOpen={setOpenModal}/>
                    </div>
                </div>
                <div className = "content">
                    <TableContainer component={Card}>
                        <Table sx={{ minWidth: 475 }}>
                            <TableHead>
                                <TableRow style={table_row_styles}>
                                    <TableCell >Name</TableCell>
                                    <TableCell align="right">Group</TableCell>
                                    <TableCell align="right">Phone Number</TableCell>
                                    <TableCell align="right">Mobile Network Operator</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow sx={{ cursor: 'pointer' }} hover key={row.phoneNumber} onClick={() => handleRowClick(row)}>
                                        <TableCell >{row.firstName} {row.lastName}</TableCell>
                                        <TableCell align="right">{row.groups.length > 0 ? row.groups.length > 1 ? row.groups[0] + ',...' : row.groups[0] : ''}</TableCell>
                                        <TableCell align="right">{row.phoneNumber}</TableCell>
                                        <TableCell align="right">{row.mobileNetworkOperator}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                        <b>Name:</b> {selectedRow != null ? selectedRow.firstName + ' ' + selectedRow.lastName : 'Name not set'}
                    </DialogContentText>
                    <DialogContentText>
                        <b>Phone Number:</b> {selectedRow != null ? selectedRow.phoneNumber : 'Phone Number not set'}
                    </DialogContentText>
                    <Accordion>
                        <AccordionSummary>
                            <b>Groups</b>
                        </AccordionSummary>
                        <AccordionDetails style={{ maxHeight: '200px', overflow: 'auto' }}>
                            {selectedRow != null ? <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {selectedRow.groups.map((group, index) => (
                                    <li key={index}>{group}</li>
                                ))}
                            </ul> : ''}
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
import React, { useState } from 'react';
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
import '../components/DefaultPage.css';

function createData(name, size) {
    return { name, size };
}

const rows = [
    createData('Family', 2),
    createData('Friends', 1),
];

const table_row_styles = {
    background: 'rgb(0,174,191)',
    background: '-moz-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: '-webkit-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: 'linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#00aebf",endColorstr="#00ffab",GradientType=1)'
}

export default function Groups() {
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleAddGroup = () => {
        setOpenModal(true);
    }

    function handleRowClick(row) {
        console.log(row);
        setSelectedRow(row);
    }

    return (
        <div className = "container">
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
                        <AddGroup open={openModal} setOpen={setOpenModal}/>
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
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow sx={{ cursor: 'pointer' }} hover key={row.name} onClick={() => handleRowClick(row)}>
                                        <TableCell >{row.name}</TableCell>
                                        <TableCell align="right">{row.size}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};
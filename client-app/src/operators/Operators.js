import React, { useState } from 'react';
import MenuBar from '../components/MenuBar.js';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import AddOperator from './AddOperator.js';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import '../components/DefaultPage.css';

function createData(name, prefix) {
    return { name, prefix };
}
  
const rows = [
    createData('DIGI', '077'),
    createData('Vodafone', '072'),
    createData('Orange', '074'),
];

const table_row_styles = {
    background: 'rgb(0,174,191)',
    background: '-moz-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: '-webkit-linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    background: 'linear-gradient(90deg, rgba(0,174,191,1) 21%, rgba(0,255,171,1) 77%)',
    filter: 'progid:DXImageTransform.Microsoft.gradient(startColorstr="#00aebf",endColorstr="#00ffab",GradientType=1)'
}

export default function Operators() {
    const [openModal, setOpenModal] = useState(false);

    const handleAddOperator = () => {
        setOpenModal(true);
    }

    function handleRowClick(row) {
        console.log(row);
    }

    return (
        <div className = "container">
            <div className = "menu-bar">
                <MenuBar value={2}/>
            </div>
            <div className = "panel">
                <div className = "tool-bar">
                    <div className = "button">
                        <Tooltip title="Add new operator">
                            <IconButton onClick={handleAddOperator}>    
                                <AddCircleIcon/>
                            </IconButton>
                        </Tooltip>
                        <AddOperator open={openModal} setOpen={setOpenModal}/>
                    </div>
                </div>
                <div className = "content">
                    <TableContainer component={Card}>
                        <Table sx={{ minWidth: 475 }}>
                            <TableHead>
                                <TableRow style={table_row_styles}>
                                    <TableCell >Name</TableCell>
                                    <TableCell align="right">Prefix</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow sx={{ cursor: 'pointer' }} hover key={row.prefix} onClick={() => handleRowClick(row)}>
                                        <TableCell >{row.name}</TableCell>
                                        <TableCell align="right">{row.prefix}</TableCell>
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
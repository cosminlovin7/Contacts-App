import React, { useState, useEffect } from 'react';
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
import EditOperator from './EditOperator.js';
import '../components/DefaultPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../config.js';
import axios from 'axios';

/*
this method is used to create a request to the server in order to
get all the operators
*/
const fetchOperators = async function() {
    return axios
        .get(config.HOST + '/operators')
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
};

const fetchOperator = async function(operatorId) {
    return axios
        .get(config.HOST + '/operators/' + operatorId)
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

export default function Operators() {
    const [openModal, setOpenModal] = useState(false);
    const [openOperatorEditModal, setOpenOperatorEditModal] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [requireRefresh, setRequireRefresh] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [operatorsData, setOperatorsData] = useState(null);

    function doRefreshPage() {
        setOpenModal(false);
        setOpenOperatorEditModal(false);
        setRefreshPage(!refreshPage);
        setRequireRefresh(false);
        setSelectedRow(null);
        setOperatorsData(null);
    }

    useEffect(() => {
        fetchOperators()
            .then((data) => {
                console.log('Data fetched successfully:', data);
                toast.success('Operators loaded successfully.', { autoClose: 750, });
                setOperatorsData(data);
            })
            .catch((error) => {
                console.error('Error while fetching the operators:', error);
                toast.error('Error while loading data.', { autoClose: 750, });
            })
    }, [refreshPage]);

    const handleAddOperator = () => {
        setOpenModal(true);
    }

    function handleRowClick(row) {
        console.log(row);
        setSelectedRow(row);
        setOpenOperatorEditModal(true);
    }

    function handleDialogClose() {
        setOpenOperatorEditModal(false);
    }

    function handleDialogExited() {
        setSelectedRow(null);
        if (requireRefresh) {
            doRefreshPage()
        }
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
                        <AddOperator open={openModal} setOpen={setOpenModal} doRefreshPage={doRefreshPage}/>
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
                            {null != operatorsData ? (<TableBody>
                                {operatorsData.operators.map((operator, index) => (
                                    <TableRow sx={{ cursor: 'pointer' }} hover key={index} onClick={() => handleRowClick(operator)}>
                                        <TableCell >{operator.name}</TableCell>
                                        <TableCell align="right">{operator.prefix}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>) : ''}
                        </Table>
                    </TableContainer>
                </div>
            </div> 

            {null != selectedRow ? <EditOperator open={openOperatorEditModal} setOpen={setOpenOperatorEditModal} handleDialogExited={handleDialogExited} selectedRow={selectedRow} doRefreshPage={doRefreshPage}/> : ''}
        </div>
    );
};
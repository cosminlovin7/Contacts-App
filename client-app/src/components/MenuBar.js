import React, { useState }  from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import GroupIcon from '@mui/icons-material/Group';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { useNavigate } from 'react-router-dom';

export default function MenuBar(props) {
    const [value, setValue] = React.useState(props.value);
    const navigate = useNavigate();
    
    const handleChange = function(event, newValue) {
        console.log(newValue);
        setValue(newValue);
        
        switch(newValue) {
            case 0:
                navigate('/contacts');
                break;
            case 1:
                navigate('/groups');
                break;
            case 2:
                navigate('/operators');
                break;
            default:
                break;
        }
    }

    return (
        <Tabs 
            value={value} 
            onChange={handleChange}
            centered
            sx={{
                '& .Mui-selected': {
                  color: 'black',
                },
            }}>
            <Tab icon={<PhoneIcon />} label="CONTACTS"/>
            <Tab icon={<GroupIcon />} label="GROUPS" />
            <Tab icon={<SignalCellularAltIcon />} label="OPERATORS" />
        </Tabs>
    );
}
import React from 'react'
import EditCategory from './EditCategory'
import { useParams } from 'react-router-dom'; 
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import EducationManager from './EducationManager';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function EditCategoryIndex() {
    const { id } = useParams();
  const [value, setValue] = React.useState<any>(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{ style: { backgroundColor: '#c73b27' } }}>
          <Tab label="Edit Categoty" {...a11yProps(0)}
            sx={{ 
              textTransform: 'none', 
              '&.Mui-selected': {
                color: '#c73b27',
              } 
            }}
          />
          <Tab label="Education Management" {...a11yProps(1)}
            sx={{ 
              textTransform: 'none', 
              '&.Mui-selected': {
                color: '#c73b27',
              } 
            }}
          /> 
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <EditCategory match={{ params: { id } }} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <EducationManager />
      </CustomTabPanel> 
    </Box>
  );
}
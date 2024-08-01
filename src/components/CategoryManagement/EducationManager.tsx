import { Box, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch } from "@mui/material";
import { Button } from "antd";
import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { GET_EDUCATION_BY_PRODUCT_CATEGORY_ID, GET_EDUCATION_STATE_BY_CATEGORY_ID } from "../../GraphQL/Queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useParams } from 'react-router-dom'; 
import { CREATE_OR_UPDATE_PRODUCT_CATEGORY_EDUCATION, UPDATE_BLOCK_STATE_OF_EDUCATION } from "../../GraphQL/Mutations";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  switchRoot: {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#c73b27', // Change this to the desired color
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#c73b27', // Change this to the desired color
    },
  },
});

// just for reference 
// export enum EducationStatus {
//   PUBLISHED = 'PUBLISHED',
//   DRAFT = 'DRAFT',
//   ARCHIVED = 'ARCHIVED',
// }
function EducationManager() { 
  const [value, setValue] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [shoudPublish, setShouldPublish] = useState<boolean>(true);
  const [shoudHideEducation, setHideEducation] = useState<boolean>(false);
  const [language, setLanguage] = useState<number>(1);
  const { id } = useParams(); 
  
  const [getEducation, { loading: queryLoading, error: queryError, data: queryData }] = useLazyQuery(GET_EDUCATION_BY_PRODUCT_CATEGORY_ID, {
    fetchPolicy: 'no-cache'
  });

  const [getEducationState, { loading: educationStateQueryLoading, error: educationStatusError, data: educationStatusQueryData }] = useLazyQuery(GET_EDUCATION_STATE_BY_CATEGORY_ID, {
    fetchPolicy: 'no-cache'
  });

  const [createEducation, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_OR_UPDATE_PRODUCT_CATEGORY_EDUCATION, {
    fetchPolicy: 'no-cache'
  });

  const [updateEducationState, { loading: mutationUpdateStateLoading, error: mutationUpdateStateError, data:  mutationUpdateStateDate  }] = useMutation(UPDATE_BLOCK_STATE_OF_EDUCATION, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    getEducationState({
      variables: { productCategoryId: id }
    })
  }, [getEducationState, id])

  useEffect(()=>{
    setHideEducation(educationStatusQueryData ? educationStatusQueryData.getEducationStateByCategoryId : false)
  }, [educationStatusQueryData]) 

  useEffect(() => {
    // Determine the language string based on the language value
    const languageStr = language === 1 ? 'English' : language === 2 ? 'Sinhala' : 'Tamil';

    // Fetch education data when component mounts or when id or language changes
    getEducation({
      variables: { productCategoryId: id, language: languageStr }
    });
  }, [getEducation, id, language]);
 


  useEffect(() => {
    if (queryData?.getEducationByProductCategoryId.content) {
      setValue(queryData?.getEducationByProductCategoryId.content);
      setLastUpdate(queryData?.getEducationByProductCategoryId.updatedAt);
      setShouldPublish(queryData?.getEducationByProductCategoryId?.status === 'PUBLISHED' ? true : false)
    }
    if(queryData?.getEducationByProductCategoryId === null){
      setValue('');
      setLastUpdate(null);
    }
  }, [queryData])

  
  const handleUpdateEducationState = async () => {
    const result = await updateEducationState({
      variables: {
        productCategoryId: id,
        blocked: !shoudHideEducation 
      }
    })

    if(result.data.updatedBlockStateOfEducation){
      setHideEducation(!shoudHideEducation)
      toast.success(`Education ${shoudHideEducation ? 'ublocking' : 'blocking'} succeeded!`, { position: "top-center" })
    }
  }
  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error: {queryError.message}</p>;

  const handleSave = async () => {
    try {
      const result = await createEducation({
        variables: {
          input: {
            productCategoryId: id,
            language: language === 1 ? 'English' : language === 2 ? 'Sinhala' : 'Tamil',
            content: value,
            status: shoudPublish ? 'PUBLISHED' : 'ARCHIVED'
          },
        },
      });
      const { productCategoryEducation, __typename } = result.data.createOrUpdateProductCategoryEducation;
      if(__typename === "ProductCategoryEducationCreated"){
        const {content, updatedAt, status} = productCategoryEducation 
        setValue(content);
        setLastUpdate(updatedAt);
        setShouldPublish(status === 'PUBLISHED' ? true : false)
        toast.success('update succeeded!', { position: "top-center" })
      } 

      if(__typename === "ProductCategoryNotFoundError"){
        toast.error('Product category not found', { position: "top-center" })
      }
      // Handle success, e.g., show a success message or redirect
    } catch (error) {
      console.error('Mutation error:', error);
      // Handle error, e.g., show an error message
    }
  };

  const CustomSwitch = ({ checked, onChange }) => {
    const classes = useStyles();
  
    return (
      <Switch
        disabled={mutationUpdateStateLoading}
        checked={checked}
        onChange={onChange}
        classes={{ root: classes.switchRoot }}
      />
    );
  };

  return (
    <div>
      <ToastContainer />
      <Box  sx={{
        width: '100%',
        display: "flex",
        justifyContent: "space-between",
        marginBottom: '10px'
      }}> 
        <Box>
          Last Update: {new Date(lastUpdate as Date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric',
                          hour12: true,
                        })}

          <Box>
            <FormGroup>
              <FormControlLabel control={<CustomSwitch 
                checked={shoudPublish}
                onChange={() => setShouldPublish(!shoudPublish)}
              />} label={`${shoudPublish ? "Published": 'Unpublish'} ${language === 1 ? 'English' : language === 2 ? 'Sinhala' : 'Tamil'} article`}
              color="secondary" />
            </FormGroup>
            <FormGroup>
              <FormControlLabel control={<CustomSwitch 
                checked={shoudHideEducation}
                onChange={handleUpdateEducationState}
              />} label={`${shoudHideEducation ? 'Blocked' : 'Unblocked'} Education`}
              color="secondary" />
            </FormGroup>
          </Box>
        </Box>
        <Box sx={{ minWidth: 200 }}>
         
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value as number)}
            >
              <MenuItem value={1}>English</MenuItem>
              <MenuItem value={2}>Sinhala</MenuItem>
              <MenuItem value={3}>Tamil</MenuItem>
            </Select>
          </FormControl>
        </Box> 
      </Box> 
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <Box sx={{
        width: '100%',
        display: "flex",
        justifyContent: "flex-end",
        marginTop: '10px'
      }}>
        <Button
            type="primary"
            className="primary__btn"
            onClick={handleSave}
            loading={mutationLoading}
            disabled={ mutationUpdateStateLoading || educationStateQueryLoading || queryLoading }
          >
            Save
      </Button>
      </Box>
    </div>
  )
}

export default EducationManager

// lib
import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// report store
const reportSlice = createSlice({
    name: 'reportSlice',
    initialState: {
        data: [],
    },
    extraReducers: (builder) => {
        builder.addCase(fetchApiCreateReport.fulfilled, (state, action) => {
            console.log('action.payload', action.payload);

            state.data = action.payload;
        });
    },
});

// create form data
const createFormData = (reported) => {
    const { messageId, imageLink, content, senderID } = reported;

    console.log('data - 17', reported);

    const dataForm = new FormData();

    dataForm.append('messageId', messageId);

    if (imageLink.length === 1) {
        dataForm.append('fileImage', imageLink[0].data);
    } else if (imageLink.length > 1) {
        imageLink.forEach((img) => {
            dataForm.append('fileImage', img.data);
        });
    }

    dataForm.append('content', content);
    dataForm.append('senderID', senderID);

    return dataForm;
};

// create report
export const fetchApiCreateReport = createAsyncThunk('reportSlice/fetchApiCreateReport', async (reported) => {
    try {
        // console.log('47 - data - fetch -', reported);
        let formData = createFormData(reported);
        console.log('49 - form-data -', formData);
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}reports`, formData, {
            headers: {
                'content-type': 'multipart/form-data',
            },
        });

        // console.log('[28 - res]', res.data);

        return res.data;
    } catch (err) {
        console.log(err);
    }
});

export default reportSlice;

import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
    name: 'filters',
    initialState: {
        search: '',
    },
    reducers: {
        searchFilterChange: (state, action) => {
            state.search = action.payload;
        },
    },
});

export default filterSlice;

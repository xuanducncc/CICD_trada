import { createSlice } from '@reduxjs/toolkit';

const canvasSlice = createSlice({
  name: 'canvas',
  initialState: {
    pan: { x: 0, y: 0},
    zoom: 1,
    isShowOverlay: true,
    isShowTitle: false,
  },
  reducers: {

  }
})

export default canvasSlice.reducer;

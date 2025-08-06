import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user:null,
  loading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
        state.loading = action.payload
    },
    setUser: (state, action) => {
        state.user = action.payload
    },
    removeUser: (state,action) => {
        state.user = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLoading, setUser, removeUser } = userSlice.actions

export default userSlice.reducer
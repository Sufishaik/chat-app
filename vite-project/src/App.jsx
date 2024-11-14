import React, { useEffect, useState } from 'react'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profle'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utlis/constant'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  console.log("userInfo", userInfo)
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />
}
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children
}

function App() {
  const { userInfo, setUserInfo } = useAppStore();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const resp = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        })
        if (resp.status === 200 && resp.data.id) {
          setUserInfo(resp.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (err) {
        console.log("Error", err)
        setUserInfo(undefined);

      } finally {
        setLoading(false)
      }
    }

    if (!userInfo) {
      getUserData();

    } else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthRoute>
          <Auth />
        </AuthRoute>} />
        <Route path='/chat' element={<PrivateRoute>
          <Chat />
        </PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute>
          <Profile />
        </PrivateRoute>} />
        <Route path='*' element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

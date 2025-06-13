import { Button } from '@/components/ui/button'
import { clearAllErrors, logout } from '@/store/slices/userSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export const Home = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {message,error,isAuthenticated,loading} = useSelector((state)=> state.user)

  const handleLogout = ()=>{
    dispatch(logout())
   
  }

  useEffect(()=>{
    if(error){
      toast.error(error)
      dispatch(clearAllErrors())
    }
    if(message){
      toast.success(message)
    }
  },[dispatch,message,error])

  if (!isAuthenticated && !loading) {
    navigate("/logins");
  }
  return (
    <div>
      <Button onClick = {handleLogout}>Logout</Button>
    </div>
  )
}

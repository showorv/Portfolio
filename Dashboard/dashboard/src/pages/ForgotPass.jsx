import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clearAllForgotPassErrors, forgotPass } from '@/store/slices/forgotRestPassSlice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingButton } from './subComponents/LoadingButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ForgotPass = () => {

  const [ email, setEmail] = useState("");

  const {loading,error,message} = useSelector((state)=> state.forgotPass)
  const {isAuthenticated} = useSelector((state)=> state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleForgotPass = ()=>{
    dispatch(forgotPass(email));
  }

  useEffect(()=>{
    if(error){
      toast.error(error)
      dispatch(clearAllForgotPassErrors())
    }

    if(isAuthenticated){
      navigate("/")
    }

    if(message !== null){
      toast.success(message)
    }
  },[dispatch,isAuthenticated,loading,error])
  return (
    <div className="overflow-x-hidden bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8 w-full">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold">Forgot password</h2>
                    <p className="text-muted-foreground text-balance">
                      Request for forgot password
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input  type="email" placeholder="m@example.com" value={email} onChange = {(e)=> setEmail(e.target.value)} required />
                  </div>

                  <div className="grid gap-3">
                
                    
                      <Link to="/logins" className="ml-auto text-sm underline-offset-2 hover:underline">
                       Remember your password?
                      </Link>
                 
        
                  </div>

                  {loading? <LoadingButton content={"Requesting"}/> : <Button type="button" className="w-full" onClick ={handleForgotPass}>
                  Sent Email
                  </Button>}

    
                </div>
              </form>

              <div className="bg-muted relative hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="Login illustration"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

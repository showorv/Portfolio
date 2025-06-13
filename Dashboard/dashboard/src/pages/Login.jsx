import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from 'react-redux';
import { clearAllErrors, login } from '@/store/slices/userSlice';
import { toast } from 'sonner';
import { LoadingButton } from './subComponents/LoadingButton';

export const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {loading, isAuthenticated,message, error} = useSelector((state)=> state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = (e)=>{
    e.preventDefault()
    dispatch(login(email,password))
  }

  useEffect(()=>{
    if(error){
      toast.error(error)
      dispatch(clearAllErrors());
    }
    if(isAuthenticated){
      navigate("/")
    }
  },[dispatch,isAuthenticated,error,loading])
  return (
    <div className="overflow-x-hidden bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8 w-full">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold">Login</h2>
                    <p className="text-muted-foreground text-balance">
                      Login to your dashboard
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input  type="email" placeholder="m@example.com" value={email} onChange = {(e)=> setEmail(e.target.value)} required />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/password/forgot" className="ml-auto text-sm underline-offset-2 hover:underline">
                        Forgot your password?
                      </Link>
                    </div>
                    <Input i type="password" value={password} onChange = {(e)=> setPassword(e.target.value)} required  />
                  </div>

                  {loading? <LoadingButton content={"Logging In"}/> : <Button type="button" className="w-full" onClick ={handleLogin}>
                    Login
                  </Button>}

                  


               

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
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
  );
};

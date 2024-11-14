import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiClient } from '@/lib/api-client'
import { useAppStore } from '@/store'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utlis/constant'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function Auth() {
    const [email, setEmail] = useState("")
    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const [comfirm, setComfirm] = useState("");
    const { setUserInfo } = useAppStore()
    const validateSignUp = () => {
        if (!email.length) {
            toast.error("Email is Required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is Required");
            return false;
        }
        if (password !== comfirm) {
            toast.error("Password and confirm password must be same");
            return false;
        }
        return true
    }
    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is Required");
            return false;
        }
        if (!password.length) {
            toast.error("Password is Required");
            return false;
        }

        return true
    }
    const handleLogin = async () => {
        if (validateLogin()) {
            const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
            console.log("response", response);
            if (response.data.user.id) {
                setUserInfo(response.data.user)
                if (response.data.user.profileSetup) navigate("/chat")
                else navigate("/profile")
            }
        }
    }
    const handleSingup = async () => {
        if (validateSignUp()) {
            const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
            if (response.status === 201) {
                setUserInfo(response.data.user)
                navigate("/profile")
            }
            console.log("response", response);
        }
    }
    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
            <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
                <div className='flex gap-10 flex-col items-center justify-center'>
                    <div className='flex items-center justify-center flex-col'>
                        <div className='flex items-center justify-center'>
                            <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                        </div>
                        <p className='font-medium text-center'>Fill in the blanks to get started with the best chat app</p>
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        <Tabs className='w-3/4' defaultValue='login'>
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all">Login</TabsTrigger>
                                <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all" value="signup">SignUp</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 " value="login">
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Button onClick={handleLogin}>Login</Button>

                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5 " value="signup">
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="password" className="rounded-full p-6" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Input placeholder="Comfirm Password" type="password" className="rounded-full p-6" value={comfirm} onChange={(e) => setComfirm(e.target.value)} />
                                <Button onClick={handleSingup}>Sign Up</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Auth

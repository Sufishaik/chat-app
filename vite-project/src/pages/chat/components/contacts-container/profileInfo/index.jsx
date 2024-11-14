import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { HOST, LOGOUT } from '@/utlis/constant';
import React from 'react'
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IoPowerSharp } from "react-icons/io5"
import { apiClient } from '@/lib/api-client';
function ProfileInfo() {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {

            const resp = await apiClient.post(LOGOUT, {}, { withCredentials: true });
            if (resp.status === 200) {
                navigate("/auth");
                setUserInfo(null);
            }
        } catch (err) {
            console.log("err", err)
        }
    }
    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between p-10 w-full bg-[#2a2b33]'>
            <div className='flex gap-3 items-center justify-center'>
                <div className='w-12 h-12 relative'>
                    <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                        {
                            userInfo.image ? <AvatarImage src={`${HOST}/${userInfo.image}`} className='object-cover w-full h-full bg-black' /> : <div className={`uppercase h-12 w-12 text-lg boder-[1px] flex items-center justify-center ${getColor(userInfo.color)}`}>

                                {userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo?.email?.split("").shift()}
                            </div>
                        }
                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className='flex  gap-3'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><FiEdit2 onClick={() => navigate("/profile")} className='text-purple-500 text-xl font-medium' />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b16] border-none text-white">
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger><IoPowerSharp onClick={handleLogout} className='text-red-500 text-xl font-medium' /></TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b16] border-none text-white">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}

export default ProfileInfo

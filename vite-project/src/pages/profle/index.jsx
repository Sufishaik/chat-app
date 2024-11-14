import { useAppStore } from '@/store'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5"
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import { FaTrash, FaPlus } from "react-icons/fa"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ADD_PROFILE_IMG_ROUTE, DELETE_PROFILE_IMG_ROUTE, HOST, UPDATE_PROFILEROUTE } from '@/utlis/constant';
function Profile() {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [firstName, setFirstName,] = useState('');
    const [lastName, setLastName,] = useState('');
    const [image, setImage,] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);

    const validateProfile = () => {
        if (!firstName) {
            toast.error('Please Enter First Name'); r
            return false;
        }
        if (!lastName) {
            toast.error('Please Enter Last Name'); r
            return false;
        }

        return true;
    }
    const handleNavigate = () => {
        if (userInfo.profileSetup) {
            navigate("/chat");

        } else {
            toast.error("Please Complete the profile")
        }
    }
    const saveChanges = async () => {
        if (validateProfile()) {
            try {
                const resp = await apiClient.post(UPDATE_PROFILEROUTE, {
                    firstName, lastName, color: selectedColor
                }, {
                    withCredentials: true,
                }
                )
                console.log("API Response:", resp.data);
                if (resp.status === 200 && resp.data.id) {
                    setUserInfo({ ...resp.data });
                    toast.success("Profile updated successfully")
                    navigate('/chat')
                }
            } catch (err) {
                console.log("ERROR", err)
            }
        }
    }
    useEffect(() => {
        if (userInfo?.profileSetup) {
            setFirstName(userInfo?.firstName || '');
            setLastName(userInfo?.lastName || '');
            setSelectedColor(userInfo?.color || 0);
            if (userInfo.image) {
                setImage(`${HOST}/${userInfo.image}`);
            }
        }
    }, [userInfo])
    const handleInputFile = () => {
        fileInputRef.current.click()
    }
    const handleImageFunc = async (event) => {
        const file = event?.target?.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("profileImg", file);
            console.log("Image", formData)

            const resp = await apiClient.post(ADD_PROFILE_IMG_ROUTE, formData, { withCredentials: true });
            if (resp.status === 200 && resp.data.image) {
                setUserInfo({ ...userInfo, image: resp.data.image });
                toast.success("Image added successfully")
            }
            const reader = new FileReader();
            console.log("Image", resp)
            reader.onload = () => {
                setImage(reader.result);
            }
            reader.readAsDataURL(file)
        }
    }
    const handleDeleteImage = async () => {
        try {
            const resp = await apiClient.delete(DELETE_PROFILE_IMG_ROUTE, { withCredentials: true });
            console.log("resp delete", resp);

            if (resp.status === 200) {
                setUserInfo({ ...userInfo, image: null });
                toast.success("Image deleted successfully");
                setImage(null);
            }
        } catch (err) {
            console.log("Error", err)
        }
    }
    return (
        <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10'>
            <div className='flex flex-col gap-10 w-[80vw] md:w-max'>
                <div>
                    <IoArrowBack className='text-4xl lg:text-6xl text-white/90 cursor-pointer' />
                </div>
                <div className='grid grid-cols-2'>
                    <div className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                        <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                            {
                                image ? <AvatarImage src={image} className='object-cover w-full h-full bg-black' /> : <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl boder-[1px] flex items-center justify-center ${getColor(selectedColor)}`}>

                                    {firstName ? firstName.split("").shift() : userInfo?.email?.split("").shift()}
                                </div>
                            }
                        </Avatar>
                        {
                            hovered && (
                                <div className='absolute inset-0 flex  items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full' onClick={image ? handleDeleteImage : handleInputFile}>
                                    {
                                        image ? <FaTrash className='text-white text-3xl cursor-pointer' /> : <FaPlus className='text-white text-3xl cursor-pointer' />
                                    }
                                </div>
                            )
                        }
                        < input accept='.png, .jpg, .jpeg, .svg, .webp' type='file' ref={fileInputRef} onChange={handleImageFunc} className='hidden' name='profileImg' />
                    </div>
                    <div className='flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center'>
                        <div className='w-full'>
                            <Input placeholder="Email" type="email" disabled value={userInfo.email} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                        </div>
                        <div className='w-full'>
                            <Input placeholder="First Name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                        </div>
                        <div className='w-full'>
                            <Input placeholder="Last name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                        </div>
                        <div className='flex w-full gap-5'>
                            {
                                colors.map((color, index) => {
                                    return (
                                        <>
                                            <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline outline-white/50 outline-1" : ""}`} key={index} onClick={() => setSelectedColor(index)}></div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <Button onClick={saveChanges} className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300">Save Changes</Button>
                </div>
            </div>
        </div>
    )
}

export default Profile

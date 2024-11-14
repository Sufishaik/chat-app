import { useAppStore } from '@/store'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { HOST } from '@/utlis/constant';
import { getColor } from '@/lib/utils';

export const ContactList = ({ contacts, isChannel = false }) => {

    const { selectedChatData, setSelectedChatData, setSelectedMessages, setSelectedChatTypes, selectedChatType } = useAppStore();
    const handleClick = (contact) => {
        if (isChannel) setSelectedChatTypes("channels");
        else setSelectedChatTypes("contact");
        setSelectedChatData(contact);
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedMessages([])
        }
    }
    return (
        <div className='mt-5'>
            {
                contacts?.map?.((contact) => {
                    return (
                        <>
                            <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`} onClick={() => handleClick(contact)}>
                                <div className='flex gap-5 items-center justify-start '>
                                    {
                                        !isChannel && <Avatar className="h-10 w-10  rounded-full overflow-hidden">
                                            {
                                                contact.image ? <AvatarImage src={`${HOST}/${contact.image}`} className='object-cover w-full h-full bg-black' /> : <div className={` ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border border-white/70" : `${getColor(contact.color)}`} uppercase h-10 w-10 text-lg boder-[1px] flex items-center justify-center `}>

                                                    {contact.firstName ? contact.firstName.split("").shift() : contact?.email?.split("").shift()}
                                                </div>
                                            }
                                        </Avatar>
                                    }
                                    {
                                        isChannel && <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#
                                        </div>
                                    }
                                    {
                                        isChannel ? <span>{contact.name}</span> : <span>{`${contact.firstName} ${contact.lastName}`}</span>
                                    }
                                </div>
                            </div >
                        </>
                    )
                })}
        </div >
    )
}


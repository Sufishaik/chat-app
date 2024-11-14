import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import Lottie from 'react-lottie'
import { animationDefaultOptions, getColor } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import { HOST, SEARCH_CONTACTS } from '@/utlis/constant'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useAppStore } from '@/store'


function NewDM() {
    const [openNewContactModal, setOpenNewContactModal] = React.useState(false);
    const [seatchedContact, setSearchedContact] = useState([]);
    const { setSelectedChatTypes, setSelectedChatData, selectedChatData } = useAppStore();
    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const resp = await apiClient.post(SEARCH_CONTACTS, {
                    searchTerm,
                }, { withCredentials: true }
                )
                if (resp.status === 200 && resp.data.contacts) {
                    setSearchedContact(resp.data.contacts)
                }
            } else {
                setSearchedContact([])
            }
        } catch (err) {
            console.log("Error", err)
        }
    }
    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatTypes("contact");
        setSelectedChatData(contact)
        setSearchedContact([]);
    }
    console.log("selectedChatData", selectedChatData)
    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger><FaPlus onClick={() => setOpenNewContactModal(true)} className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer duration-300 transition-all' /></TooltipTrigger>
                    <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>

                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please Select a contact</DialogTitle>
                        <DialogDescription>
                            {/* Please Select a contact */}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search Contact" onChange={(e) => searchContacts(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                    </div>
                    {
                        seatchedContact.length > 0 &&

                        <ScrollArea className="h-[250px]">
                            <div className='flex flex-col gap-5'>
                                {
                                    seatchedContact?.map?.((contact) => {
                                        return (
                                            <>
                                                <div className='flex gap-3 items-center cursor-pointer' onClick={() => selectNewContact(contact)}>
                                                    <div className='w-12 h-12 relative'>
                                                        <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                                                            {
                                                                contact.image ? <AvatarImage src={`${HOST}/${contact.image}`} className='object-cover w-full h-full bg-black' /> : <div className={`uppercase h-12 w-12 text-lg boder-[1px] flex items-center justify-center ${getColor(contact.color)}`}>

                                                                    {contact.firstName ? contact.firstName.split("").shift() : contact?.email?.split("").shift()}
                                                                </div>
                                                            }
                                                        </Avatar>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <span>
                                                            {
                                                                contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email}

                                                        </span>
                                                        <span className='text-xs'>{contact.email}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </ScrollArea>
                    }
                    {
                        seatchedContact.length <= 0 && <div>
                            <div className='flex-1  md:flex mt-5 flex-col justify-center items-center duration-1000 transition-all'>
                                <div><Lottie isClickToPauseDisabled={true} height={100} width={100} options={animationDefaultOptions} /></div>
                                <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
                                    <h3 className='poppins-medium'>
                                        Hi<span className='text-purple-500'>!</span> Search New
                                        <span className='text-purple-500'> Contact</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    }
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default NewDM

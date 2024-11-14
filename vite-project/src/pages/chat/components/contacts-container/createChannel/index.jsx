import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,

} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'

import { apiClient } from '@/lib/api-client'
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS, } from '@/utlis/constant'

import { useAppStore } from '@/store'
import { Button } from '@/components/ui/button'
import MultipleSelector from '@/components/ui/multipleselect'


function CreateChannel() {
    const [openNewChannelModal, setOpenNewChannelModal] = React.useState(false);

    const { setSelectedChatTypes, setSelectedChatData, addChannel } = useAppStore();
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [channelName, setChannelName] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const resp = await apiClient.get(GET_ALL_CONTACTS, { withCredentials: true });
            setAllContacts(resp.data.contacts)
        }
        getData();
    }, [])

    const createChannel = async () => {
        try {
            if (channelName.length >= 0 && selectedContacts.length > 0) {

                const resp = await apiClient.post(CREATE_CHANNEL_ROUTE, {
                    name: channelName,
                    members: selectedContacts.map((contact) => contact.value),
                }, { withCredentials: true });

                if (resp.status === 201) {
                    setChannelName('');
                    setSelectedContacts([]);
                    setOpenNewChannelModal(false);
                    addChannel(resp.data.channel);
                }
            }
        } catch (err) {
            console.log("Error", err);
        }

    }
    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger><FaPlus onClick={() => setOpenNewChannelModal(true)} className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer duration-300 transition-all' /></TooltipTrigger>
                    <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
                        Create New Channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal}>

                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel</DialogTitle>
                        <DialogDescription>
                            {/* Please Select a contact */}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Channel Name" onChange={(e) => setChannelName(e.target.value)} className="rounded-lg p-6 bg-[#2c2e3b] border-none" value={channelName} />
                    </div>
                    <div>

                        <MultipleSelector className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white" defaultOptions={allContacts} placeholder="Search Contacts" value={selectedContacts} onChange={setSelectedContacts} emptyIndicator={
                            <p className='text-center text-lg leading-10 text-gray-600'>No result found</p>
                        } />
                    </div>
                    <div>
                        <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={createChannel}>Create Channel</Button>
                    </div>

                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CreateChannel

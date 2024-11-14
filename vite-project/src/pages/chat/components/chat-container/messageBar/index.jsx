import { useSocketContext } from '@/context/SocketContext';
import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { UPLOAD_FILE_ROUTE } from '@/utlis/constant';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr"
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
function MessageBar() {
    const [message, setMessage] = useState("");
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocketContext();
    const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppStore()
    const [emojiPickerOpen, setEmpjiPickerOpen] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmpjiPickerOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [emojiRef])
    const handleAddEmoji = async (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }
    const handleSendMessage = async () => {
        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            })
        } else if (selectedChatType === "channels") {
            socket.emit("sent-channel-msg", {
                sender: userInfo.id,
                content: message,
                channelId: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            })
        }
        setMessage("");
    }
    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                setIsUploading(true);
                const resp = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
                    withCredentials: true, onUploadProgress: data => {
                        setFileUploadProgress(Math.round((100 * data.loaded) / data.total))
                    }
                });
                if (resp.status === 200 && resp.data) {
                    setIsUploading(false);
                    if (selectedChatType === "contact") {

                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: resp.data.filePath,
                        })
                    } else if (selectedChatType === "channels") {
                        socket.emit("sent-channel-msg", {
                            sender: userInfo.id,
                            content: undefined,
                            channelId: selectedChatData._id,
                            messageType: "file",
                            fileUrl: resp.data.filePath,
                        })
                    }
                }
            }

        } catch (err) {
            setIsUploading(false)
            console.log("Error", err);
        }
    }
    return (
        <div className='h-[10vh]  bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6'>
            <div className='flex-1  flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 '>
                <input type="text" placeholder='Enter Message' className='flex-1 p-5 bg-transparent rounded-md foucs:border-none focus:outline-none ' value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                    <GrAttachment className='text-2xl' onClick={handleAttachmentClick} />
                </button>
                <input type="file" name="" id="" className='hidden' ref={fileInputRef} onChange={handleAttachmentChange} />
                <div className='relative'>
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all' onClick={() => setEmpjiPickerOpen(true)}>
                        <RiEmojiStickerLine className='text-2xl' />
                    </button>
                    <div className='absolute bottom-16 right-0' ref={emojiRef}>
                        <EmojiPicker theme='dark' open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
                    </div>
                </div>
            </div>
            <button className='bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                <IoSend className='text-2xl' onClick={handleSendMessage} />
            </button>
        </div >
    )
}

export default MessageBar

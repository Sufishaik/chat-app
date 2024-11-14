export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    directMessagesContact: [],
    selectedChatData: undefined,
    selectedChatMessages: [],
    isUploading: false,
    isDownloading: false,
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
    channels: [],
    setChannels: (channels) => set({ channels }),
    setIsUploading: (isUploading) => set({ isUploading }),
    setIsDownloading: (isDownloading) => set({ isDownloading }),
    setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
    setFileDownloadProgress: (fileDownloadProgress) => set({ fileDownloadProgress }),
    setSelectedChatTypes: (selectedChatType) => set({ selectedChatType }),
    setDirectMessagesContact: (directMessagesContact) => set(
        { directMessagesContact }
    ),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    closeChat: () => set({ selectedChatData: undefined, selectedChatType: undefined, selectedChatMessages: [] }),
    addChannel: (channel) => {
        const channels = get().channels;
        set({ channels: [channel, ...channels] })
    },
    addMessage: (message) => {
        const selectedChatMessages = get().selectedChatMessages;
        const selectedChatType = get().selectedChatType;
        set({
            selectedChatMessages: [
                ...selectedChatMessages, {
                    ...message,
                    recipient: selectedChatType === "channels" ? message.recipient : message.recipient._id,
                    sender: selectedChatType === "channels" ? message.sender : message.sender._id,
                }
            ]
        })
    },
    addChannelInChannelList: (message) => {
        const channels = get().channels;
        const data = channels.find((channel) => channel._id === message.channelId);
        const index = channels.findIndex((channel) => channel._id === message.channelId);
        if (index !== -1 && index !== undefined) {
            channels.splice(index, 1);
            channels.unshift(data);
        }
    },
    addContactDMContact: (message) => {
        const userId = get().userInfo.id;
        const fromId = message.sender._id === userId ? message.recipient._id : message.sender._id;
        const fromData = message.sender._id === userId ? message.recipient : message.sender;
        const dmContact = get().directMessagesContact;
        const data = dmContact.find((contact) => contact._id === fromId)
        const index = dmContact.findIndex((contact) => contact._id === fromId);
        if (index !== -1 && index !== undefined) {
            dmContact.splice(index, 1);
            dmContact.unshift(data);
        } else {
            dmContact.unshift(fromData);
        }
        set({ directMessagesContact: dmContact });
    }
})  
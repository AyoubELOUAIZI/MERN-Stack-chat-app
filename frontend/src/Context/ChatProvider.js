import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// create context object
const ChatContext = createContext();

// component that provides the context to other components
const ChatProvider = ({ children }) => {
    // state for the currently selected chat
    const [selectedChat, setSelectedChat] = useState();
    // state for the current user
    const [user, setUser] = useState();
    // state for notifications
    const [notification, setNotification] = useState([]);
    // state for all chats
    const [chats, setChats] = useState();

    // hook to access the react router's history
    const history = useHistory();

    // useEffect hook to check if user is logged in
    useEffect(() => {
        // get user info from local storage
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        // if user is not logged in, redirect to homepage
        if (!userInfo) history.push("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history]);

    // render the provider with the state values
    return (
        <ChatContext.Provider
            value={{
                selectedChat,
                setSelectedChat,
                user,
                setUser,
                notification,
                setNotification,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

// component that allows other components to access the context
export const ChatState = () => {
    return useContext(ChatContext);
};

// default export is the ChatProvider component
export default ChatProvider;

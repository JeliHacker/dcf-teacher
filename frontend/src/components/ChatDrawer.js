import {
  Button,
  CloseButton,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure
} from '@chakra-ui/react';
import React from 'react';
import TeacherChat from './TeacherChat';
import './ChatDrawer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const ChatDrawer = ({ chatHistory, isLoading, userMessage, setUserMessage, sendMessage, ticker }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  return (
    <>
      <div className='chat-tag'
        onClick={onOpen}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onOpen();  // Allows keyboard users to open chat with "Enter" key
          }
        }}
      >
        <i className="fas fa-comments"></i> {/* Chat icon */}
      </div>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
        size='md'
      >
        <DrawerOverlay />
        <DrawerContent className='content'>
          <DrawerCloseButton />

          <TeacherChat
            chatHistory={chatHistory}
            isLoading={isLoading}
            userMessage={userMessage}
            setUserMessage={setUserMessage}
            sendMessage={sendMessage}
            ticker={ticker}
          />
        </DrawerContent>

      </Drawer>
    </>
  )
}

export default ChatDrawer;
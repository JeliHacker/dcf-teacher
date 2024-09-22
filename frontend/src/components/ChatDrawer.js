import {
    Button,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    useDisclosure
} from '@chakra-ui/react';

import React from 'react';
import TeacherChat from './TeacherChat';

const ChatDrawer = ({ chatHistory, isLoading, userMessage, setUserMessage, sendMessage, ticker}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
  
    return (
      <>
        <Button ref={btnRef} colorScheme='teal' onClick={onOpen} size={'xs'}>
          Open Chat
        </Button>
        <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
          finalFocusRef={btnRef}
          size={'full'}
        >
         <DrawerOverlay />
            <DrawerContent className='content'>
                <strong className='instructions'>Press ESC to close</strong>
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
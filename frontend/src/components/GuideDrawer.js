import {
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure
} from '@chakra-ui/react';

import React from 'react';
import GuideComponent from './GuideComponent';

const GuideDrawer = ({ currentSection, sections, navigateToSection }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
  
    return (
      <>
        <Button ref={btnRef} colorScheme='teal' onClick={onOpen} size={'xs'}>
          Open Guide
        </Button>
        <Drawer
          isOpen={isOpen}
          placement='left'
          onClose={onClose}
          finalFocusRef={btnRef}
          size={'xs'}
        >
         <DrawerOverlay />
            <DrawerContent>
                <GuideComponent
                currentSection={currentSection}
                sections={sections}
                navigateToSection={navigateToSection}
                onClose={onClose}
                 />
            </DrawerContent>
        </Drawer>
      </>
    )
  }

  export default GuideDrawer;
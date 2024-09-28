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

      <Button
        ref={btnRef}
        variant="outline"
        onClick={onOpen}
        width="100%"
        height="50px"
        whiteSpace="normal"
        padding="1rem"
        borderWidth="2px"         // Increase the border width
        borderColor="gray.400"     // Darker border color for contrast
        borderStyle="solid"
        _hover={{ backgroundColor: '#E2E8F0' }} // Hover effect
      >
        {currentSection}
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
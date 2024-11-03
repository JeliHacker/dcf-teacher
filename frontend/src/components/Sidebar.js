import { Box, IconButton, VStack, Text } from '@chakra-ui/react';
import { FiHome, FiBarChart2, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    return (
        <Box
            position={'relative'}
            left="0"
            top="0"
            h="100vh"
            bg="gray.200"
            color="white"
            w={isExpanded ? "300px" : "60px"}
            transition="width 0.3s"
            overflow="hidden"
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
        >
            <IconButton
                icon={<FiMenu />}
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
                
                variant="ghost"
                colorScheme="gray"
            />
            <VStack display={'flex'} justifyContent={'center'} spacing="4" align="start" pl={isExpanded ? "4" : "0"}>
                <SidebarItem icon={FiHome} label="Home" isExpanded={isExpanded} />
                <SidebarItem icon={FiBarChart2} label="Analysis" isExpanded={isExpanded} />
                <SidebarItem icon={FiBarChart2} label="Financial Statements" isExpanded={isExpanded} />
            </VStack>
        </Box>
    );
}

function SidebarItem({ icon, label, isExpanded }) {
    return (
        <Box
            display="flex"
            alignItems="center"
            width="100%"
            p="2"
            _hover={{ bg: "gray.400", cursor: "pointer" }}
        >
            <Box as={icon} fontSize="20px" mr={isExpanded ? "3" : "0"} />
            {isExpanded && <Text fontSize="lg">{label}</Text>}
        </Box>
    );
}

export default Sidebar;

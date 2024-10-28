import { Box, Flex, Link, Button, Stack, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.100', 'gray.900');
  const color = useColorModeValue('black', 'white');

  return (
    <Box bg={bg} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box fontWeight="bold" fontSize="lg">DCF Teacher</Box>
        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/browse">Browse</Link>
            <Link href="/tutorials">Tutorials</Link>
            <Link href="/contact">Contact</Link>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar;

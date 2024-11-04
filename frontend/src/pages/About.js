// src/pages/About.js
import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const About = () => {
  return (
    <Box p={8} maxW="900px" mx="auto">
      <VStack spacing={6}>
        <Heading as="h1" size="xl">
          About Our Project
        </Heading>
        <Text fontSize="lg">
          Welcome to our website! This project is dedicated to helping users understand financial analysis through the discounted cash flow (DCF) method. Our aim is to make complex financial concepts accessible and easy to understand for everyone.
        </Text>
        <Text fontSize="md">
          We believe that finance doesn't have to be intimidating, and we're here to guide you through the journey of mastering DCF. Whether you're an experienced investor or just getting started, we provide the tools and resources you need to succeed.
        </Text>
        <Text fontSize="md">
          Thank you for visiting, and we hope you find the content helpful and insightful!
        </Text>
      </VStack>
    </Box>
  );
};

export default About;


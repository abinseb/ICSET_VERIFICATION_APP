import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
const Login = () => {
    const navigation =useNavigation();


  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
           Login
          </Heading>
          <Heading mt="1" _dark={{ color: "warmGray.200" }} color="coolGray.600" fontWeight="medium" size="xs">
            Input the Id to continue!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>User Id</FormControl.Label>
              
                    <Input 
                        // value={inputId}
                        // onChangeText={(value)=>{setInputId(value)}}
                    />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              
                    <Input 
                        // value={inputId}
                        // onChangeText={(value)=>{setInputId(value)}}
                    />
            </FormControl>
            
            <Button mt="2" colorScheme="teal" bg="#1e7898" >
             Login
            </Button>
           
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}

export default Login;
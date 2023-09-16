import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
import { insert_login } from "../../database/Insertion";
import { CheckLoginTable } from "../../database/CheckTableSize";
const Login = () => {
    const navigation =useNavigation();
    const [userId , setUserId] = useState('');
    const [password , setPassword] = useState('');


    const handle_Authentication=()=>{
      // console.log(`login success${userId}"  " ${password}`);
      var k;

      axios.post('http://65.2.137.105:3000/login',{
        userid:userId,password:password
      })
      .then((res)=>{
        const auth = res.data;
        const id = auth.user;
        console.log(auth);
        if(auth.authenticate_status === true){
          console.log("iiiiiidddddd",id);
          insert_login(id);
          alert(auth.message);
          setUserId('');
          setPassword('');
          navigateToSelectRole();
        }
        else{
          alert(auth.message);
        }
      })
      .catch((error)=>{
        console.log("error",error);
      })

const navigateToSelectRole=()=>{
  navigation.navigate("selectRole")
}
    }
  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
           Login
          </Heading>
          <Heading mt="1" _dark={{ color: "warmGray.200" }} color="coolGray.600" fontWeight="medium" size="xs">
            Input the User Id and Password to continue!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>User Id</FormControl.Label>
              
                    <Input 
                        value={userId}
                        onChangeText={(value)=>{setUserId(value)}}
                    />
            </FormControl>
            <FormControl>
              <FormControl.Label>Password</FormControl.Label>
              
                    <Input 
                         value={password}
                        onChangeText={(value)=>{setPassword(value)}}
                        type="password"
                    />
            </FormControl>
            
            <Button mt="2" colorScheme="teal" bg="#1e7898" onPress={handle_Authentication} >
             Login
            </Button>
           
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}

export default Login;
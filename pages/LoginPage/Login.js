import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
import { insert_login ,insertRegistredUserTable ,insertIbmTable,insertGoogleTable} from "../../database/Insertion";
import { CheckLoginTable ,CheckRegTable,CheckIBMTable, CheckGoogleTable} from "../../database/CheckTableSize";
const Login = () => {
    const navigation =useNavigation();
    const [userId , setUserId] = useState('');
    const [password , setPassword] = useState('');


    const handle_Authentication = async () => {
      try {
        // Make the POST request to the authentication endpoint
        const response = await axios.post('http://65.2.172.47/login', {
          userid: userId,
          password: password
        });
    
        const auth = response.data;
        const id = auth.user;
        console.log(auth);
    
        if (auth.authenticate_status === true) {
          console.log("iiiiiidddddd", id);
    
          // Execute these functions in order using await
          await insert_login(id);
          await load_All_Data_And_Navigate();
          await IBM_data_load();
          await load_google_data();
          setUserId('');
          setPassword('');
          alert(auth.message);
          navigateToSelectRole();
        } else {
          alert(auth.message);
        }
      } catch (error) {
        console.error("Error", error);
      }
    };
    

  const navigateToSelectRole=()=>{
    navigation.replace("selectRole")
  }
  const load_All_Data_And_Navigate = async () => {
    try {
      // Check the table row count
      const c = await CheckRegTable();

      console.log('reg data count ===', c);

      if (c === 0) {
        const response = await axios.get(`http://65.2.172.47/users`);
        const userData = response.data;
        await insertRegistredUserTable(userData);
      }

      // Continue with other actions or navigation
      // navigateToReception();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const IBM_data_load = async () => {
    try {
      // Check the table row count
      const c1 = await CheckIBMTable();

      console.log('IBM data count ===', c1);

      if (c1 === 0) {
        const response = await axios.get(`http://65.2.172.47/ibm`);
        const ibmData = response.data;
        await insertIbmTable(ibmData);
      }

      // Continue with other actions
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const load_google_data = async () => {
    try {
      // Check the table row count
      const c2 = await CheckGoogleTable();

      console.log('Google data count ===', c2);

      if (c2 === 0) {
        const response = await axios.get(`http://65.2.172.47/google`);
        const googleData = response.data;
        await insertGoogleTable(googleData);
      }

      // Continue with other actions or navigation
      // navigateToGoogle();
    } catch (error) {
      console.error('Error:', error);
    }
  };



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
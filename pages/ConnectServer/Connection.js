import React, { useEffect, useState } from "react";
import { Box,Heading, VStack, FormControl, Input, Button, Center, NativeBaseProvider,Spinner } from "native-base";
import { useIpContext } from "../IpContext";
import axios from "axios";






const ConnectServer = ({navigation}) => {
  const { addIpAddress, ipAddress } = useIpContext();
  const [ipAddressValue, setIpAddressValue] = useState('');
 

  const ConnectWithServer=()=>{
    axios.get("http://"+ipAddressValue+"/users")
    .then(()=>{
      alert("Server Connected");
      addIpAddress(ipAddressValue);
      console.log(ipAddressValue);
      setIpAddressValue('')
      navigateToSelectUser();
    })
    .catch((error)=>{
      alert("Server Not Connected");
      setIpAddressValue('')
    })
   
  }

  const navigateToSelectUser=()=>{
    navigation.navigate("selectRole");
  }
  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
            Welcome
          </Heading>
          <Heading mt="1" _dark={{ color: "warmGray.200" }} color="coolGray.600" fontWeight="medium" size="xs">
            Input the IP Address to continue!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>IP Address</FormControl.Label>
              <Input
                value={ipAddressValue}
                onChangeText={(value) => setIpAddressValue(value)}
              />
            </FormControl>

            <Button mt="2" colorScheme="teal" bg="#006400" onPress={ConnectWithServer}>
              Connect..
            </Button>
        
            
          </VStack>
          {/* {loading && (
           <Center>
               <Spinner accessibilityLabel="Loading" color="teal.500" size="lg" />
           </Center>
          )}
           */}
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default ConnectServer;

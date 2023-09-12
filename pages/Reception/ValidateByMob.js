import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');
const MobileValidate = () => {
    const navigation =useNavigation();

    var ReceptionqrData;
    const [mobileNumber , setMobileNumber] = useState('');

 // Modify the fetchIdFromServer function to return a promise
const fetchIdFromServer = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("http://65.2.137.105:3000/users")
        .then((res) => {
          const data = res.data;
          const fetchId = data.find((student) => student.phone === mobileNumber);
          if (fetchId) {
            ReceptionqrData = fetchId._id;
            console.log("idddd", fetchId._id);
            resolve(); // Resolve the promise when data is fetched
          } else {
            reject(new Error("ID not found")); // Reject the promise if data is not found
          }
        })
        .catch((error) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT Id FROM registeredUser_table WHERE phone = ?;',
              [mobileNumber],
              (_, { rows }) => {
                const data = rows._array;
                if (data.length > 0) {
                  ReceptionqrData = data[0].Id;
                  console.log("daaaaaa", ReceptionqrData);
                  resolve(); // Resolve the promise when data is fetched
                } else {
                  reject(new Error("ID not found")); // Reject the promise if data is not found
                }
              }
            );
          });
        });
    });
  };
  
  // Update the ValidateInputData function to use async/await
  const ValidateInputData = async () => {
    if (mobileNumber.length === 10) {
      try {
        await fetchIdFromServer(); // Wait for the promise to resolve
        console.log("upppppp", ReceptionqrData);
        navigation.navigate("ValidateReceptionQR", { ReceptionqrData });
      } catch (error) {
        alert("Something went wrong: " + error.message);
      }
    } else {
      ReceptionqrData = mobileNumber;
      navigation.navigate("ValidateReceptionQR", { ReceptionqrData });
    }
  };
  
      
  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
            Welcome
          </Heading>
          <Heading mt="1" _dark={{ color: "warmGray.200" }} color="coolGray.600" fontWeight="medium" size="xs">
            Input the Id OR Mobile Number to continue!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>ID OR Mobile Number </FormControl.Label>
              <Input 
                value={mobileNumber}
                onChangeText={(value)=>{setMobileNumber(value)}}
              />
            </FormControl>
            
            <Button mt="2" colorScheme="teal" bg="#1e7898"  onPress={ValidateInputData}>
              Search..
            </Button>
           
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}

export default MobileValidate;
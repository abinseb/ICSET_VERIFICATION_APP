import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
const IBMInput = () => {
    const navigation =useNavigation();

    const [inputId , setInputId] = useState('');
    var ibmqrdata;
    const ValidateInputData=async()=>{
        // navigation.navigate("ibmvalidate",{ibmqrdata});
        if (inputId.length >10) {
          try {
            await fetchIdFromServer(); // Wait for the promise to resolve
            console.log("upppppp", ibmqrdata);
            navigation.navigate("ibmvalidate", { ibmqrdata });
          } catch (error) {
            alert("Something went wrong: " + error.message);
          }
        } else {
          ibmqrdata = inputId;
          navigation.navigate("ibmvalidate", { ibmqrdata });
        }
      };
    

// fetch id from server 
    const fetchIdFromServer = () => {
      return new Promise((resolve, reject) => {
        axios
          .get("http://65.2.137.105:3000/ibm")
          .then((res) => {
            const data = res.data;
            const fetchId = data.find((student) => student.phone === inputId);
            if (fetchId) {
              ibmqrdata = fetchId._id;
              console.log("idddd", fetchId._id);
              resolve(); // Resolve the promise when data is fetched
            } else {
              reject(new Error("ID not found")); // Reject the promise if data is not found
            }
          })
          .catch((error) => {
            db.transaction((tx) => {
              tx.executeSql(
                'SELECT Id FROM ibm_table WHERE phone = ?;',
                [inputId],
                (_, { rows }) => {
                  const data = rows._array;
                  if (data.length > 0) {
                    ibmqrdata = data[0].Id;
                    console.log("daaaaaa", ibmqrdata);
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
    

  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: "warmGray.50" }}>
            Welcome
          </Heading>
          <Heading mt="1" _dark={{ color: "warmGray.200" }} color="coolGray.600" fontWeight="medium" size="xs">
            Input the Id to continue!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>ID</FormControl.Label>
              <Input 
                value={inputId}
                onChangeText={(value)=>{setInputId(value)}}
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

export default IBMInput;
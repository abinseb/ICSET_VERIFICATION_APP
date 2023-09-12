import * as React from "react";
import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";
import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');
const GoogleInput = () => {
    const navigation =useNavigation();

  var googleqrdata;
  const [inputID , setInputId] = useState('');
    const ValidateInputData=async()=>{
        // navigation.navigate("googleValidate",{googleqrdata});
        if (inputID.length > 10) {
          try {
            await fetchIdFromServer(); // Wait for the promise to resolve
            console.log("upppppp", googleqrdata);
            navigation.navigate("googleValidate", { googleqrdata });
          } catch (error) {
            alert("Something went wrong: " + error.message);
          }
        } else {
          googleqrdata = inputID;
          navigation.navigate("googleValidate", { googleqrdata });
        }
      };
    

  
    const fetchIdFromServer = () => {
      return new Promise((resolve, reject) => {
        axios
          .get("http://65.2.137.105:3000/google")
          .then((res) => {
            const data = res.data;
            const fetchId = data.find((student) => student.phone === inputID);
            if (fetchId) {
              googleqrdata = fetchId._id;
              console.log("idddd", fetchId._id);
              resolve(); // Resolve the promise when data is fetched
            } else {
              reject(new Error("ID not found")); // Reject the promise if data is not found
            }
          })
          .catch((error) => {
            db.transaction((tx) => {
              tx.executeSql(
                'SELECT Id FROM google_table WHERE phone = ?;',
                [inputID],
                (_, { rows }) => {
                  const data = rows._array;
                  if (data.length > 0) {
                    googleqrdata = data[0].Id;
                    console.log("daaaaaa", googleqrdata);
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
            Input the Id OR Mobile Number to continue!
          </Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>ID</FormControl.Label>
              <Input 
                value={inputID}
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

export default GoogleInput;
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,BackHandler} from "react-native";
import { Button } from "react-native-paper";

import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

import {deleteOfflineLunch} from "../../database/Updatadb"
import { openDatabase } from "expo-sqlite";
import {insertOfflineLunch} from "../../database/Insertion";


const db = openDatabase('Registration.db');

const ValidateLunch=({route , navigation})=>{
    const {lunchqrData} = route.params;
    const [network , setNetwork] = useState('');
    const [userData , setUserData ] = useState([])

    const [offlinCount , setOfflineCount] = useState('');

    var c;

  useEffect(()=>{
    offlineDataCountLunch();
    axios.get(`http://65.2.137.105:3000`)
    .then(()=>{
        setNetwork("Online");
        // console.log( getUserById(ipAddress,ReceptionqrData));
            if(c > 0){
                syncOffline_dataToMongo();
            }
            axios.get(`http://65.2.137.105:3000/user/${lunchqrData}`)
            .then((res)=>{
                console.log(res.data);
            
                setUserData(res.data);
            })
            .catch((error)=>{
                console.error("somthing wrong", error);
                alert("user not found");
            })
    
    })
    .catch((err)=>{
        setNetwork("Offline");
        alert("Offline")
        console.log("Offline")
        db.transaction(tx =>{
            tx.executeSql(
                'SELECT * FROM registeredUser_table WHERE Id = ?;',
                [lunchqrData],
                (_ ,{rows}) => {
                    const data = rows._array;
                    if (data.length > 0){ 
                        setUserData(data[0]);
                        console.log(data);
                    }
                }
            )
        })

    })

    
    
       
   
   
    
  },[])

  const handleVerification=()=>{
    if(network === 'Online'){
    axios.put(`http://65.2.137.105:3000/users/${lunchqrData}/lunch`,{lunch:true})
    .then(()=>{
        alert("Verification Success");
        navigateToScan();
        
    })
    .catch((error)=>{
        alert("Verification Failed")
    })
  }
  else{
    console.log("offfline")
    console.log('load to off');
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE registeredUser_table SET lunch = ? WHERE Id = ?;`,
        [true, lunchqrData],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            insertOfflineLunch(lunchqrData);
            alert("Verification Successful");
            navigateToScan();
            
          } else {
            alert("Verification Failed");
          }
        },
        (_, error) => {
          console.error("Error updating Verification:", error);
          alert("Error updating Verification");
        }
      );
    });
  }
}

function offlineDataCountLunch(){
    db.transaction(tx =>{
      tx.executeSql(
        'SELECT COUNT(*) AS rowCount FROM offline_lunch;',
        [],
        (_, { rows }) =>{
          const countData = rows.item(0).rowCount;
          c=countData;
          console.log('Number of count :',countData);
          setOfflineCount(countData);
        },
        (_, error) =>{
          console.error('Error fetching record count:', error);
        }
      );
    });
  };


  const syncOffline_dataToMongo = () => {
    console.log("syc sync syun");
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT Id FROM offline_lunch;',
        [],
        (_, { rows }) => {
          const data = rows._array.map((row) => row.Id);
          console.log("Fetched Id Values:", data);

          // Uncomment and set up Gun.js here if needed

          // Using Axios for data synchronization
          const axiosRequests = data.map((dataItem) => {
            return axios.put(`http://65.2.137.105:3000/users/${dataItem}/lunch`, {
              lunch: true
            });
          });

          Promise.all(axiosRequests)
            .then(() => {
                deleteOfflineLunch();
              alert("Syncing Successful");
              offlineDataCountLunch();
            })
            .catch((error) => {
              alert("Something went wrong");
              console.error(error);
            });
        },
        (_, error) => {
          console.log('Error fetching data', error);
        }
      );
    });
  }

const navigateToScan=()=>{
    navigation.navigate("lunchScan");
}

// avoid the back navigation
useEffect(()=>{
    const handleBackPress =()=>{
        navigateToScan();
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
  
    return ()=>{
      backHandler.remove();
    };
  
  },[]);
   
    return(
        <SafeAreaView style={styles.container}>
               <View style={styles.ViewNetwork}>
                <Text style={styles.networkText}>{network}</Text>
              </View>
              
              {/* {network === 'Online' && (
              <View style={styles.synButtonView}>
              <Button mode="contained" style={styles.synButton} textColor='#000'
                      onPress={deleteOfflineReg} 
                  >
                      Sync
                  </Button>
              </View>
              )} */}

              <View style={styles.ViewCount}>
                <Text style={styles.networkText}>Offline Verified Count :{offlinCount}</Text>
              </View>
            <View style={styles.viewBox}>
                <View style={styles.profileBox}>
                    <Text style={styles.label}>Id: </Text>
                    <Text style={styles.value}>{lunchqrData}</Text>
                </View>
               
                <View style={styles.profileBox}>
                    <Text style={styles.label}>Name: </Text>
                    <Text style={styles.value}>{userData.name}</Text>
                </View>
                <View style={styles.profileBox}>
                    <Text style={styles.label}>Email: </Text>
                    <Text style={styles.value}>{userData.email}</Text>
                </View>
                <View style={styles.profileBox}>
                    <Text style={styles.label}>Institution: </Text>
                    <Text style={styles.value}>{userData.institution}</Text>
                </View>
                <View style={styles.profileBox}>
                    <Text style={styles.label}>MobileNo: </Text>
                    <Text style={styles.value}>{userData.phone}</Text>
                </View>
                
                
                {/* <Text style={styles.label}>Name:{"abin sebastian peejjej"}</Text>
                <Text style={styles.label}>Email:</Text> */}
                {userData["lunch"] ? 
                
                <View style={styles.verifiedView}>
                   
                    <Text style={styles.txtView} >Verified</Text>
                    <Button  style={styles.btnBacktoHome} onPress={navigateToScan}textColor='#fff' mode="contained">Back To Home</Button>
                </View>
                
                
                :  
                <View style={styles.buttonView}>
                  <Button mode="contained" style={styles.verifyButton} 
                      onPress={handleVerification} 
                  >
                      Verify
                  </Button>
                  <Button mode="contained" style={styles.cancelButton} 
                      onPress={navigateToScan} 
                  >
                      Cancel
                  </Button>
                </View>
                } 

                
            </View>
           
        </SafeAreaView>
    )
}

export default ValidateLunch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#1e7898",
    },
    viewBox: {
        justifyContent: 'flex-start',
        alignItems: "center",
        borderRadius: 20,
        elevation: 2,
        padding: 20,
        backgroundColor: "white",
        width:'90%',
        alignSelf:'center',
       
    },
    profileBox:{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    label: {
        fontWeight: "bold",
        color: "#333",
        fontSize:18,
    },
    value:{
        flex:1,
        fontSize:20,
        fontWeight:'bold',
        fontFamily:'sans-serif'
    },
    verifyButton: {
      backgroundColor: "#1e7898",
      marginTop: 20,
  },
  cancelButton: {
      backgroundColor: "#ff0000",
      marginTop: 20,
      marginLeft: 20,
  },
  buttonView: {
      flexDirection: 'row',
      marginTop: 20,
      marginLeft: 50,
  },
  txtView:{
    color:'#006400',
    fontSize:25,
    fontWeight:'900'
  },
  verifiedView:{
    flexDirection:'column',
        alignItems: "center",
        marginTop:20
  },
  btnBacktoHome:{
    backgroundColor:'#1e7898'
  },
  ViewNetwork :{
    alignSelf:'center',
    position:'absolute',
    top:0,
    paddingVertical:20,
  },
  networkText:{
    color:'#fff',
    paddingTop:20,

  },
  ViewCount:{
    alignSelf:'center',
    
    paddingVertical:20,

  },
  synButtonView:{
    alignSelf:'center',
    padding:10,
   
  },
  synButton:{
    backgroundColor:'#ffff',
    marginTop:20,
    

  }
})
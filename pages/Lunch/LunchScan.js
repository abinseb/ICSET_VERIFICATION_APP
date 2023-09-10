
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View,Text ,StyleSheet,} from "react-native";
import { Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";

import {checkConnection} from "../../ServerConnection/Server"
import { useIpContext } from "../IpContext";
import axios from "axios";

import {deleteOfflineReg} from "../../database/Updatadb"

import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');

const LunchScan =({navigation})=>{

    const {ipAddress} = useIpContext();
    const [status , setStatus] = useState('');
    const [offlinCount , setOfflineCount] = useState('');

useEffect(() => {
    offlineDataCountReception();
    axios.get(`http://${ipAddress}`)
    .then(()=>{
        setStatus("Online");
       
    })
    .catch((error)=>{
        setStatus("Offline");
    })
}, []);

function offlineDataCountReception(){
    db.transaction(tx =>{
      tx.executeSql(
        'SELECT COUNT(*) AS rowCount FROM offline_reception;',
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
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT Id FROM offline_reception;',
        [],
        (_, { rows }) => {
          const data = rows._array.map((row) => row.Id);
          console.log("Fetched Id Values:", data);

          // Uncomment and set up Gun.js here if needed

          // Using Axios for data synchronization
          const axiosRequests = data.map((dataItem) => {
            return axios.put(`http://${ipAddress}/users/${dataItem}/verify`, {
              verify: true,
            });
          });

          Promise.all(axiosRequests)
            .then(() => {
              deleteOfflineReg();
              alert("Syncing Successful");
              offlineDataCountReception();
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

    const handleNavigate=()=>{
        navigation.navigate('lunchInput');
    }
    console.log("loaded")
    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.ViewNetwork}>
                <Text style={styles.networkText}>{status}</Text>
              </View>
              <View style={styles.ViewCount}>
                <Text style={styles.networkText}>Offline Verified Count :{offlinCount}</Text>
              </View>
            {status === 'Offline' &&(
            <View style={styles.synButtonView}>
              <Button mode="contained" style={styles.synButton} textColor='#000'
                      onPress={()=>{navigation.navigate("serverConnection")}} 
                  >
                      Connect
                  </Button>
              </View>
              )}
           
            <View style={styles.btnContainer}>
              <Button mode="contained" textColor="black" style={styles.btn}
                onPress={()=>{navigation.navigate("lunchQr")}}
              >Scan</Button>
                
            </View>
            <View style={styles.textClick}>
                <Text style={styles.text1}>If QR won't work?{" "}</Text>
                <TouchableOpacity onPress={handleNavigate} >
                    <Text style={styles.text2}>Click</Text>
                </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    )
}

export default LunchScan;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-evenly',
        backgroundColor:'#1e7898'
        },
   
    btn:{
        backgroundColor:'#f0f8ff',
        
        height:150,
        width:150,
        justifyContent:'center',
        borderRadius:70,
        alignItems:'center',
    },
    btnContainer:{
        margin:20,
        alignSelf:'center'
    },
    textClick: {
        marginLeft: 20,
        alignSelf: 'center',
        bottom: 0,
        position: 'absolute',
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text1: {
        fontSize: 18,
        color: '#000'
    },
    text2: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff'
    },
    synButtonView:{
        alignSelf:'center',
        padding:10,
       
      },
      synButton:{
        backgroundColor:'#ffff',
        marginTop:20,
        
    
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
    
})

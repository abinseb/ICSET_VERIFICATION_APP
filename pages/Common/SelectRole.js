import axios from "axios";
import React, { useState } from "react";
import { View ,StyleSheet,} from "react-native";
import { Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { useIpContext } from "../IpContext";
import {insertRegistredUserTable,insertIbmTable,insertGoogleTable} from "../../database/Insertion";
 import {RegisteredUserTable,Google_Registered_table,Ibm_Registered_table,offlineRegistration,offline_lunch,offline_ibm,offline_google} from "../../database/SQLiteHelper";
import {CheckRegTable , CheckIBMTable,CheckGoogleTable} from '../../database/CheckTableSize';


const SelectRole =({navigation})=>{

    const [regData , setRegData] = useState([])
    const {ipAddress} = useIpContext();

const Reception_data_load=()=>{
    

    RegisteredUserTable();
    offlineRegistration();
    var c;
    console.log("kiiiiiiiiiiii");
    // table count
    CheckRegTable()
  .then(rowCount => {
    c=rowCount;
    console.log('reg data count ===', rowCount);
  })
  .catch(error => {
    console.error('Error:', error);
  });
    axios.get(`http://${ipAddress}/users`)
    .then((res)=>{
    //     console.log(res.data)
    //    setRegData(res.data);
       if(c === 0){
       insertRegistredUserTable(res.data);
        }
        // navigateToReception();

    })
    .catch((error)=>{
        console.error(error);
       
    })
    navigateToReception();
}

const Lunch_load_Data =()=>{
    RegisteredUserTable();
    offline_lunch();
    var c;
    console.log("kiiiiiiiiiiii");
    // table count
    CheckRegTable()
  .then(rowCount => {
    c=rowCount;
    console.log('reg data count ===', rowCount);
  })
  .catch(error => {
    console.error('Error:', error);
  });
    axios.get(`http://${ipAddress}/users`)
    .then((res)=>{
    //     console.log(res.data)
    //    setRegData(res.data);
       if(c === 0){
       insertRegistredUserTable(res.data);
        }
        // navigateToReception();

    })
    .catch((error)=>{
        console.error(error);
       
    })
    NavigateToLunch();
}

    const navigateToReception=()=>{
        navigation.navigate("ReceptionScan");
    }
    const NavigateToLunch=()=>{
        navigation.navigate("lunchScan");
    }

    const navigateToIBM =()=>{
        navigation.navigate("ibmscan");
    }
    const navigateToGoogle =()=>{
        navigation.navigate("googlescan");
    }

const IBM_data_load=()=>{
    Ibm_Registered_table();
    offline_ibm();
    var c1;
    CheckIBMTable()
    .then(rowCount => {
        c1=rowCount;
        console.log('reg data count ===', rowCount);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    axios.get(`http://${ipAddress}/ibm`)
    .then((res)=>{
        if (c1 === 0)
        {
            console.log(res.data);
            insertIbmTable(res.data);
        }
        navigateToIBM();
    })
    .catch((error)=>{
        navigateToIBM();
    })
    
}

const load_google_data=()=>{
    Google_Registered_table();
    offline_google();
    var c2;
    CheckGoogleTable()
    .then(rowCount => {
        c2=rowCount;
        console.log('reg data count ===', rowCount);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    axios.get(`http://${ipAddress}/google`)
    .then((res)=>{
        if (c2 === 0)
        {
            console.log(res.data);
            insertGoogleTable(res.data);
        }
        navigateToGoogle();
    })
    .catch((error)=>{
        navigateToGoogle();
    })
}

    return(
    <SafeAreaView style={styles.container}>
        <View style={styles.bodyContainer}>
            <View style={styles.buttonContainer}>
            <Button style={styles.btn}
                onPress={Reception_data_load}
            >
                Reception
            </Button>
            </View>
            <View style={styles.buttonContainer}>
            <Button style={styles.btn}
                onPress={Lunch_load_Data}
            >
                Lunch
            </Button>
            </View>
            <View style={styles.buttonContainer}>
            <Button style={styles.btn}
                onPress={load_google_data}
            >
                Google
            </Button>
            </View>
            <View style={styles.buttonContainer}>
            <Button style={styles.btn} 
                onPress={IBM_data_load}
            >
                IBM
            </Button>
            </View>
            
        </View>

    </SafeAreaView>
    )
}

export default SelectRole;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-evenly',
        backgroundColor:'#1e7898'
        },
    bodyContainer:{
        alignSelf:'center',
        
    },
    buttonContainer:{
        alignItems:'center',
        margin:10,

    },
    btn:{
        backgroundColor:'#f0f8ff',
        
        height:70,
        width:300,
        justifyContent:'center',
        borderRadius:50,
        alignItems:'center',
    }
})
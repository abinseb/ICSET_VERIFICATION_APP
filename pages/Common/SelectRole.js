import axios from "axios";
import React, { useState } from "react";
import { View ,StyleSheet,} from "react-native";
import { Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { useIpContext } from "../IpContext";
import {insertRegistredUserTable} from "../../database/Insertion";
import {RegisteredUserTable,Google_Registered_table,Ibm_Registered_table,offlineRegistration} from "../../database/SQLiteHelper";
import {CheckRegTable} from '../../database/CheckTableSize';


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


    const navigateToReception=()=>{
        navigation.navigate("ReceptionScan");
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
            <Button style={styles.btn}>
                Lunch
            </Button>
            </View>
            <View style={styles.buttonContainer}>
            <Button style={styles.btn}>
                Google
            </Button>
            </View>
            <View style={styles.buttonContainer}>
            <Button style={styles.btn}>
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
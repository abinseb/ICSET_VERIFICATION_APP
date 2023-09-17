import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { View,Text ,StyleSheet, Image,BackHandler,Alert} from "react-native";
import { Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
// import {RegisteredUserTable,Google_Registered_table,Ibm_Registered_table,offlineRegistration} from "../../database/SQLiteHelper";
// import {insertRegistredUserTable,insertIbmTable,insertGoogleTable} from "../../database/Insertion";
import {CheckRegTable ,CheckLoginTable} from '../../database/CheckTableSize';
import axios from "axios";
import {RegisteredUserTable,Google_Registered_table,Ibm_Registered_table,offlineRegistration ,login,offline_ibm,offline_google} from "../../database/SQLiteHelper";
// import { View, StyleSheet, BackHandler, Alert, TouchableOpacity } from "react-native";

const StartPage=({navigation})=>{

    

    // avoid backnavigation
    const handleBacknavigation=()=>{
        Alert.alert(
            "Exit App",
            "Do you want to exit?",
            [
                {
                    text:"No",
                    onPress:()=>{
                        navigation.navigate("EntryHome");
                    },
                    style:"cancel"
                },
                {
                    text:"Yes",
                    onPress:()=>{
                        BackHandler.exitApp();
                    }
                }
            ],
            {cancelable:false}
        );
        return true;
    };

    useEffect(()=>{
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            handleBacknavigation
        );
        return ()=>{
            backHandler.remove();
        }
    },[navigation]);




// const load_All_Data_And_Navigate=()=>{
//     var c;
//     console.log("kiiiiiiiiiiii");
//     // table count
//     CheckRegTable()
//   .then(rowCount => {
//     c=rowCount;
//     console.log('reg data count ===', rowCount);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
//     axios.get(`http://65.2.137.105:3000/users`)
//     .then((res)=>{
//         // console.log(res.data);
//     //    setRegData(res.data);
//        if(c === 0){
//        insertRegistredUserTable(res.data);
//         }
//         // navigateToReception();

//     })
//     .catch((error)=>{
//         console.error(error);
       
//     })
//     navigateToSelect();
// }

const navigateToSelect = async () => {
  
    console.log("ppppppppp");
    try {
      const c = await CheckLoginTable();
      console.log("login count", c);
      
      if (c > 0) {
        navigation.navigate("selectRole");
      } else {
        navigation.navigate("login");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  


    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image 
                    source={require('../../assets/images.png')}
                    style={styles.img}
                    resizeMode='contain'
                />

            </View>
            <View style={styles.connectButtonContainer}> 
              <Button mode="contained" textColor="black" style={styles.btn}
                onPress={navigateToSelect}
              >Start</Button>
            </View>
            
        </SafeAreaView>
    )
}

export default StartPage;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        backgroundColor:'#1e7898',
        },
    connectButtonContainer:{
        alignSelf:'center',
        margin:30,
    },
    btn:{
        backgroundColor:'#f0f8ff',
        height:50,
        width:130,
        justifyContent:'center',
        borderRadius:10,
        alignItems:'center',
    },
    imageContainer:{
        flex:0.4,
        margin:10,

    },
    img:{
        height:'100%',
        width:'100%'
    },
})
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { View,Text ,StyleSheet, Image,BackHandler,Alert} from "react-native";
import { Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import {RegisteredUserTable,Google_Registered_table,Ibm_Registered_table,offlineRegistration} from "../../database/SQLiteHelper";

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



    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.connectButtonContainer}> 
              <Button mode="contained" textColor="black" style={styles.btn}
                onPress={()=>{navigation.navigate("serverConnection")}}
              >Connect</Button>
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
    },
    btn:{
        backgroundColor:'#f0f8ff',
        height:50,
        width:250,
        justifyContent:'center',
        borderRadius:10,
        alignItems:'center',
    },
})
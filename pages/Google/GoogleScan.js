
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { View,Text ,StyleSheet,Image} from "react-native";
import { Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";


import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');

const GoogleScan =({navigation})=>{
    const [status , setStatus] = useState('');
    const [offlinCount , setOfflineCount] = useState('');

useEffect(() => {
    offlineDataCountGoogle();
    axios.get(`http://65.2.172.47`)
    .then(()=>{
        setStatus("Online");
       
    })
    .catch((error)=>{
        setStatus("Offline");
    })
}, []);

function offlineDataCountGoogle(){
    db.transaction(tx =>{
      tx.executeSql(
        'SELECT COUNT(*) AS rowCount FROM offline_google;',
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


    const handleNavigate=()=>{
        navigation.navigate('googleInput');
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
            <View style={styles.imageGoogle}>
              <Image 
                      source={require('../../assets/ggg.png')}
                      style={styles.imgGoogle}
                      resizeMode='contain'
                  />
            </View>
           
            <View style={styles.btnContainer}>
              <TouchableOpacity  onPress={()=>{navigation.navigate("googleqr")}}>
              <Button mode="contained" textColor="black" style={styles.btn}
               
              ><Text style={{fontSize:20}}>Scan</Text></Button>
            </TouchableOpacity>
                
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

export default GoogleScan;

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
        marginBottom:40,
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
        marginBottom: 20,
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
      imageGoogle:{
        alignSelf:'center',
        
      },
      imgGoogle:{
          height:'40%',
      }
     
    
})

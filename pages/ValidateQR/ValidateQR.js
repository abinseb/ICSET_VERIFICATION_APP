import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,BackHandler} from "react-native";
import { Button } from "react-native-paper";
import Gun from "gun";
import { useIpContext } from "../IpContext";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { openDatabase } from "expo-sqlite";
import { verified_Offline } from "../../database/SQLiteHelper";
import {deleteOfflineReg} from "../../database/Updatadb";
// gun js 
// const [gun, setGun]=(`http://${ip}:5000/gun`);

const ValidateQR = ({ route ,navigation}) => {
    // db connect
    const db = openDatabase('Registration.db');


    const [userob,setuserob] = useState("")
    const { qrData } = route.params;
    // ipaddress
    const {ipAddress} = useIpContext();
    const [connectedAddresses, setConnectedAddresses] = useState([]);
     // check online or Offline
    const [networkStatus , setNetWorkStatus] = useState('');

    // offline verified data count
    const [count , setCount] = useState(0);

    // offline Id
    const [offlineId , setOffLineId] = useState('')
    var c;

    var gun=Gun({
     // peers:['http://192.168.1.126:5000/gun']
    })
    
  

    
    var index="init1234"

 //function acknowlege  network for new user 
 function inituser()
  {
    {
      gun.get(index+"/"+"init").put({"ttft":"u7ygyyg"})
      
    }
  }
 

  function getLocalStorageData(item){
    const storageData = localStorage.getItem(item)
    return storageData;
  }
  
  
  function getuser()
  {

    gun.get(index+'/'+qrData).once((data) =>{
      if ( data === undefined)
      {
        alert ("user not found");
      }
      else{
      setuserob(
        {
          Name: data.Name,
          Institution: data.Institution,
          Email: data.Email,
          Phone: data.Phone,
          Verified: data.Verified
        }
      )
      }
    })
    //getkey()
  }
 const navigateToHome=()=>{
    navigation.navigate("Home");
 }

//  fetching data from gun js

useEffect(() => {
  // fetch offlineverified datacount
  offlineDataCount();
  axios.get(`http://${ipAddress[0]}/gun/`)
    .then(() => {
      setNetWorkStatus('Online');
      // call data count
      console.log("cooooo",count);
      console.log("tempcount :",c);
      // sync data to the gun when network is online
      if(c > 0){
        syncOffline_dataToGun();
        console.log("syncsyncsync");
        }

      const gun1 = Gun({
        peers: [`http://${ipAddress[0]}/gun`]
      });

      gun1.get(index + '/' + qrData).once((data) => {
        if (data === undefined) {
          alert("User not found");
        } else {
          setuserob({
            Name: data.Name,
            Institution: data.Institution,
            Email: data.Email,
            Phone: data.Phone,
            Verified: data.Verified
          });
        }
      });

      gun1.get(index + '/' + qrData).on((data) => {
        
          setuserob({
            Name: data.Name,
            Institution: data.Institution,
            Email: data.Email,
            Phone: data.Phone,
            Verified: data.Verified
          });
        
      });
     
      console.log('Online mode');
    })
    .catch((er) => {
      // alert("Offline mode");
      console.log("Offline");
      setNetWorkStatus('Offline');
      // table
      // verified_Offline();

      // Fetch data from SQLite
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM gun_data WHERE Id = ?;`,
          [qrData],
          (_, { rows }) => {
            const data = rows._array;
            if (data.length > 0) {
              setuserob({
                Name: data[0].Name,
                Institution: data[0].Institution,
                Email: data[0].Email,
                Phone: data[0].Phone,
                Verified: data[0].Verified
              });
             
            } else {
              alert("Data Not Found");
            }
          },
          (_, error) => {
            console.error("Error fetching data from SQLite:", error);
            alert("Error fetching data from SQLite");
          }
        );
      });
    });
}, []);




// insert to offline server
const load_ToOfflineServer = (qrData) => {
  db.transaction((tx) => {
    tx.executeSql(
      'INSERT INTO verified_data (Id) VALUES (?);',
      [qrData],
      (_, { insertId }) => {
        console.log(`Inserted data with id ${insertId}`);
      },
      (error) => {
        console.error('Error inserting', error);
      }
    );
  });
};


const handleVerification=async()=>{
    // alert("succcess");
    if(networkStatus === 'Online'){
    const gun1=Gun({
      peers:[`http://${ipAddress[0]}/gun`]
    })
    try{
      if(userob!=="")
        {await  console.log(gun1.get(index+'/'+qrData).put({"Verified":true}))
        alert("Verification Success");
        navigateToHome();}
        else{
          alert("Invalid user");
          navigateToHome();
        }
    }
    catch(err){
        alert("Somthing Wrong")
    }

  }
  else{

   
    console.log('load to off');
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE gun_data SET Verified = ? WHERE Id = ?;`,
        [true, qrData],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            alert("Verification Successful");
            load_ToOfflineServer(qrData);
            navigateToHome(); // You can add your navigation logic here
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

// sync the updated data id to the gun server
const syncOffline_dataToGun =()=>{
 
  db.transaction(tx =>{
    tx.executeSql(
      `SELECT Id FROM verified_data;`,
      [],
      (_,{rows})=>{
        const data = rows._array.map((row)=>row.Id);
        console.log("Fetched Id Values:",data);

        // syncing code to the gun
        const gun1 = Gun({
          peers:[`http://${ipAddress[0]}/gun`]
        })
          data.forEach(dataItem =>{
            gun1.get(index+'/'+dataItem).put({"Verified":true})
            console.log("synced");
          })
        
          deleteAllDataFromOfflineServer();
          offlineDataCount();
      },
      (_,error)=>{
        console.log('Error fetching data', error);
      }

    );
  });

};

function offlineDataCount(){
  db.transaction(tx =>{
    tx.executeSql(
      'SELECT COUNT(*) AS rowCount FROM verified_data;',
      [],
      (_, { rows }) =>{
        const countData = rows.item(0).rowCount;
        c=countData;
        console.log('Number of count :',countData);
        setCount(countData);
      },
      (_, error) =>{
        console.error('Error fetching record count:', error);
      }
    );
  });
};

function deleteAllDataFromOfflineServer(){
  db.transaction((tx)=>{
    tx.executeSql('DELETE FROM verified_data;',
    [],(_,result)=>{
      if(result.rowsAffected >0){
        console.log('Deleted offline server');
      }
      else{
        console.log("No records")
      }
    }
    );
  });
}


// avoid the back navigation
useEffect(()=>{
  const handleBackPress =()=>{
    navigateToHome();
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

    return (
            <SafeAreaView style={styles.container}>
              <View style={styles.ViewNetwork}>
                <Text style={styles.networkText}>{networkStatus}</Text>
              </View>
              {networkStatus === 'Online' && (
              <View style={styles.synButtonView}>
              <Button mode="contained" style={styles.synButton} textColor='#000'
                      onPress={syncOffline_dataToGun} 
                  >
                      Sync
                  </Button>
              </View>
              )}

              <View style={styles.ViewCount}>
                <Text style={styles.networkText}>Offline Verified Count :{count}</Text>
              </View>
            <View style={styles.viewBox}>
                <View style={styles.profileBox}>
                    <Text style={styles.label}>Id: </Text>
                    <Text style={styles.value}>{qrData}</Text>
                </View>
                <View style={styles.profileBox}>
                    <Text style={styles.label}>Ip: </Text>
                    <Text style={styles.value}>{ipAddress[0]}</Text>
                </View>
                <View style={styles.profileBox}>
                    <Text style={styles.label}>Name: </Text>
                    <Text style={styles.value}>{userob["Name"]}</Text>
                </View>
                <View style={styles.profileBox}>
                    <Text style={styles.label}>Email: </Text>
                    <Text style={styles.value}>{userob["Email"]}</Text>
                </View>
                <View style={styles.profileBox}>
                    <Text style={styles.label}>MobileNo: </Text>
                    <Text style={styles.value}>{userob["Phone"]}</Text>
                </View>
                
                
                {/* <Text style={styles.label}>Name:{"abin sebastian peejjej"}</Text>
                <Text style={styles.label}>Email:</Text> */}
                {userob["Verified"] ? 
                
                <View style={styles.verifiedView}>
                   
                    <Text style={styles.txtView} >Verified</Text>
                    <Button  style={styles.btnBacktoHome} onPress={navigateToHome}textColor='#fff' mode="contained">Back To Home</Button>
                </View>
                
                
                :  
                <View style={styles.buttonView}>
                  <Button mode="contained" style={styles.verifyButton} 
                      onPress={handleVerification} 
                  >
                      Verify
                  </Button>
                  <Button mode="contained" style={styles.cancelButton} 
                      onPress={()=>{navigation.navigate("ReceptionScan")}} 
                  >
                      Cancel
                  </Button>
                </View>
                }

                
            </View>
           
        </SafeAreaView>

        
        
    );
};

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
});

export default ValidateQR;

import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, BackHandler, Alert, TouchableOpacity } from "react-native";
import { Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckIBMTable, CheckGoogleTable } from '../../database/CheckTableSize';
import { deleteLogin, deleteOfflineIbm, deleteOfflineGoogle, deleteOfflineReg } from "../../database/Updatadb";
import { GetUserID } from "../../database/RespondId";
import { openDatabase } from "expo-sqlite";

const db = openDatabase('Registration.db');

const SelectRole = ({ navigation }) => {

  const Reception_data_load = () => {
    navigateToReception();
  }

  const navigateToReception = () => {
    navigation.navigate("ReceptionScan");
  }

  const navigateToIBM = () => {
    navigation.navigate("ibmscan");
  }
  const navigateToGoogle = () => {
    navigation.navigate("googlescan");
  }
  const navigateToCollege = () => {
    navigation.navigate("collegelist");
  }

  const IBM_data_load = async () => {
    try {
      const rowCount = await CheckIBMTable();
      console.log('reg data count ===', rowCount);
      // if (rowCount > 0) {
        navigateToIBM();
      // } else {
        // alert("No IBM data available.");
      }
    // } 
    catch (error) {
      console.error('Error:', error);
    }
  }

  const load_google_data = async () => {
    try {
      const rowCount = await CheckGoogleTable();
      // console.log('reg data count ===', rowCount);
      // if (rowCount > 0) {
        navigateToGoogle();
      // } else {
      //   alert("No Google data available.");
      // }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const College_load_data = () => {
    navigateToCollege();
  }

  const syncAllData = async () => {
    try {
      const uid = await GetUserID();
      console.log(uid);
      await offlineDataCountReception(uid);
      await offlineDataCountgoogle(uid);
      await offlineDataCountIBM(uid);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const offlineDataCountReception = async (uid) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) AS rowCount FROM offline_reception;',
          [],
          (_, { rows }) => {
            const countData = rows.item(0).rowCount;
            console.log('Number of count :', countData);
            if (countData > 0) {
              syncOffline_dataToMongo_Reception(uid)
                .then(() => resolve())
                .catch(reject);
            } else {
              alert("Nothing to sync in Reception");
              resolve();
            }
          },
          (_, error) => {
            console.error('Error fetching record count:', error);
            reject(error);
          }
        );
      });
    });
  };

  const syncOffline_dataToMongo_Reception = (uid) => {
    return new Promise((resolve, reject) => {
      console.log("syc sync syun");
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT Id FROM offline_reception;',
          [],
          (_, { rows }) => {
            const data = rows._array.map((row) => row.Id);
            console.log("Fetched Id Values:", data);

            const axiosRequests = data.map((dataItem) => {
              return axios.put(`http://65.2.172.47/users/${dataItem}/verify`, {
                verify: true, userid: uid
              });
            });

            Promise.all(axiosRequests)
              .then(() => {
                deleteOfflineReg();
                alert("  Reception Syncing Successful");
              })
              .catch((error) => {
                alert("Please Check Your Internet Connection");
                console.error(error);
                reject(error);
              });
          },
          (_, error) => {
            console.log('Error fetching data', error);
            reject(error);
          }
        );
      });
    });
  }

  const offlineDataCountgoogle = async (uid) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) AS rowCount FROM offline_google;',
          [],
          (_, { rows }) => {
            const countData = rows.item(0).rowCount;
            console.log('Number of count :', countData);
            if (countData > 0) {
              syncOffline_dataToMongo_google(uid)
                .then(() => resolve())
                .catch(reject);
            } else {
              alert("Nothing to Sync in Google");
              resolve();
            }
          },
          (_, error) => {
            console.error('Error fetching record count:', error);
            reject(error);
          }
        );
      });
    });
  };

  const syncOffline_dataToMongo_google = (uid) => {
    return new Promise((resolve, reject) => {
      console.log("syc sync syun");
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT Id FROM offline_google;',
          [],
          (_, { rows }) => {
            const data = rows._array.map((row) => row.Id);
            console.log("Fetched Id Values:", data);

            const axiosRequests = data.map((dataItem) => {
              return axios.put(`http://65.2.172.47/google/${dataItem}/verify`, {
                verify: true, userid: uid
              });
            });

            Promise.all(axiosRequests)
              .then(() => {
                deleteOfflineGoogle();
                alert("Google Syncing Successful");
                
              })
              .catch((error) => {
                alert("Please Check your Connection");
                console.error(error);
                reject(error);
              });
          },
          (_, error) => {
            console.log('Error fetching data', error);
            reject(error);
          }
        );
      });
    });
  }

  const offlineDataCountIBM = async (uid) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) AS rowCount FROM offline_ibm;',
          [],
          (_, { rows }) => {
            const countData = rows.item(0).rowCount;
            console.log('Number of count :', countData);
            if (countData > 0) {
              syncOffline_dataToMongo_IBM(uid)
                .then(() => resolve())
                .catch(reject);
            } else {
              alert("Nothing to Sync in IBM");
              resolve();
            }
          },
          (_, error) => {
            console.error('Error fetching record count:', error);
            reject(error);
          }
        );
      });
    });
  };

  const syncOffline_dataToMongo_IBM = (uid) => {
    return new Promise((resolve, reject) => {
      console.log("syc sync syun");
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT Id FROM offline_ibm;',
          [],
          (_, { rows }) => {
            const data = rows._array.map((row) => row.Id);
            console.log("Fetched Id Values:", data);

            const axiosRequests = data.map((dataItem) => {
              return axios.put(`http://65.2.172.47/ibm/${dataItem}/verify`, {
                verify: true, userid: uid,
              });
            });

            Promise.all(axiosRequests)
              .then(() => {
                deleteOfflineIbm();
                alert("IBM Syncing Successful");
              })
              .catch((error) => {
                alert("Please Check Your Connection");
                console.error(error);
                reject(error);
              });
          },
          (_, error) => {
            console.log('Error fetching data', error);
            reject(error);
          }
        );
      });
    });
  }



  const logout_user = () => {
    deleteLogin();
    navigateToEnty();
  }

  const navigateToEnty = () => {
    navigation.navigate("EntryHome");
  }
 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoutView}>
        <Button mode="contained" style={styles.btnlogout} onPress={logout_user}>
          Logout
        </Button>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={Reception_data_load}>
            <Button style={styles.btn}>
              Reception
            </Button>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={load_google_data}>
            <Button style={styles.btn}>
              Google
            </Button>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={IBM_data_load}>
            <Button style={styles.btn}>
              IBM
            </Button>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={College_load_data}>
            <Button style={styles.btn}>
              Bulk Registration
            </Button>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.syncButtonView}>
        <Button style={styles.btnsync} onPress={syncAllData}>
          Sync
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default SelectRole;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: '#1e7898'
  },
  bodyContainer: {
    alignSelf: 'center',

  },
  buttonContainer: {
    alignItems: 'center',
    margin: 10,

  },
  btn: {
    backgroundColor: '#f0f8ff',

    height: 70,
    width: 300,
    justifyContent: 'center',
    borderRadius: 50,
    alignItems: 'center',
  },
  logoutView: {
    top: 0,
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingTop: 20,
  },
  btnlogout: {
    marginTop: 20,
    marginRight: 10,
    backgroundColor: '#778899',
    borderRadius: 10,
  },
  syncButtonView: {
    bottom: 0,
    position: 'absolute',
    paddingBottom: 10,
    alignSelf: 'center',
  },
  btnsync:{
    backgroundColor:'#ffff'
  }
})

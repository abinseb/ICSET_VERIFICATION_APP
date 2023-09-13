import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList ,ScrollView} from "react-native";
import { Button, Checkbox as PaperCheckbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from 'axios';
import {deleteOfflineReg} from "../../database/Updatadb"
import { openDatabase } from "expo-sqlite";
import {insert_Reg} from "../../database/Insertion";


const db = openDatabase('Registration.db');

const CollegeValidate = ({ route, navigation }) => {
    const { selectedData } = route.params;
    const [studentlist, setStudentList] = useState([]);
    const [network, setNetwork] = useState('');
    const [selectAll, setSelectAll] = useState(true); // Initially set to true to select all checkboxes
    const [checkedIds, setCheckedIds] = useState([]); 
    // Initialize the studentlist with all students as checked when the component mounts
    const [offlinCount , setOfflineCount] = useState('');

    var c;
    useEffect(() => {
        offlineDataCountReception();
        axios.get('http://65.2.137.105:3000')
            .then(() => {
                setNetwork("Online")
                if(c > 0){
                    syncOffline_dataToMongo();
                }
                axios.get("http://65.2.137.105:3000/users")
                    .then((res) => {
                        const data = res.data;

                        // Filter students based on the condition
                        const filteredStudents = data.filter((student) => student.institution === selectedData);

                        setStudentList(filteredStudents.map((student) => ({ ...student, checked: selectAll })));
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            })
            .catch((err) => {
                console.log("offline");
                setNetwork("Offline");
                db.transaction(tx => {
                    tx.executeSql(
                        'SELECT * FROM registeredUser_table WHERE institution = ?;',
                        [selectedData],
                        (_, { rows }) => {
                            const data = rows._array.map(row => ({ _id: row.Id, name: row.name, checked: selectAll }));
                            if (data.length > 0) {
                                setStudentList(data);
                                console.log("offline", data);
                            }
                        }
                    );
                });
            })
    }, [selectedData, selectAll]);

    // Function to toggle the checkbox state for a student
    const toggleCheckbox = (studentId) => {
        setStudentList((prevStudents) => {
            return prevStudents.map((student) => {
                if (student._id === studentId) {
                    return { ...student, checked: !student.checked };
                }
                return student;
            });
        });
    };

    // Render each item in the FlatList
    const renderItem = ({ item }) => (
      <View  style={styles.itemContainer}>
        <PaperCheckbox.Item
          status={item.checked ? 'checked' : 'unchecked'}
          onPress={() => toggleCheckbox(item._id)}
        />
        <ScrollView>
          <Text>{item.name}</Text>
          <Text>{item.email}</Text>
          <Text>{item.phone}</Text>
        </ScrollView>
      </View>
    );

    

    const handle_Verification=()=>{
        const checkedIdsArray = studentlist
        .filter((student) => student.checked)
        .map((student) => student._id);
    
    console.log("Checked IDs:", checkedIdsArray);
    setCheckedIds(checkedIdsArray);
    console.log("network status",network)
    if (network === 'Online') {
        console.log("Network is online"); // Check network status
      
      const axiosRequest = checkedIdsArray.map((dataId) => {
          return axios.put(`http://65.2.137.105:3000/users/${dataId}/verify`, {
            verify: true,
          });
        });
      
        // Log checkedIdsArray for verification
        console.log("Checked IDs Array:", checkedIdsArray);
      
        Promise.all(axiosRequest)
          .then(() => {
            alert("Updated Successful");
            navigateToCollege();
          })
          .catch((error) => {
            alert("Something went wrong");
            console.error(error);
          });
      } 
      
     else {
        // alert("Network is offline");
        const dbRequest = checkedIdsArray.map((dataId) => {
          return new Promise((resolve, reject) => {
            db.transaction((tx) => {
              tx.executeSql(
                `UPDATE registeredUser_table SET verify = ? WHERE Id = ?;`,
                [true, dataId],
                (_, { rowsAffected }) => {
                  if (rowsAffected > 0) {
                    // Assuming you have an insert_Reg function here
                    insert_Reg(dataId);
                    resolve();
                  } else {
                    reject(new Error(`No rows updated for ID ${dataId}`));
                  }
                },
                (_, error) => {
                  reject(error);
                }
              );
            });
          });
        });
      
        Promise.all(dbRequest)
          .then(() => {
            alert("Successful");
            navigateToCollege();
          })
          .catch((error) => {
            alert("Something went wrong");
            console.error(error);
          });
      }
      
      
    }
    // syncing
    const syncOffline_dataToMongo = () => {
        console.log("syc sync syun");
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
                return axios.put(`http://65.2.137.105:3000/users/${dataItem}/verify`, {
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

// offline data count
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
// navigate
    const navigateToCollege=()=>{
        navigation.navigate("selectRole");
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.networkStatus}>
                <Text style={styles.networkText}>{network}</Text>
                <Text style={styles.networkText}>Offline Verified Count :{offlinCount}</Text>
            </View>

            <View style={styles.viewBox}>
                <Text style={styles.collegeText}>{selectedData}</Text>

                <FlatList
                    style={styles.FlatlistData}
                    data={studentlist}
                    renderItem={renderItem}
                    keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                />

                <Button mode="contained" style={styles.verifyButton} onPress={handle_Verification}>
                    Verify
                </Button>
              
            </View>
        </SafeAreaView>
    );
}

export default CollegeValidate;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#1e7898",
    },
    checkboxContainer: {
        marginBottom: 5,
    },
    viewBox: {
        justifyContent: 'flex-start',
        alignItems: "center",
        borderRadius: 20,
        elevation: 1,
        padding: 20,
        backgroundColor: "white",
        width: '90%',
        alignSelf: 'center',
        paddingBottom: 20,
        height: '80%'
    },
    FlatlistData: {
        padding: 10,
        width: '100%',
        alignSelf: 'flex-start',
        backgroundColor: "white",
    },
    verifyButton: {
        backgroundColor: "#1e7898",
        marginTop: 20,
    },
    networkStatus: {
        alignSelf: 'center',
        paddingBottom: 20,
    },
    networkText: {
        color: '#ffff',
        fontWeight: '700'
    },
    collegeText: {
        fontWeight: '700',
    },
    itemContainer: {
      flexDirection: 'row', // To align checkbox, name, and email horizontally
      // alignItems: 'center', // To vertically center the checkbox and text
      marginVertical: 8, // Adjust this for spacing between items
    },
    textContainer: {
      marginLeft: 16, // Adjust this for spacing between checkbox and text
    },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl, // Import RefreshControl
} from "react-native";
import { Button, Checkbox as PaperCheckbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { deleteOfflineReg } from "../../database/Updatadb";
import { openDatabase } from "expo-sqlite";
import { insert_Reg } from "../../database/Insertion";
import { GetUserID } from "../../database/RespondId";

const db = openDatabase('Registration.db');

const CollegeValidate = ({ route, navigation }) => {
  const { selectedData } = route.params;
  const [studentlist, setStudentList] = useState([]);
  const [network, setNetwork] = useState('');
  const [selectAll, setSelectAll] = useState(true); // Initially set to true to select all checkboxes
  const [checkedIds, setCheckedIds] = useState([]);
  // Initialize the studentlist with all students as checked when the component mounts
  const [offlinCount, setOfflineCount] = useState('');

  const [verifiedCount, setVerifiedCount] = useState(0);
  const [notVerifiedCount, setNotVerifiedCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const [userId , setUserId] = useState('');

  var c;
  var uid;
  useEffect(() => {
    offlineDataCountReception();
    fetchData(); // Fetch initial data
  }, [selectedData, selectAll]);

  // Function to fetch data
  const fetchData = () => {
    GetUserID()
    .then(id =>{
          uid = id;
          console.log("userrrrr",userId);
          setUserId(id);
    })
    .catch(error =>{
      console.error('Error:', error);
  })
    setRefreshing(true); // Start refreshing indicator

    axios.get('http://65.2.172.47')
      .then(() => {
        setNetwork("Online");
        if (c > 0) {
          syncOffline_dataToMongo(uid);
        }
        axios.post('http://65.2.172.47/getUsersByInstitution',{
          institution:selectedData,
        })
          .then((res) => {
            const dataStudent = res.data;
            console.log("stttt",dataStudent);
            // Filter students based on the condition
            const filteredStudents = dataStudent.filter((student) => student.verify === false);

            setStudentList(filteredStudents.map((student) => ({ ...student, checked: selectAll })));
            const verifiedStudents = dataStudent.filter((student) => student.verify === true);
            setNotVerifiedCount(filteredStudents.length);
            setVerifiedCount(verifiedStudents.length);
            setRefreshing(false); // Stop refreshing indicator
          })
          .catch((error) => {
            console.error("Error:", error);
            setRefreshing(false); // Stop refreshing indicator if there's an error
          });
      })
      .catch((err) => {
        console.log("offline");
        setNetwork("Offline");
        verifiedCount_Offline();
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM registeredUser_table WHERE institution = ? AND verify = ? ;',
            [selectedData, false],
            (_, { rows }) => {
              const data = rows._array.map(row => ({ _id: row.Id, name: row.name,phone:row.phone,email:row.email, checked: selectAll }));
              if (data.length > 0) {
                setStudentList(data);
                console.log("offline", data);
                setNotVerifiedCount(data.length);
              }
              setRefreshing(false); // Stop refreshing indicator
            }
          );
        });
      });
  };



  const verifiedCount_Offline = () => {
    console.log("joiiiiiiii");
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) AS verifiedCount FROM registeredUser_table WHERE institution = ? AND verify = ?;',
        [selectedData, true],
        (_, { rows }) => {
          const { verifiedCount } = rows.item(0); // Get the count from the first row
          setVerifiedCount(verifiedCount);
        },
        (_, error) => {
          console.error('Error fetching verified count:', error);
        }
      );
    });
  };
  
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
    <View style={styles.itemContainer}>
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

  const handleRefresh = () => {
    fetchData(); // Call the fetchData function to refresh the data
  };

  const handle_Verification = (userId) => {
    const checkedIdsArray = studentlist
      .filter((student) => student.checked)
      .map((student) => student._id);

    console.log("Checked IDs:", checkedIdsArray);
    var k = checkedIdsArray.length;
    setCheckedIds(checkedIdsArray);
    console.log("network status", network);
    if (network === 'Online') {
      console.log("Network is online"); // Check network status

      const axiosRequest = checkedIdsArray.map((dataId) => {
        return axios.put(`http://65.2.172.47/users/${dataId}/verify`, {
          verify: true,userid:userId
        });
      });

      // Log checkedIdsArray for verification
      console.log("Checked IDs Array:", checkedIdsArray);
      
      Promise.all(axiosRequest)
        .then(() => {
          alert(`${selectedData}${' '}${k}${' '}Students are Verified`);
          navigateToCollege();
        })
        .catch((error) => {
          alert("Please check your Connection");
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
      var l = checkedIdsArray.length;
      Promise.all(dbRequest)
        .then(() => {
          alert(`${selectedData}${' '}${l}${' '}Students are Verified`);
          navigateToCollege();
        })
        .catch((error) => {
          alert("Something went wrong");
          console.error(error);
        });
    }
  }

  // syncing
  const syncOffline_dataToMongo = (uid) => {
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
            console.log(dataItem);
            return axios.put(`http://65.2.172.47/users/${dataItem}/verify`, {
              verify: true,userid:uid
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
  function offlineDataCountReception() {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) AS rowCount FROM offline_reception;',
        [],
        (_, { rows }) => {
          const countData = rows.item(0).rowCount;
          c = countData;
          console.log('Number of count:', countData);
          setOfflineCount(countData);
        },
        (_, error) => {
          console.error('Error fetching record count:', error);
        }
      );
    });
  }

  // navigate
  const navigateToCollege = () => {
    navigation.navigate("collegelist");
  }

  const navigateToPresentList = () => {
    navigation.navigate("presentStudent", { selectedData })
  }

  const navigateToAbsentList = () => {
    navigation.navigate("absentStudent", { selectedData });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonView}>
       
        <Button mode="contained" textColor="black" style={styles.absentButton}
          onPress={navigateToAbsentList}
        >
          Not Verified
        </Button>
        <Button mode="contained" textColor="black" style={styles.CollegeverifyButton}
          onPress={navigateToPresentList}
        >
          Verified List
        </Button>
      </View>
      <View style={styles.networkStatus}>
        <Text style={styles.networkText}>{network}</Text>
      </View>

      <View style={styles.viewBox}>
        <Text style={styles.collegeText}>{selectedData}</Text>
        <View style={styles.statusText}>
          <Text style={styles.txtsts}>Verified  :{verifiedCount}</Text>
          <Text style={styles.txtsts}>Not Verified :{notVerifiedCount}</Text>

        </View>

        <FlatList
          style={styles.FlatlistData}
          data={studentlist}
          renderItem={renderItem}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          refreshControl={ // Add RefreshControl component here
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        />

        <Button mode="contained" style={styles.verifyButton} onPress={()=>{handle_Verification(userId)}}>
          Verify
        </Button>

      </View>
      <View style={styles.offlineCount}>
        <Text style={styles.networkText}>Offline Verified Count :{offlinCount}</Text>
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
    marginVertical: 8,
  },
  textContainer: {
    marginLeft: 16,
  },
  offlineCount: {
    bottom: 0,
    position: 'absolute',
    alignSelf: 'center'
  },
  CollegeverifyButton: {
    backgroundColor: "#abdbe3",
    marginTop: 20,
  },
  absentButton: {
    backgroundColor: "#e3b3ab",
    marginTop: 20,
    marginRight: 20,
  },
  buttonView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    top: 0,
    position: 'absolute',
    alignSelf: 'center'
  },
  statusText: {
    alignSelf: 'center',
    padding: 5,
  },
  txtsts: {
    fontWeight: '500'
  }
});

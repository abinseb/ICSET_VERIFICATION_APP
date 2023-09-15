import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';

import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');

const Collgelist = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const handleItemSelected = (item) => {
    setSelectedData(item.name);
    navigateToCollegeValidate(item.name);
  };

  const navigateToCollegeValidate = (selectedCollege) => {
    navigation.navigate('collegeverified', { selectedData: selectedCollege });
  };
  var c;

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT DISTINCT institution FROM registeredUser_table;',
        [],
        (_, { rows }) => {
          const data = rows._array.map(row => ({ name: row.institution }));
          if (data.length > 0) {
            setItems(data);
          }
        }
      );
    });
  }, []);


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
          console.log(dataItem);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.titleText}>ICSET Registered College List</Text>
        <SearchableDropdown
          onTextChange={(text) => console.log(text)}
          onItemSelect={handleItemSelected}
          containerStyle={{ padding: 5 }}
          textInputStyle={{
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#FAF7F6',
          }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: '#FAF9F8',
            borderColor: '#bbb',
            borderWidth: 1,
          }}
          itemTextStyle={{
            color: '#222',
          }}
          itemsContainerStyle={{
            maxHeight: '60%',
          }}
          items={items}
          defaultIndex={2}
          placeholder="Select a college"
          resetValue={false}
          underlineColorAndroid="transparent"
        />
      </View>
    </SafeAreaView>
  );
};

export default Collgelist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headingText: {
    padding: 8,
  },
});

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

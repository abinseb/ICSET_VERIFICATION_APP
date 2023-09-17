import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ScrollView,
  
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from 'axios';
import { Button } from "react-native-paper";
import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');

const AbsentStudentList = ({ route, navigation }) => {
  const { selectedData } = route.params;
  const [studentlist, setStudentList] = useState([]);

  useEffect(() => {
    axios.get("http://65.2.172.47/users")
      .then((res) => {
        const data = res.data;

        // Filter students based on the condition
        const filteredStudents = data.filter((student) => student.institution === selectedData && student.verify === false);

        // Group students by name for SectionList
        const groupedStudents = groupBy(filteredStudents, "name");

        // Convert groupedStudents to an array for SectionList data
        const sectionListData = Object.keys(groupedStudents).map((name) => ({
          title: name,
          data: groupedStudents[name],
        }));

        setStudentList(sectionListData);
      })
      .catch((error) => {
        alert("offline , Please Check Your Connection");
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM registeredUser_table WHERE institution = ? AND verify = ? ;',
            [selectedData, false],
            (_, { rows }) => {
              const data = rows._array;
              if (data.length > 0) {
                const groupedStudents = groupBy(data, "name");
      
                // Convert groupedStudents to an array for SectionList data
                const sectionListData = Object.keys(groupedStudents).map((name) => ({
                  title: name,
                  data: groupedStudents[name],
                }));
      
                setStudentList(sectionListData);
              }
            }
          );
        });
      });

  }, []);

  // Function to group items by a key
  const groupBy = (items, key) => {
    return items.reduce((result, item) => {
      (result[item[key]] = result[item[key]] || []).push(item);
      return result;
    }, {});
  };

  // Render each item in the SectionList
  const renderItem = ({ item }) => (
    <ScrollView horizontal={true} style={styles.itemContainer}>
      <View style={styles.dataText}>
      <Text >{item.email}</Text>
      <Text>{item.phone}</Text>
      </View>
      
    </ScrollView>
  );

  // Render the section header with bold name
  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  // navigate
  const navigateBack = () => {
    navigation.navigate("collegeverified",{selectedData})
  };

    // Calculate the total count of students based on IDs
    const getTotalCount = () => {
      let totalCount = 0;
      for (const section of studentlist) {
        totalCount += section.data.length;
      }
      return totalCount;
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewCount}>
        <Text style={styles.countText}>Absent Count :{getTotalCount()}</Text>
      </View>
      <View style={styles.viewBox}>
        <Text style={styles.collegeText}>{selectedData}</Text>

        <SectionList
          style={styles.FlatlistData}
          sections={studentlist}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item._id}
        />
        <View style={styles.buttonBack}>
          <Button mode="contained" style={styles.btnback}
            onPress={navigateBack}
          >Back</Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AbsentStudentList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#abdbe3",
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
  // verifyButton: {
  //   backgroundColor: "#1e7898",
  //   marginTop: 20,
  // },
  // networkStatus: {
  //   alignSelf: 'center',
  //   paddingBottom: 20,
  // },
  collegeText: {
    fontWeight: '700',
  },
  itemContainer: {
    flexDirection: 'row', // To align checkbox, name, and email horizontally
    // marginVertical: 8, // Adjust this for spacing between items
  },
  // textContainer: {
  //   marginLeft: 16, // Adjust this for spacing between checkbox and text
  // },
  sectionHeader: {
    backgroundColor: "#e1e1e1", // Customize section header background color
    padding: 10,
  },
  sectionHeaderText: {
    fontWeight: "bold",
  },
  dataText:{
    padding:10,

  },
  viewCount:{
    top:0,
    position:'absolute',
    alignSelf:'center',
    paddingTop:30,
  },
  countText:{
    fontSize:20,
    fontWeight:'700'
  },
  buttonBack:{
    marginTop:10,
    alignSelf:'center',
  },
  btnback:{
    backgroundColor:'#1e90ff'
  }
});

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Button, Checkbox as PaperCheckbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from 'axios';
import { openDatabase } from "expo-sqlite";

const db = openDatabase('Registration.db');

const CollegeValidate = ({ route, navigation }) => {
    const { selectedData } = route.params;
    const [studentlist, setStudentList] = useState([]);
    const [network , setNetwork] = useState('');

    useEffect(() => {
        axios.get('http://65.2.137.105:3000')
        .then(()=>{
            setNetwork("Online")
            axios.get("http://65.2.137.105:3000/users")
            .then((res) => {
                const data = res.data;

                // Filter students based on the condition
                const filteredStudents = data.filter((student) => student.institution === selectedData);
                
                setStudentList(filteredStudents);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        })
        .catch((err)=>{
            console.log("offline");
            setNetwork("Offline");
            db.transaction(tx => {
                tx.executeSql(
                  'SELECT * FROM registeredUser_table WHERE institution = ?;',
                  [selectedData],
                  (_, { rows }) => {
                    const data = rows._array.map(row => ({ id: row.id, name: row.name, checked: false }));
                    if (data.length > 0) {
                        setStudentList(data);
                        console.log("offline", data);
                    }
                  }
                );
              });
        })
    }, [selectedData]); // Include selectedData in the dependency array

    // Function to toggle the checkbox state for a student
    const toggleCheckbox = (studentId) => {
        setStudentList((prevStudents) => {
            return prevStudents.map((student) => {
                if (student.id === studentId) {
                    return { ...student, checked: !student.checked };
                }
                return student;
            });
        });
    };

    // Render each item in the FlatList
const renderItem = ({ item }) => (
    <View style={styles.checkboxContainer}>
        <PaperCheckbox.Item
            label={item.name}
            status={item.checked ? 'checked' : 'unchecked'}
            onPress={() => toggleCheckbox(item.id)}
        />
    </View>
);

    return (
        <SafeAreaView style={styles.container}>
        <Text>{network}</Text>
        
        {/* Use FlatList to render the list of students */}
        <View style={styles.viewBox}>
        <Text>{selectedData}</Text>
            <FlatList
                style={styles.FlatlistData}
                data={studentlist}
                renderItem={renderItem}
                keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
            />
            
                  <Button mode="contained" style={styles.verifyButton} 
                     
                  >
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
        elevation: 2,
        padding: 20,
        backgroundColor: "white",
        width:'90%',
        alignSelf:'center',
        paddingBottom:20,
        height:'80%'
       
    },
    FlatlistData:{
        
        padding: 10, // Adjust padding as needed
        width: '80%', // Use 100% width
        alignSelf: 'center',
        backgroundColor: "white",
       
    },
    verifyButton: {
        backgroundColor: "#1e7898",
        marginTop: 20,
    },
});

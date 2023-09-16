import axios from "axios";
import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');

export const UpdateRegisteredTableBackground = () => {
  console.log("hooiiiiii")
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT MAX(time) AS max_timestamp FROM registeredUser_table;',
      [],
      (_, { rows }) => {
        const data = rows._array;
        const maxTimeStamp = data[0].max_timestamp;
        console.log("maxxxxiiii",maxTimeStamp); // Correct the typo in maxTimeStamp

        // Make a POST request to the server with maxTimeStamp in the request body

        axios
          .post('http://65.2.137.105:3000/time-sync', {
            maxtime: maxTimeStamp,
          })
          .then((res) => {
            const responseData = res.data;
            console.log(res.data);
            const idArray = responseData.data.map((item) => item._id);
            const time = responseData.maxtime;
            console.log(idArray, time);

            // Update records in the database
            db.transaction((tx) => {
              idArray.forEach((id) => {
                tx.executeSql(
                  `UPDATE registeredUser_table SET verify = ?, time = ? WHERE Id = ?;`,
                  [true, time, id],
                  (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                      console.log(`Updated record with Id: ${id}`);
                    } else {
                      console.log(`No rows updated for Id: ${id}`);
                    }
                  },
                  (_, error) => {
                    console.error(`Error updating record with Id: ${id}`, error);
                  }
                );
              });
            });
          })
        .catch((error) => {
          console.error('Error while making POST request:', error);
        });


      }
    );
  });
};

export const timeStampView=()=>{
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT time FROM registeredUser_table WHERE Id = ?;',
      [2], // Assuming you want to fetch data for Id 2, so use 2 without leading zeros
      (_, { rows }) => {
        const data = rows._array;
        if (data.length > 0) {
          const time = data[0].time;
          console.log("Time:", time);
          // Now you can use the 'time' value
        } else {
          console.log("No data found for Id 2");
        }
      },
      (_, error) => {
        console.error("Error fetching data:", error);
      }
    );
  });
}
 
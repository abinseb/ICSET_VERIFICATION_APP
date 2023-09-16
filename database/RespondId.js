import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');

export const GetUserID = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT userid AS id FROM login_table LIMIT 1;', // Add LIMIT 1 to get only the first row
          [],
          (_, { rows }) => {
            if (rows.length > 0) {
              const { id } = rows.item(0);
              resolve(id); // Resolve with the first userid
            } else {
              resolve(null); // Resolve with null if no data is found
            }
          },
          error => {
            console.error('Error querying data:', error);
            reject(error); // Reject with an error if there's a problem
          }
        );
      });
    });
  };
  
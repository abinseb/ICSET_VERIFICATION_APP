import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');



export const CheckRegTable = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT (*) AS rowCount FROM registeredUser_table;',
          [],
          (_, { rows }) => {
            const { rowCount } = rows.item(0);
            resolve(rowCount); // Resolve with rowCount
          },
          error => {
            console.error('Error querying data:', error);
            reject(error); // Reject with an error if there's a problem
          }
        );
      });
    });
  };

  export const CheckIBMTable = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT (*) AS rowCount FROM ibm_table;',
          [],
          (_, { rows }) => {
            const { rowCount } = rows.item(0);
            resolve(rowCount); // Resolve with rowCount
          },
          error => {
            console.error('Error querying data:', error);
            reject(error); // Reject with an error if there's a problem
          }
        );
      });
    });
  };

  export const CheckGoogleTable = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT (*) AS rowCount FROM google_table;',
          [],
          (_, { rows }) => {
            const { rowCount } = rows.item(0);
            resolve(rowCount); // Resolve with rowCount
          },
          error => {
            console.error('Error querying data:', error);
            reject(error); // Reject with an error if there's a problem
          }
        );
      });
    });
  };

  export const CheckLoginTable = () => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT (*) AS rowCount FROM login_table;',
          [],
          (_, { rows }) => {
            const { rowCount } = rows.item(0);
            resolve(rowCount); // Resolve with rowCount
          },
          error => {
            console.error('Error querying data:', error);
            reject(error); // Reject with an error if there's a problem
          }
        );
      });
    });
  };
  
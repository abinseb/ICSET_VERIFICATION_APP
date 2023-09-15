import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');

export const insertRegistredUserTable=(userReg)=>{
        
        db.transaction(tx=>{
          userReg.forEach(dataItem=> {
                tx.executeSql(
                  'INSERT INTO registeredUser_table (Id , name , institution, email , phone , verify,lunch,timeStamp) VALUES (?,?,?,?,?,?,?,?);',
                  [
                    dataItem._id,
                    dataItem.name,
                    dataItem.institution,
                    dataItem.email,
                    dataItem.phone,
                    dataItem.verify,
                    dataItem.lunch,
                    dataItem.timeStamp,

                  ],
                  (_,{insertId}) => console.log(`Inserted row with Id ${insertId}`),
                  error => console.error('Error inserting data: ' , error)
                );
          });
        });
}

export const insertGoogleTable=(userReg)=>{
        
    db.transaction(tx=>{
      userReg.forEach(dataItem=> {
            tx.executeSql(
              'INSERT INTO google_table (id , name , institution, email , phone , verify) VALUES (?,?,?,?,?,?);',
              [
                dataItem._id,
                dataItem.name,
                dataItem.institution,
                dataItem.email,
                dataItem.phone,
                dataItem.verify
              ],
              (_,{insertId}) => console.log(`Inserted row with Id ${insertId}`),
              error => console.error('Error inserting data: ' , error)
            );
      });
    });
}

export const insertIbmTable=(userReg)=>{
        
    db.transaction(tx=>{
      userReg.forEach(dataItem=> {
            tx.executeSql(
              'INSERT INTO ibm_table (id , name , institution, email , phone , verify) VALUES (?,?,?,?,?,?);',
              [
                dataItem._id,
                dataItem.name,
                dataItem.institution,
                dataItem.email,
                dataItem.phone,
                dataItem.verify
              ],
              (_,{insertId}) => console.log(`Inserted row with Id ${insertId}`),
              error => console.error('Error inserting data: ' , error)
            );
      });
    });
}

// insert to offline server
export const insert_Reg = (regId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO offline_reception (Id) VALUES (?);',
        [regId],
        (_, { insertId }) => {
          console.log(`Inserted data with id ${insertId}`);
        },
        (error) => {
          console.error('Error inserting', error);
        }
      );
    });
}

export const insertOfflineLunch =(regId)=>{
    db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO offline_lunch (Id) VALUES (?);',
          [regId],
          (_, { insertId }) => {
            console.log(`Inserted data with id ${insertId}`);
          },
          (error) => {
            console.error('Error inserting', error);
          }
        );
      });
}

export const insertOfflineGoogle =(regId)=>{
    db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO offline_google (Id) VALUES (?);',
          [regId],
          (_, { insertId }) => {
            console.log(`Inserted data with id ${insertId}`);
          },
          (error) => {
            console.error('Error inserting', error);
          }
        );
      });
}

export const insertOfflineIbm =(regId)=>{
    db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO offline_ibm (Id) VALUES (?);',
          [regId],
          (_, { insertId }) => {
            console.log(`Inserted data with id ${insertId}`);
          },
          (error) => {
            console.error('Error inserting', error);
          }
        );
      });
}


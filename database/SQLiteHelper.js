import { openDatabase } from "expo-sqlite";

const db = openDatabase('Registration.db');


export const RegisteredUserTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS registeredUser_table (Id INTEGER PRIMARY KEY, name TEXT , institution TEXT ,email TEXT , phone TEXT , verify BOOLEAN , lunch BOOLEAN);',
      [],
      () => console.log('Table created Successfully'),
      error => console.error('Error creating table :', error) // Remove the semicolon here
    );
  });
}

export const Google_Registered_table = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS google_table  (Id INTEGER PRIMARY KEY, name TEXT , institution TEXT ,email TEXT , phone TEXT , verify BOOLEAN);',
      [],
      () => console.log('Table created Successfully'),
      error => console.error('Error creating table :', error) // Remove the semicolon here
    );
  });
}

export const Ibm_Registered_table = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS ibm_table (Id INTEGER PRIMARY KEY, name TEXT , institution TEXT ,email TEXT , phone TEXT , verify BOOLEAN);',
      [],
      () => console.log('ibm_Table created Successfully'),
      error => console.error('Error creating table :', error) // Remove the semicolon here
    );
  });
}




export const offlineRegistration=()=>{
db.transaction(tx2 =>{
  tx2.executeSql(
    'CREATE TABLE IF NOT EXISTS offline_reception (Id INTEGER);',
    [],
    ()=> console.log("offline_reception_verified_data table created"),
    error => console.error('Error :', error)
  );
});
}

export const offline_lunch=()=>{
  db.transaction(tx2 =>{
    tx2.executeSql(
      'CREATE TABLE IF NOT EXISTS offline_lunch (Id INTEGER);',
      [],
      ()=> console.log("offlunch_data table created"),
      error => console.error('Error :', error)
    );
  });
  }

  export const offline_google=()=>{
    db.transaction(tx2 =>{
      tx2.executeSql(
        'CREATE TABLE IF NOT EXISTS offline_google (Id INTEGER);',
        [],
        ()=> console.log("off_google_data table created"),
        error => console.error('Error :', error)
      );
    });
    }

    export const offline_ibm=()=>{
      db.transaction(tx2 =>{
        tx2.executeSql(
          'CREATE TABLE IF NOT EXISTS offline_ibm (Id INTEGER);',
          [],
          ()=> console.log("off_ibm_data table created"),
          error => console.error('Error :', error)
        );
      });
      }
  

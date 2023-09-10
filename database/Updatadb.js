import { openDatabase } from "expo-sqlite";
const db = openDatabase('Registration.db');

export const deleteOfflineReg =()=>{
    db.transaction((tx)=>{
        tx.executeSql('DELETE FROM offline_reception;',
        [],(_,result)=>{
          if(result.rowsAffected >0){
            console.log('Deleted offline server');
          }
          else{
            console.log("No records")
          }
        }
        );
      });
}

export const deleteOfflineLunch =()=>{
  db.transaction((tx)=>{
      tx.executeSql('DELETE FROM offline_lunch;',
      [],(_,result)=>{
        if(result.rowsAffected >0){
          console.log('Deleted offline server');
        }
        else{
          console.log("No records")
        }
      }
      );
    });
}

export const deleteOfflineIbm =()=>{
  db.transaction((tx)=>{
      tx.executeSql('DELETE FROM offline_ibm;',
      [],(_,result)=>{
        if(result.rowsAffected >0){
          console.log('Deleted offline server');
        }
        else{
          console.log("No records")
        }
      }
      );
    });
}

export const deleteOfflineGoogle =()=>{
  db.transaction((tx)=>{
      tx.executeSql('DELETE FROM offline_google;',
      [],(_,result)=>{
        if(result.rowsAffected >0){
          console.log('Deleted offline server');
        }
        else{
          console.log("No records")
        }
      }
      );
    });
}
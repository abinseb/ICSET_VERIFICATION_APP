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
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import * as BackgroundFetch from 'expo-background-fetch';
// import login
import Login from "./pages/LoginPage/Login";

// entering page
import StartPage from "./pages/Home/EntryPage";
import SelectRole from "./pages/Common/SelectRole";

// Reception
import ReceptionScan from "./pages/Reception/ReceptionScan";
import ReceptionBarcodeScan from "./pages/Reception/QRCodeScan";
import ValidateReception from "./pages/Reception/ValidateReception";
import MobileValidate from "./pages/Reception/ValidateByMob";

// IBM
import IBMInput from "./pages/IBM/IBMInput";
import IBMQR from "./pages/IBM/IBMQR";
import IBMScan from "./pages/IBM/IBMScan"
import IBMValidate from "./pages/IBM/IBMValidate";

// Google
import GoogleInput from "./pages/Google/GoogleInput";
import GoogleScan from "./pages/Google/GoogleScan";
import GoogleQR from "./pages/Google/GoogleQR";
import GoogleValidate from "./pages/Google/GoogleValidate";

// college 
import Collegelist from "./pages/CollegeVerification/CollegeList";
import CollegeValidate from "./pages/CollegeVerification/CollegeVerification";
import VerifiedStudentList from "./pages/CollegeVerification/PresentStudentList";
import AbsentStudentList from "./pages/CollegeVerification/CollegeAbsentList";

// import tables
import {RegisteredUserTable,Google_Registered_table,Ibm_Registered_table,offlineRegistration ,login} from "./database/SQLiteHelper";
import {UpdateRegisteredTableBackground} from "./BackgroundRunning/BackgroundRun";
import { useEffect } from "react";

// enable screens 
enableScreens();

export default function App() {
  const Stack = createNativeStackNavigator();

  useEffect(()=>{
    RegisteredUserTable();
    offlineRegistration();
    Google_Registered_table();
    Ibm_Registered_table();
    login();
  },[])

  useEffect(()=>{
    const backgroundTaskName = 'defaultRun';
    BackgroundFetch.registerTaskAsync(backgroundTaskName,{
      minimumInterval:10,
      stopOnTerminate:false,
    });
    return () => {
      BackgroundFetch.unregisterTaskAsync(backgroundTaskName);
    };
  },[]);

  // Set up a timer to call defaultRun every 10 seconds
  useEffect(() => {
    const timerId = setInterval(() => {
      UpdateRegisteredTableBackground();
    }, 20 * 1000); 

    // Clean up the timer when the component unmounts
    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
   
    <NavigationContainer>
        <Stack.Navigator
          initialRouteName="EntryHome"
        >
          <Stack.Screen name="EntryHome" component={StartPage} options={{headerShown:false}}/>
          <Stack.Screen name="selectRole" component={SelectRole} options={{headerShown:false}} />

          {/* Reception */}
          <Stack.Screen name="ReceptionScan" component={ReceptionScan} />
          <Stack.Screen name="ReceptionQr" component={ReceptionBarcodeScan} />
          <Stack.Screen name="ValidateReceptionQR" component={ValidateReception} options={{headerShown:false}}/>
          <Stack.Screen name="mobileReception" component={MobileValidate} />

          

          {/* ibm */}

          <Stack.Screen name="ibmInput" from component={IBMInput}/>
          <Stack.Screen name="ibmscan" from component={IBMScan}/>
          <Stack.Screen name="ibmqr" from component={IBMQR}/>
          <Stack.Screen name="ibmvalidate" from component={IBMValidate} options={{headerShown:false}}/>

          {/* google */}
          <Stack.Screen name="googleInput" from component={GoogleInput}/>
          <Stack.Screen name="googlescan" from component={GoogleScan}/>
          <Stack.Screen name="googleqr" from component={GoogleQR}/>
          <Stack.Screen name="googleValidate" from component={GoogleValidate} options={{headerShown:false}}/>

          {/* college */}
          <Stack.Screen name="collegelist" from component={Collegelist}/>
          <Stack.Screen name="collegeverified" from component={CollegeValidate} />
          <Stack.Screen name="presentStudent" from component={VerifiedStudentList} />
          <Stack.Screen name="absentStudent" from component={AbsentStudentList} />

          {/* login */}
          <Stack.Screen name="login" from component={Login} />

           
    </Stack.Navigator>
    </NavigationContainer>
   
    
  );
}



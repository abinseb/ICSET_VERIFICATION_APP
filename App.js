import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
// import components


// entering page
import StartPage from "./pages/Home/EntryPage";
import SelectRole from "./pages/Common/SelectRole";

// Reception
import ReceptionScan from "./pages/Reception/ReceptionScan";
import ReceptionBarcodeScan from "./pages/Reception/QRCodeScan";
import ValidateReception from "./pages/Reception/ValidateReception";
import InputReception from "./pages/Reception/InputReception";
import MobileValidate from "./pages/Reception/ValidateByMob";

// lunch
import LunchScan from "./pages/Lunch/LunchScan";
import LunchQR from "./pages/Lunch/LunchQR";
import InputLunch from "./pages/Lunch/InputLunch";
import ValidateLunch from "./pages/Lunch/ValidateLunch";

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

// enable screens 
enableScreens();

export default function App() {
  const Stack = createNativeStackNavigator();

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
          <Stack.Screen name="InputReception" component={InputReception} />
          <Stack.Screen name="mobileReception" component={MobileValidate} />

          {/* lunch scan */}
          <Stack.Screen name="lunchScan" component={LunchScan} />
          <Stack.Screen name="lunchQr" component={LunchQR} />
          <Stack.Screen name="lunchInput" component={InputLunch} />
          <Stack.Screen name="lunchValidate" component={ValidateLunch} options={{headerShown:false}}/>

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
          






          
    </Stack.Navigator>
    </NavigationContainer>
   
    
  );
}



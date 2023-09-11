import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
// import components
import Home from "./pages/Home";
import Scan from './pages/ReadQR/Scan';
import ValidateQR from "./pages/ValidateQR/ValidateQR";
import InputDataManualy from "./pages/ReadQR/InputData";
import ConnectServer from "./pages/ConnectServer/Connection";

// ipProvider
import { IPProvider } from "./pages/IpContext";

// entering page
import StartPage from "./pages/Home/EntryPage";
import SelectRole from "./pages/Common/SelectRole";

// Reception
import ReceptionScan from "./pages/Reception/ReceptionScan";
import ReceptionBarcodeScan from "./pages/Reception/QRCodeScan";
import ValidateReception from "./pages/Reception/ValidateReception";
import InputReception from "./pages/Reception/InputReception"

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
    <IPProvider>
    <NavigationContainer>
        <Stack.Navigator
          initialRouteName="EntryHome"
        >
          <Stack.Screen name="EntryHome" component={StartPage} options={{headerShown:false}}/>
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}} />
          {/* <Stack.Screen name="Scan" component={Scan} /> */}
          {/* <Stack.Screen name="ValidateQR" component={ValidateQR} options={{headerShown:false}}/> */}
          <Stack.Screen name="Input" component={InputDataManualy} />
          <Stack.Screen name="serverConnection" component={ConnectServer} />
          <Stack.Screen name="selectRole" component={SelectRole} options={{headerShown:false}} />

          {/* Reception */}
          <Stack.Screen name="ReceptionScan" component={ReceptionScan} />
          <Stack.Screen name="ReceptionQr" component={ReceptionBarcodeScan} />
          <Stack.Screen name="ValidateReceptionQR" component={ValidateReception} />
          <Stack.Screen name="InputReception" component={InputReception} />

          {/* lunch scan */}
          <Stack.Screen name="lunchScan" component={LunchScan} />
          <Stack.Screen name="lunchQr" component={LunchQR} />
          <Stack.Screen name="lunchInput" component={InputLunch} />
          <Stack.Screen name="lunchValidate" component={ValidateLunch} />

          {/* ibm */}

          <Stack.Screen name="ibmInput" from component={IBMInput}/>
          <Stack.Screen name="ibmscan" from component={IBMScan}/>
          <Stack.Screen name="ibmqr" from component={IBMQR}/>
          <Stack.Screen name="ibmvalidate" from component={IBMValidate}/>

          {/* google */}
          <Stack.Screen name="googleInput" from component={GoogleInput}/>
          <Stack.Screen name="googlescan" from component={GoogleScan}/>
          <Stack.Screen name="googleqr" from component={GoogleQR}/>
          <Stack.Screen name="googleValidate" from component={GoogleValidate}/>

          {/* college */}
          <Stack.Screen name="collegelist" from component={Collegelist}/>
          <Stack.Screen name="collegeverified" from component={CollegeValidate} />
          






          
    </Stack.Navigator>
    </NavigationContainer>
    </IPProvider>
    
  );
}



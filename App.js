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

          
    </Stack.Navigator>
    </NavigationContainer>
    </IPProvider>
    
  );
}



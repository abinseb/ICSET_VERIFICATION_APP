import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const Scan = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [qrData, setQRData] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleScanAgain = () => {
        setScanned(false); // Re-enable scanning
        setQRData('')
    }
    
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setQRData(data);
    };

    useEffect(() => {
        if (qrData) {
            NaviagateToValidate();
        }
    }, [qrData]);

    const NaviagateToValidate = () => {
        navigation.navigate('ValidateQR', { qrData });
    }

    const handleNavigate = () => {
        navigation.navigate('Input');
    }

    // useFocusEffect(
    //     React.useCallback(() => {
    //         // Reset scanned state and QR data when the component gains focus
    //         setScanned(false);
    //         setQRData('');
    //         return () => {};
    //     }, [])
    // );

    return (
        <SafeAreaView style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? null || false : handleBarCodeScanned}
                style={styles.absoluteFillObject}
            />
            {scanned ? (
                <Button
                    style={styles.btn}
                    color="white"
                    mode="contained"
                    onPress={handleScanAgain} // Reset scanned state to false
                >
                    Tap to Scan Again
                </Button>
            ) : null}
            <Text style={styles.qrDataText}>{qrData}</Text>
            <View style={styles.textClick}>
                <Text style={styles.text1}>If QR won't work?{" "}</Text>
                <TouchableOpacity onPress={handleNavigate}>
                    <Text style={styles.text2}>Click</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


export default Scan;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        flex: 1,
        backgroundColor: '#1e7898',
    },
    absoluteFillObject: {
        height: '70%',
        width: '70%',
        alignSelf: 'center'
    },
    textClick: {
        marginLeft: 20,
        alignSelf: 'center',
        bottom: 0,
        position: 'absolute',
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text1: {
        fontSize: 18,
        color: '#000'
    },
    text2: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff'
    },
    qrDataText: {
        color: 'white',
        alignSelf: 'center',
        marginTop: 20,
    },
    btn: {
        backgroundColor: '#1e7898',
        alignSelf: 'center',
        marginTop: 20,
    }
});

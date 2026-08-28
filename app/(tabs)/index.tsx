import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [status, setStatus] = useState('Tap the button in case of emergency');
  const router = useRouter();

  const sendSOS = async () => {
    setStatus('📍 Getting your location...');

    let { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
    if (permissionStatus !== 'granted') {
      setStatus('❌ Location permission denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setStatus(`🚨 Alert ready!\nLocation: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency SOS</Text>
        <Text style={styles.headerSubtitle}>Your safety, one tap away</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
          <Text style={styles.sosButtonText}>SOS</Text>
        </TouchableOpacity>

        <Text style={styles.status}>{status}</Text>

        <TouchableOpacity
          style={styles.contactsButton}
          onPress={() => router.push('/explore')}
        >
          <Text style={styles.contactsButtonText}>Manage Emergency Contacts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { color: '#aaa', fontSize: 14, marginTop: 5 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  sosButton: {
    backgroundColor: '#e63946',
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#e63946',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  sosButtonText: { color: 'white', fontSize: 40, fontWeight: 'bold', letterSpacing: 2 },
  status: { marginTop: 30, fontSize: 15, textAlign: 'center', color: '#333', paddingHorizontal: 20 },
  contactsButton: {
    marginTop: 50,
    backgroundColor: '#1a1a2e',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  contactsButtonText: { color: 'white', fontSize: 15, fontWeight: '600' },
});
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [status, setStatus] = useState('Tap the button in case of emergency');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const router = useRouter();

  const startSOS = async () => {
    setCancelled(false);
    setLoading(true);
    setStatus('Getting your location...');

    let { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
    if (permissionStatus !== 'granted') {
      setLoading(false);
      setStatus('Location permission denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;

    setLoading(false);
    runCountdown(lat, lon);
  };

  const runCountdown = (lat, lon) => {
    let count = 3;
    setCountdown(count);

    const timer = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(timer);
        setCountdown(null);
        sendAlert(lat, lon);
      } else {
        setCountdown(count);
      }
    }, 1000);

    // store timer so cancel can stop it
    global.sosTimer = timer;
  };

  const cancelSOS = () => {
    clearInterval(global.sosTimer);
    setCountdown(null);
    setCancelled(true);
    setStatus('SOS cancelled. Tap the button in case of emergency');
  };

  const sendAlert = async (lat, lon) => {
    setStatus('Sending alert...');

    const saved = await AsyncStorage.getItem('contacts');
    const contacts = saved !== null ? JSON.parse(saved) : [];

    if (contacts.length === 0) {
      setStatus('No emergency contacts saved. Please add contacts first.');
      return;
    }

    const phoneNumbers = contacts.map((c) => c.phone);
    const mapLink = 'https://maps.google.com/?q=' + lat + ',' + lon;
    const message = 'EMERGENCY! I need help. My location: ' + mapLink;

    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      setStatus('SMS is not available on this device');
      return;
    }

    await SMS.sendSMSAsync(phoneNumbers, message);
    setStatus('✅ Alert Sent! Location: ' + lat.toFixed(4) + ', ' + lon.toFixed(4));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency SOS</Text>
        <Text style={styles.headerSubtitle}>Your safety, one tap away</Text>
      </View>

      <View style={styles.body}>
        {countdown !== null ? (
          <View style={styles.countdownWrap}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.countdownLabel}>Sending alert...</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelSOS}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.sosButton}
            onPress={startSOS}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Text style={styles.sosButtonText}>SOS</Text>
            )}
          </TouchableOpacity>
        )}

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
  countdownWrap: { alignItems: 'center' },
  countdownText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#e63946',
  },
  countdownLabel: { fontSize: 16, color: '#333', marginTop: 5 },
  cancelButton: {
    marginTop: 20,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButtonText: { color: 'white', fontWeight: '600' },
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
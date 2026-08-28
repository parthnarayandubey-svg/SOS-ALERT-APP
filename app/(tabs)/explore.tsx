import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function ContactsScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState([]);

  const addContact = () => {
    if (name.trim() === '' || phone.trim() === '') return;
    const newContact = { id: Date.now().toString(), name, phone };
    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
  };

  const removeContact = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addButtonText}>+ Add Contact</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No contacts added yet</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <View>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>
            <TouchableOpacity onPress={() => removeContact(item.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  form: { padding: 20 },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#1a1a2e',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontWeight: '600', fontSize: 15 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 30 },
  contactCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: { fontSize: 16, fontWeight: '600' },
  contactPhone: { fontSize: 14, color: '#666', marginTop: 2 },
  removeText: { color: '#e63946', fontWeight: '600' },
});
import { useGlobalSearchParams } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

export default function ProfileScreen() {
  const params = useGlobalSearchParams()
  const email = (params?.email as string) || 'No disponible'

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Email registrado:</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24
  },
  section: {
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '100%'
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF'
  }
})
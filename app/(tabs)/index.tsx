import { StyleSheet, Text, View } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aplicación - Home</Text>
      <Text style={styles.subtitle}>Bienvenido</Text>
      <Text style={styles.body}>Ahora sólo esperar para darle forma a esta app</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 8,
    textAlign: 'center',
    color: '#000'
  },
  subtitle: { 
    fontSize: 14, 
    color: '#666',
    marginBottom: 12,
    textAlign: 'center'
  },
  body: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18
  }
})
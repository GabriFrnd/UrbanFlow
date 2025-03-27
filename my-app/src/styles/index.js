import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // Estilo para botões
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

  // Estilo para containers
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ecf0f1',
  },

  // Estilo para texto
  text: {
    fontSize: 20,
    color: '#2c3e50',
  },
});
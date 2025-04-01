import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    marginTop: 4,
    flex: 1,
    backgroundColor: '#EAE2D6',
    padding: 16,
  },
  header: {
    marginHorizontal: -20,
    backgroundColor: '#C2A477',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontFamily: 'Kantumruy Pro',
    fontStyle: 'italic',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#92703B',
  },
  bodyText: {
    marginTop: 15 ,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 1
  },
  searchContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  searchInput: {
    height: 40,
    fontSize: 16,
  },
  transportContainer: {
    backgroundColor: '#C2A477',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92703B',
    marginBottom: 10,
  },
  favoritesContainer: {
    marginTop: 10,
  },
  routeCard: {
    backgroundColor: '#F5EEDC',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

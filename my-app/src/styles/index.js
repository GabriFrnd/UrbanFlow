import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    marginTop: 4,
    flex: 1,
    backgroundColor: '#EAE2D6',
    padding: 16,
  },

  containerTransparent: {
    marginTop: 4,
    flex: 1,
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
    height: 39,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    textAlign: 'center',
    height: 40,
    fontSize: 16,
  },

  searchIcon: {
    width: 18, 
    height: 18,
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
  },transportScreenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
    textAlign: 'center',
  },
  transportOption: {
    backgroundColor: '#C2A477',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  transportOptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  transportDivider: {
    height: 1,
    backgroundColor: '#C2A477',
    marginVertical: 25,
    opacity: 0.5,
  },
  transportQuestion: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
  },
  transportSearchContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  transportButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 10,
  },
  transportButton: {
    flex: 1,
    backgroundColor: '#C2A477',
    borderRadius: 20,
  },
  transportButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Kantumruy Pro',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchTransportContainer: {
    marginTop: 'auto',
    marginLeft: '-5%', 
    marginRight: '-5%',
    marginBottom: '-5%',
    padding: '5%',
    backgroundColor: '#C2A477'
  },
  buttonBackgroundContainer: {
    padding: '0.2%',
    backgroundColor: '#C2A477',
    marginTop: '1%',
    marginLeft: '2%', 
    marginRight: '2%',
    borderRadius: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EAE2D6',
  },

  headerContainerTransparent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  closeButton: {
    marginRight: 12,
  },
  closeText: {
    fontSize: 24,
    color: '#000',
    fontFamily: 'Kantumruy Pro',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Kantumruy Pro',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#C2A477',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  
});
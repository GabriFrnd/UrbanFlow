import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const FavoriteRoutes = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/icons/star.png')}
          style={styles.starIcon}
        />
        <Text style={styles.headerText}>Rotas Favoritas</Text>
      </View>

      <View style={styles.cardHighlighted}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Casa</Text>
          <View style={styles.timeContainer}>
            <Image
              source={require('../assets/icons/clock.png')}
              style={styles.clockIcon}
            />
            <Text style={styles.timeText}>23 min</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>→ Trabalho</Text>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { backgroundColor: '#DE594E' }]} />
          <View style={[styles.dot, { backgroundColor: '#65CBCB' }]} />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Academia</Text>
          <View style={styles.timeContainer}>
            <Image
              source={require('../assets/icons/clock.png')}
              style={styles.clockIcon}
            />
            <Text style={styles.timeText}>08 min</Text>
          </View>
        </View>
        <Text style={styles.cardSubtitle}>→ Casa</Text>
        <View style={styles.dotsContainer}>
          <View style={[styles.dot, { backgroundColor: '#6B5B95' }]} />
        </View>
      </View>
    </View>
  );
};

export default FavoriteRoutes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAE2D6',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  cardHighlighted: {
    width: 343,
    height: 93,
    backgroundColor: '#F5EEDC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },
  card: {
    width: 343,
    height: 93,
    backgroundColor: '#F5EEDC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#000',
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },

  dotsContainer: {
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
});

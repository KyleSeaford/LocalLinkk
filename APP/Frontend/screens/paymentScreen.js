import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Payment from '../components/payment';

const PaymentScreen = () => {
  return (
    <View style={styles.container}>
        <ScrollView>
            <Payment />
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#1A1A1A',
  },
});

export default PaymentScreen;

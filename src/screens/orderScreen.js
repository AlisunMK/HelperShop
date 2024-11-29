import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet} from 'react-native';

const OrderScreen = ({navigation}) => {
  const [orders, setOrders] = useState([]);

  const addOrder = () => {
    const newOrder = { id: Date.now().toString(), description: "Pedido #1" };
    setOrders([...orders, newOrder]);
  };

  return (
    <View style={styles.container}>
      
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#131313',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  btnOrders: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  btnStocks: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    marginTop:10,
    width: '80%',
    alignItems: 'center',
  },
  btnStocks: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    marginTop:10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default OrderScreen;
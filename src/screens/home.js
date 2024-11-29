import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ProductContext } from '../services/productContext';

const Home = ({ navigation }) => {
  const { products } = useContext(ProductContext); // Produtos do contexto
  const [modalVisible, setModalVisible] = useState(false);
  const [sellerName, setSellerName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); // Adicionado para método de pagamento
  const paymentMethods = [
    { id: '1', name: 'Cartão de Crédito' },
    { id: '2', name: 'Cartão de Débito' },
    { id: '4', name: 'Pix' },
    { id: '6', name: 'Dinheiro' },
  ];
  const [orders, setOrders] = useState([]); // Estado para os pedidos

  // Adicionar produto ao pedido
  const addProductToOrder = () => {
    if (selectedProduct && selectedQuantity) {
      const productDetails = products.find((product) => product.name === selectedProduct);

      if (!productDetails) {
        alert('Produto não encontrado no estoque.');
        return;
      }

      const newOrderItem = {
        id: Date.now(),
        name: productDetails.name,
        quantity: parseInt(selectedQuantity),
        price: productDetails.price,
        total: productDetails.price * parseInt(selectedQuantity),
      };

      setOrderItems([...orderItems, newOrderItem]);
      setSelectedProduct('');
      setSelectedQuantity('');

      // Atualiza o valor total
      setTotalValue((prevValue) => prevValue + newOrderItem.total);
    } else {
      alert('Selecione um produto e insira uma quantidade.');
    }
  };

  // Remove um produto do pedido
  const removeProductFromOrder = (id) => {
    const updatedOrderItems = orderItems.filter((item) => item.id !== id);
    const removedItem = orderItems.find((item) => item.id === id);

    setOrderItems(updatedOrderItems);
    setTotalValue((prevValue) => prevValue - removedItem.total);
  };

  // Criar pedido
  const createOrder = () => {
    if (!sellerName || !customerName || orderItems.length === 0 || !selectedPaymentMethod) {
      alert('Por favor, preencha todos os campos e adicione produtos ao pedido.');
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      sellerName,
      customerName,
      items: orderItems,
      total: totalValue,
      paymentMethod: selectedPaymentMethod, // Adicionando o método de pagamento
    };

    setOrders([...orders, newOrder]);

    // Limpar os campos após criar o pedido
    setSellerName('');
    setCustomerName('');
    setOrderItems([]);
    setTotalValue(0);
    setSelectedPaymentMethod(''); // Limpar o método de pagamento
    setModalVisible(false); // Fechar o modal após criar o pedido
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à HelperShop!</Text>
      <Text style={styles.subtitle}>Gerencie seus pedidos com facilidade.</Text>

      {/* Modal de Criar Pedido */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>CRIAR PEDIDO</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={20} color="black" />
            </TouchableOpacity>

            {/* Campo para Nome do Vendedor */}
            <TextInput
              style={styles.input}
              placeholder="Nome do Vendedor"
              placeholderTextColor="#aaa"
              value={sellerName}
              onChangeText={setSellerName}
            />

            {/* Campo para Nome do Cliente */}
            <TextInput
              style={styles.input}
              placeholder="Nome do Cliente"
              placeholderTextColor="#aaa"
              value={customerName}
              onChangeText={setCustomerName}
            />

            {/* Select para Produtos */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedProduct}
                onValueChange={(itemValue) => setSelectedProduct(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Produto" value="" />
                {products.map((product) => (
                  <Picker.Item
                    key={product.id}
                    label={`${product.name} - R$${product.price.toFixed(2)}`}
                    value={product.name}
                  />
                ))}
              </Picker>
            </View>

            {/* Select para Método de Pagamento */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPaymentMethod}
                onValueChange={(itemValue) => setSelectedPaymentMethod(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Método de Pagamento" value="" />
                {paymentMethods.map((method) => (
                  <Picker.Item
                    key={method.id}
                    label={method.name}
                    value={method.name}
                  />
                ))}
              </Picker>
            </View>

            {/* Campo para Quantidade */}
            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              placeholderTextColor="#aaa"
              value={selectedQuantity}
              keyboardType="numeric"
              onChangeText={setSelectedQuantity}
            />

            {/* Botão para Adicionar Produto */}
            <TouchableOpacity style={styles.addButton} onPress={addProductToOrder}>
              <Text style={styles.addButtonText}>Adicionar Produto</Text>
            </TouchableOpacity>

            {/* Lista de Produtos no Pedido */}
            <FlatList
              data={orderItems}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.orderItem}>
                  <Text style={styles.orderItemText}>
                    {item.quantity}x {item.name} - R${item.total.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeProductFromOrder(item.id)}
                  >
                    <Icon name="minus" size={20} color="#FF5252" />
                  </TouchableOpacity>
                </View>
              )}
            />

            {/* Valor Total */}
            <Text style={styles.totalText}>Valor Total: R${totalValue.toFixed(2)}</Text>

            {/* Botão para Criar Pedido */}
            <TouchableOpacity style={styles.createOrderButton} onPress={createOrder}>
              <Text style={styles.createOrderText}>Criar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Botões de navegação */}
      <TouchableOpacity
        style={styles.btnOrders}
        onPress={() => navigation.navigate('PEDIDOS', { orders })}
      >
        <Text style={styles.buttonText}>Visualizar Pedidos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnStocks}
        onPress={() => navigation.navigate('ESTOQUE')}
      >
        <Text style={styles.buttonText}>Visualizar Estoques</Text>
      </TouchableOpacity>

      {/* Botão flutuante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
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
  createOrderButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
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
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4B0082',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    height: '70%',  // Ajuste para melhor se adaptar a telas menores
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 60,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 7,
    backgroundColor: 'none',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#333',
  },
  orderItem: {
    width: 240,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 5,
  },
  orderItemText: {
    fontSize: 16,
    color: '#333',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default Home;

import React, { useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Button, 
  FlatList, 
  StyleSheet, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  Alert, 
  PermissionsAndroid, 
  Platform 
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Biblioteca para captura de imagem
import { ProductContext } from '../services/productContext';

const checkPermissions = async () => {
  if (Platform.OS === 'android') {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ];

    for (let permission of permissions) {
      const hasPermission = await PermissionsAndroid.check(permission);
      if (!hasPermission) {
        const granted = await PermissionsAndroid.request(permission);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permissão negada',
            `A permissão ${permission} é necessária para o funcionamento do app.`
          );
        }
      }
    }
  }
};

const StockScreen = () => {
  const { products, addProduct } = useContext(ProductContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const isValidNumber = (value) => !isNaN(value) && Number(value) > 0;

  const handleAddProduct = () => {
    if (!name || !isValidNumber(price) || !isValidNumber(quantity) || !image) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente para adicionar o produto.');
      return;
    }

    addProduct(name, parseFloat(price), parseInt(quantity), image);
    setName('');
    setPrice('');
    setQuantity('');
    setImage(null);
  };

  const selectImage = () => {
    Alert.alert(
      'Escolher Imagem',
      'Selecione a origem da imagem:',
      [
        {
          text: 'Câmera',
          onPress: () => launchCamera({ mediaType: 'photo', quality: 1 }, handleImageResponse),
        },
        {
          text: 'Galeria',
          onPress: () => launchImageLibrary({ mediaType: 'photo', quality: 1 }, handleImageResponse),
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('Usuário cancelou a seleção de imagem.');
    } else if (response.errorMessage) {
      console.error('Erro ao selecionar imagem:', response.errorMessage);
    } else if (response.assets && response.assets.length > 0) {
      setImage(response.assets[0].uri); // Armazena o URI da imagem selecionada
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do Produto"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        placeholderTextColor="#aaa"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        placeholderTextColor="#aaa"
        value={quantity}
        keyboardType="numeric"
        onChangeText={setQuantity}
      />

      {/* Botão para selecionar imagem */}
      <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
        <Text style={styles.imageButtonText}>
          {image ? 'Trocar Imagem' : 'Adicionar Imagem'}
        </Text>
      </TouchableOpacity>

      {/* Pré-visualização da imagem */}
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.productImagePreview}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity style={styles.btnAddProduct} onPress={handleAddProduct}>
        <Text style={styles.imageButtonText}>Adicionar Produto</Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardProduct}>
            <Image
              source={{ uri: item.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <Text style={styles.productText}>
              {item.name} - R${item.price.toFixed(2)} (x{item.quantity})
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum produto adicionado.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#131313',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#fff',
  },
  imageButton: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productImagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
  },
  btnAddProduct: {
    backgroundColor: '#4B0082',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  productText: {
    color: '#131313',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardProduct: {
    marginVertical: 10,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  emptyListText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default StockScreen;

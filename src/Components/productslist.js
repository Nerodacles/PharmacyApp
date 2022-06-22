import React, {useEffect, useState} from 'react';
import { Provider } from 'react-redux';
import { View, Text} from 'react-native';

const ProductsList = ({ data }) =>{
    return (
        <View>
            {data.map((item) => (
                <Text>{item.name} {item._id}</Text>

            ))}
        </View>
    );
}

export default ProductsList;
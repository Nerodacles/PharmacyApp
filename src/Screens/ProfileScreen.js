import React, {useContext} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = () =>{
    const {logout} = useContext(AuthContext);
    return(
        <View style={{flex:1, justifyContent:'center',alignItems:'center' }}>
            <Text>Profile Screen</Text>
            <TouchableOpacity onPress={() => {logout()}}>
                <Text style={{color: 'black'}}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ProfileScreen
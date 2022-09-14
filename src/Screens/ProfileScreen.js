import React, {useContext} from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Pressable} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) =>{
    const {logout} = useContext(AuthContext);
    const {userInfo} = useContext(AuthContext);
    return(
        <View style={style.container}>
            <Text style={style.title}>Perfil</Text>
            <View style={style.cont}>
                <View style={style.cont2}>
                    <View style={style.options}>
                        <Pressable onPress={() => navigation.navigate('Favorito')} style={{width: '100%'}}>
                            <Text style={style.subtitle}>
                                Favoritos
                            </Text>
                        </Pressable>
                    </View>
                    <View style={style.options}>
                        <Text style={style.subtitle}>
                            Nombre de Usuario:
                        </Text>
                        <Text style={style.text}>
                            {userInfo ? userInfo.username: 'RandomUser'}
                        </Text>
                    </View>
                    <View style={style.options}>
                        <Text style={style.subtitle}>
                            Correo:
                        </Text>
                        <Text style={style.text}>
                            {userInfo ? userInfo.email: 'RandomUser'}
                        </Text>
                    </View>
                    <View style={style.options}>
                        <Text style={style.subtitle}>
                            Rol:
                        </Text>
                        <Text style={style.text}>
                            {userInfo ? userInfo.role: 'RandomUser'}
                        </Text>
                    </View>
                </View>
                <View style={style.cont3}>
                    <TouchableOpacity style={style.btn} onPress={() => {logout()}}>
                        <Text style={style.btnText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const style =StyleSheet.create({
    Text:{
        color: "#FFF"
    },
    container:{
        flex: 1,
        alignItems:"center",
        justifyContent: "center",
        backgroundColor: "#FFF"
    },
    cont:{
        flex:1,
        flexDirection:"column",
        backgroundColor:"#0062da",
        width:"95%",
        borderRadius:50,
        paddingHorizontal:20,
        marginBottom:5,
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: '10%',
        marginBottom: '10%',
        color: 'black',
        textAlign: 'center'
    },
    subtitle:{
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#FFF'
    },
    btn:{
        padding:10,
        borderRadius: 20,
        marginTop: 100,
        marginHorizontal: 20,
        backgroundColor: "#4cc3eb",
        alignItems: "center"
    },
    btnText:{
        fontSize:20,
        color: "#FFF"
    },
    text:{
        paddingTop:10,
        fontSize: 18,
        lineHeight:25,
        color: '#FFF'
    },
    cont2:{
        marginVertical:25,
        height:"50%",
      },
    cont3:{
        flexDirection:"row",
        marginBottom:20,
        alignItems:"center",
        width:"100%",
        height:"45%",
        justifyContent:"flex-end",
        marginTop:20,
      },
      options:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        width:"100%",
        paddingHorizontal:10,
        paddingTop:15,
      }
})

export default ProfileScreen
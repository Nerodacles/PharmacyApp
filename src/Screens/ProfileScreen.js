import React, {useContext, useState} from 'react';
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Pressable, Modal} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const ProfileScreen = ({ navigation }) =>{
    const [modalVisible, setModalVisible] = useState(false);
    const { logout, userInfo } = useContext(AuthContext);

    function isDelivery() {
        const {userInfo} = useContext(AuthContext);
        if (userInfo.role == 'delivery'){
            return true
        }
        return false
    }
    isDelivery()

    function signOut () {
        logout()
        setModalVisible(false)
      }

    return(
        <View style={style.container}>
            <Text style={style.title}>Perfil</Text>
            <View style={style.cont}>
                <View style={style.cont2}>
                    {isDelivery() ? null :
                        <View style={style.options}>
                            <Pressable onPress={() => navigation.navigate('Favorito')} style={{width: '100%'}}>
                                <Text style={style.subtitle}>
                                    Favoritos
                                </Text>
                            </Pressable>
                        </View>
                    }
                    {isDelivery() ? null :
                        <View style={style.options}>
                            <Pressable onPress={() => navigation.navigate('Ordenes Pasadas')} style={{width: '100%'}}>
                                <Text style={style.subtitle}>
                                    Ordenes Pasadas
                                </Text>
                            </Pressable>
                        </View>
                    }
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
                    {isDelivery() ? null :
                        <View style={style.options}>
                            <Pressable onPress={() => navigation.navigate('ChangePassword')} style={{width: '100%'}}>
                                <Text style={style.subtitle}>
                                    Cambiar Contraseña
                                </Text>
                            </Pressable>
                        </View>
                    }
                </View>
                <View style={style.cont3}>
                    <TouchableOpacity style={style.btn} onPress={() => setModalVisible(true) }>
                        <Text style={style.btnText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={style.modalContainer}>
                <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }} >
                    <View style={style.centeredView}>
                    <View style={style.modalView}>
                        <Text style={style.modalText}>Desea cerrar sesión?</Text>
                        <View style={style.contenedor}>
                            <Pressable style={[style.button, style.buttonOpen]} onPress={() => signOut()}>
                            <Text style={style.textStyle}>Aceptar</Text>
                            </Pressable>
                            <Pressable style={[style.button, style.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={style.textStyle}>Cancelar</Text>
                            </Pressable>
                        </View>
                        </View>
                    </View>
                </Modal>
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
      },
      modalContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        width: '50%',
        // alignItems:'center', flex: 1, justifyContent: 'flex-end', width: "100%", height: "98%", margin: 10, position: 'absolute',
        justifyContent: 'center',
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        width: '100%',
        height:'70%',
      },
      modalView: {
        margin: 20,
        backgroundColor:"white",
        borderRadius: 60,
        padding: 35,
        position:'absolute',
        alignItems: "center",
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
      },
      button: {
        borderRadius: 40,
        padding: 20,
        margin: 10,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: "#4cc3eb",
        fontSize: 50,
        lineHeight: 21,
        letterSpacing: 0.25,
      },
      buttonClose: {
        backgroundColor: "#E2443B",
        fontSize: 50,
        lineHeight: 21,
        letterSpacing: 0.25,
      },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: 'black'
      },
      contenedor: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      }
})

export default ProfileScreen
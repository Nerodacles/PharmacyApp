import React, { useContext, useEffect, useState, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';

const axiosInstance = axios.create({ baseURL: 'https://pharmacy.jmcv.codes/' });

const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);
const HomeScreen = ({route}) => {
    const [items, setItems] = useState([]);
    const navigation = useNavigation()
    const [ activeSlide, setActiveSlide ] = useState(0)
    const { userInfo, userToken } = useContext(AuthContext);
    const isCarousel = useRef(null)
    // const { metodo } = route.params
    // console.log(metodo)

    axiosInstance.interceptors.request.use(
        config => {
            config.headers['authorization'] = userToken
            return config
        },
        error => {
            return Promise.reject(error)
        }
    )

    useEffect(() => {
        if (userInfo.role === 'delivery') {
            axiosInstance.get('orders').then((res) => {
                setItems([]);
                return setItems(res.data);
            });
        }
        else {
            axiosInstance.get('api/getAll').then((res) => {
                setItems([]);
                return setItems(res.data);
            });
        }
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF", width: '100%', height: '100%' }}>
            <View style={{ backgroundColor:"#0062da", height: "20%", margin:10, borderRadius:20, paddingHorizontal:20, shadowColor: "#000", shadowOffset: {width: 0, height: 7}, shadowOpacity: 0.41, shadowRadius: 9.11, elevation: 14, }}>
                <View style={{flexDirection:"row", alignItems: "center", marginTop: 25, marginVertical: 30, width:"100%"}}>
                    <View style={{width: "50%", alignItems: 'center'}}>
                        <Text style={{ fontSize: 30, color: '#FFF', fontWeight: 'bold' }}>Bienvenido {userInfo.username ? userInfo.username : "RandomUser"}</Text>
                    </View>
                    <View style={{width:"50%", alignItems: "flex-end"}}>
                        <Image 
                            source={{uri : 'https://cdn.pixabay.com/photo/2016/03/31/15/33/contact-1293388_1280.png'}}
                            style={{height:'80%', width:50, marginHorizontal: 20}}
                        />
                    </View>
                </View>
            </View>

            <View style={{height: '100%', marginHorizontal:10, flex: 1, }}>
                <View style={{ backgroundColor:"#0062da", height: "80%", margin:10, borderRadius:20, paddingHorizontal:20, shadowColor: "#000", shadowOffset: {width: 0, height: 7}, shadowOpacity: 0.41, shadowRadius: 9.11, elevation: 14,  }}>
                    <View style={{ flexDirection:"column", alignItems: "center", width:"100%" }}>
                        <View style={{marginTop: 10}}>
                            {
                                userInfo.role === 'delivery' ? 
                                <Text style={{ fontSize: 30, color: '#fff', fontWeight: 'bold' }}>Historico de Ordenes</Text> 
                                :
                                <Text style={{ fontSize: 30, color: '#fff', fontWeight: 'bold' }}>Productos mas vendidos</Text>
                            }
                            
                        </View>
                        <View style={{width:"100%", height: '100%'}}>
                            {
                                userInfo.role === 'delivery' ? 
                                <Carousel
                                    ref={isCarousel}
                                    layout={'tinder'}
                                    loop={true}
                                    enableSnap={false}
                                    loopClonesPerSide={13}
                                    layoutCardOffset={9} 
                                    data={items}
                                    containerCustomStyle={styles.carouselContainer}
                                    sliderWidth={SLIDER_WIDTH}
                                    itemWidth={ITEM_WIDTH}
                                    useScrollView={true}
                                    renderItem={({item: item}) => 
                                        <View style={styles.itemContainer}>
                                        <View style={styles.cover}>
                                            <Image source={{uri: `https://${item.cover}`}} style={styles.img} />
                                        </View>
                                        <Text style={styles.itemLabel}>{item.id} </Text>
                                        </View>}
                                />
                                // items.map((item) => (
                                //     <View key={item.id} style={{color: 'black', margin: 5}}>
                                //         <Text style={{color: '#fff'}}>{item.id}</Text>
                                //     </View>
                                // ))
                                :
                                <View style={{width: '100%', height: '80%'}}>
                                    <Carousel
                                        ref={isCarousel}
                                        layout={'stack'}
                                        enableSnap={true}
                                        layoutCardOffset={18} 
                                        data={items}
                                        containerCustomStyle={styles.carouselContainer}
                                        contentContainerStyle={{justifyContent: 'center'}}
                                        sliderWidth={SLIDER_WIDTH}
                                        itemWidth={ITEM_WIDTH}
                                        useScrollView={true}
                                        onSnapToItem={(index => setActiveSlide(index))}
                                        renderItem={({item: item}) => 
                                        <View style={styles.itemContainer}>
                                        <View style={styles.cover}>
                                            <Image source={{uri: `https://${item.cover}`}} style={styles.img} />
                                        </View>
                                        <Text style={styles.itemLabel}>{item.name} </Text>
                                        </View>}
                                    />
                                <Pagination
                                    dotsLength={items.length}
                                    activeDotIndex={activeSlide}
                                    carouselRef={isCarousel}
                                    dotStyle={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        marginHorizontal: 8,
                                        backgroundColor: 'white',
                                    }}
                                    tappableDots={true}
                                    inactiveDotStyle={{
                                        // Define styles for inactive dots here
                                    }}
                                    inactiveDotOpacity={0.4}
                                    inactiveDotScale={0.6}
                                />
                                </View>
                                
                                // items.map((item) => (
                                    //     <View key={item.id} style={{ margin: 5}}>
                                    //         <View style={styles.cover}>
                                    //             <Image source={{uri: `https://${item.cover}`}} style={styles.img}/>
                                    //         </View>
                                    //         <Text style={{color: '#fff'}}>{item.name}</Text>
                                    //     </View>
                                    // ))
                                }
                        </View>
                            
                        
                    </View>
                        
                </View>
            </View>
            
            {userInfo.role === 'delivery' ? null :
                <View style={{margin: 20}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Products')} 
                        style={{
                        padding:10,
                        borderRadius: 20,
                        margin:20,
                        backgroundColor: "#4cc3eb",
                        alignItems: "center"
                        }} 
                        >
                        <Text style={{fontSize:20}}>Ir a los Productos</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    carouselContainer: {
        // marginTop: 50,
        alignSelf: 'center',
      },
    itemContainer: {
        // width: ITEM_WIDTH,
        // height: ITEM_HEIGHT,
        alignItems: 'center',
        // justifyContent: 'center',
        margin: 10,
        height: '90%', justifyContent: 'center', backgroundColor:"#FFF", borderRadius:20, paddingHorizontal:30, shadowColor: "#000", shadowOffset: { width: 0, height: 7, }, shadowOpacity: 0.41, shadowRadius: 9.11, elevation: 14,
      },
      itemLabel: {
        color: 'black',
        fontSize: 24
      },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    img:{
        height:"100%",
        width:"100%",
        resizeMode:"cover"
    },
    cover:{
        height:200,
        width:200,
    },
});

export default HomeScreen;
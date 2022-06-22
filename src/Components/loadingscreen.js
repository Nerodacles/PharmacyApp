// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, StyleSheet, Text, View } from "react-native";


// const Loading = () => {
//     const [contador, setContador] = useState(0);
//     const [isActive] = useState(false)

//     useEffect(() => {
//         let tempo = null;
//         if (contador){
//             tempo = setTimeout(() => {
//                 setContador(contador => contador +1);
//             }, 1000);
//         } else if (!isActive && contador == 5){
//             clearTimeout(tempo);
//         }
//     }, [contador]);

//     return(
//         {contador != 0 (
//             <View style={[styles.container, styles.horizontal]}>
//                 <Text>Wait a Moment</Text>
//                 <ActivityIndicator size="large" />
//             </View>
//         )}
        
//     );
        
// };


    

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center"
//   },
//   horizontal: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     padding: 10
//   }
// });


// export default Loading;


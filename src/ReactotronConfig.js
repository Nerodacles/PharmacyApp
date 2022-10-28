import Reactotron from 'reactotron-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

let host = '10.0.0.70'

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    host: host,
    name: "PharmacyApp"
  }) // we can use plugins here -- more on this later
  .useReactNative({
    asyncStorage: false,
    networking: {
      ignoreUrls: /symbolicate|127.0.0.1/,
    },
    editor: false,
    errors: { veto: stackFrame => false },
    overlay: false,
  })
  .connect() // let's connect!
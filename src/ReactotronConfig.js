import Reactotron from 'reactotron-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeModules } from 'react-native';

// const host = NativeModules.SourceCode.scriptURL.split('://')[1].split(':')[0]
let host = "10.70.0.152"

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    host: host,
    name: "Note 8 (2021) - PharmacyApp"
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
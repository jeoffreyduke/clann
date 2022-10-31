import "../styles/globals.css";
import { Provider } from "react-redux";
import store, { persistor } from "../provider/store";
import { PersistGate } from "redux-persist/integration/react";
import initializeFirebase from '../firebaseConfig';

function App({ Component, pageProps }) {

  initializeFirebase();
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;

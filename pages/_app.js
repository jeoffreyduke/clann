import "../styles/globals.css";
import { Provider } from "react-redux";
import store, { persistor } from "../provider/store";
import { PersistGate } from "redux-persist/integration/react";

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;

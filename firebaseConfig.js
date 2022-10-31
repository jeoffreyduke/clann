import {  getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
    apiKey: "AIzaSyD7qn1vi6kb2jCRu-Cx5dA2x1njAsi61BY",
    authDomain: "clann-1c61e.firebaseapp.com",
    projectId: "clann-1c61e",
    storageBucket: "clann-1c61e.appspot.com",
    messagingSenderId: "595110579446",
    appId: "1:595110579446:web:e433415d2756f3eb5370d7",
    measurementId: "G-1LLXWQ85BE"
};


const initializeFirebase = () => {

    if( !getApps().length ){

        //Initialize Firebase
        const app = initializeApp(firebaseConfig);

        //creating auth for authentication
        const auth = getAuth(app);

        if(typeof window !== "undefine"){
            if("measurementId" in firebaseConfig ){
                const analytics = getAnalytics(app);
                const performance = getPerformance(app);
            }
        }

        console.log('firebase initiated...')

    }else {
        console.log('firebase already runing...')
    }
}

export default initializeFirebase;



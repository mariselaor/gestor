import { defineStore } from "pinia"

import { auth } from "./firebase"; '@stores/user.js'

// eslint-disable-next-line no-unused-vars
import { createUserWithEmailAndPassword } from "firebase/auth"

export const useUserStore = defineStore("user", {
    state: () => {
        return {
        user: null,
        };
    },

    actions: {
     async register(email, password){
        // eslint-disable-next-line no-empty
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            switch(error.code){
                case "auth/email-already-in-use":
                    alert("Email already in use");
                    break;
                    case "auth/invalid-email":
                        alert("Invalid email");
                        break;
            }
            return;
        }
        this.user = auth.currentUser;   
        console.log("Usuario Registrado satisfactoriamente");
     },
    },
});
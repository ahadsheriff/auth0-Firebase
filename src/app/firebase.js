// configure Firebase in your client-side app

let _messagesDb = null;

class Firebase {
    constructor() {
        // TODO: from Firebase application console
        firebase.initializeApp({
            apiKey: 'AIzaSyDARVg6b3tZTTiEeGJXwYuWS8v2SpkOKlc',
            authDomain: 'roundup-service.firebaseapp.com',
            projectId: 'roundup-service',
        });

        // initialize Firestore through Firebase
        _messagesDb = firebase.firestore();

        // disable deprecated features
        _messagesDb.settings({
            timestampsInSnapshots: true
        });
    }

    async addMessage(message) {
        const createdAt = new Date();
        const author = firebase.auth().currentUser.displayName;
        return await _messagesDb.collection('messages').add({
            author,
            createdAt,
            message,
        });
    }

    getCurrentUser() {
        return firebase.auth().currentUser;
    }

    async updateProfile(profile) {
        if (!firebase.auth().currentUser) return;
        await firebase.auth().currentUser.updateProfile({
            displayName: profile.name,
            photoURL: profile.picture,
        });
    }

    async signOut() {
        await firebase.auth().signOut();
    }

    // ... constructor and methods defined above ...

    /**This method enables your app to add a listener that Firebase 
     * will call whenever the authentication status change. 
     * */
    setAuthStateListener(listener) {
        firebase.auth().onAuthStateChanged(listener);
    }

    /**This method adds a listener to the messages collection of your Firestore database. 
     * Firebase will call this listener in real-time whenever this collection changes. 
     * */
    setMessagesListener(listener) {
        _messagesDb.collection('messages').orderBy('createdAt', 'desc').limit(10).onSnapshot(listener);
    }

    /**
     * This method receives custom tokens that you generate on your server and uses 
     * them to authenticate with Firebase.
     */
    async setToken(token) {
        await firebase.auth().signInWithCustomToken(token);
    }
}

const firebaseClient = new Firebase();
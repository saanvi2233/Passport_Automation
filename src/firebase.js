import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp,doc,setDoc,updateDoc ,Timestamp} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBx50_fL-tR8d36tSPODa3VeKi9AELht_4",
  authDomain: "passport-automation-6b3b9.firebaseapp.com",
  projectId: "passport-automation-6b3b9",
  storageBucket: "passport-automation-6b3b9.firebasestorage.app",
  messagingSenderId: "803869396086",
  appId: "1:803869396086:web:07dba707fde789301e2357",
  measurementId: "G-M4KGPB6QDY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Declare db here

const auth = getAuth(app);

// Sign up function
const signUp = async (email, password, additionalData) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        ...additionalData
      });
  
      return user;
    } catch (error) {
      throw error;
    }
  };

// Function to add passport application data to Firestore
 const addApplication = async (applicationData) => {
  try {
    const applicationsRef = collection(db, 'applications');
    const docRef = await addDoc(applicationsRef, {
      ...applicationData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding application: ", error);
    throw error;
  }

};


export const updateApplicationStatusInFirestore = async (applicationId, status) => {
  const applicationRef = doc(db, 'applications', applicationId);
  await updateDoc(applicationRef, {
    applicationStatus: {
      status,
      lastUpdated: new Date().toISOString(),
    },
  });
};

export const savePassportData = async (passportData) => {
  try {
    const docRef = await addDoc(collection(db, 'passports'), {
      ...passportData,
      createdAt: serverTimestamp(),
    });
    return docRef.id; // Return the document ID after saving it
  } catch (error) {
    console.error("Error saving passport data: ", error);
    throw error; // Throw error if saving fails
  }
};

const getApplications = async () => {
  const querySnapshot = await getDocs(collection(db, 'applications'));
  const applications = [];
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data()); // Add this to see the document data
    applications.push({ id: doc.id, ...doc.data() });
  });
  return applications;
};
// Add this function temporarily to add test data
const addTestData = async () => {
  try {
    const applicationsRef = collection(db, 'applications');
    
    // Add some test applications
    const testData = [
      {
        applicationType: 'Regular',
        status: 'Approved',
        createdAt: Timestamp.fromDate(new Date()),
        // Add other fields as needed
      },
      {
        applicationType: 'Urgent',
        status: 'Pending',
        createdAt: Timestamp.fromDate(new Date(Date.now() - 86400000)), // Yesterday
        // Add other fields as needed
      },
      // Add more test data as needed
    ];

    for (const data of testData) {
      await addDoc(applicationsRef, data);
    }

    console.log('Test data added successfully');
  } catch (error) {
    console.error('Error adding test data:', error);
  }
};

// Call this function once to add test data
// addTestData();


export { signUp, db, auth, addDoc, collection, getDocs, addApplication, getApplications };


// firebase.js

// import { initializeApp } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
// import { getFirestore, collection, addDoc, getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBx50_fL-tR8d36tSPODa3VeKi9AELht_4",
//   authDomain: "passport-automation-6b3b9.firebaseapp.com",
//   projectId: "passport-automation-6b3b9",
//   storageBucket: "passport-automation-6b3b9.firebasestorage.app",
//   messagingSenderId: "803869396086",
//   appId: "1:803869396086:web:07dba707fde789301e2357",
//   measurementId: "G-M4KGPB6QDY"
// };

// // Initialize Firebase app and Firestore Auth
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app); // Firestore instance
// const auth = getAuth(app); // Auth instance

// // Sign up function for user registration
// const signUp = async (email, password, additionalData) => {
//   try {
//     // Create user with email and password
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
    
//     // Store additional user data in Firestore
//     await setDoc(doc(db, 'users', user.uid), {
//       email: user.email,
//       createdAt: serverTimestamp(), // Use server timestamp for creation
//       ...additionalData
//     });
  
//     return user;
//   } catch (error) {
//     console.error("Error signing up:", error.message);
//     throw error;
//   }
// };

// // Function to add passport application data to Firestore
// const addApplication = async (applicationData) => {
//   try {
//     const applicationsRef = collection(db, 'applications');
//     const docRef = await addDoc(applicationsRef, {
//       ...applicationData,
//       createdAt: serverTimestamp(),  // Automatic timestamp when creating
//       updatedAt: serverTimestamp(),  // Automatic timestamp when updating
//     });
//     return docRef.id; // Return the document ID after saving
//   } catch (error) {
//     console.error("Error adding application:", error.message);
//     throw error;
//   }
// };

// // Function to update application status in Firestore
// export const updateApplicationStatusInFirestore = async (applicationId, status) => {
//   try {
//     const applicationRef = doc(db, 'applications', applicationId);
//     await updateDoc(applicationRef, {
//       applicationStatus: {
//         status,
//         lastUpdated: serverTimestamp(), // Use server timestamp for the update
//       },
//     });
//   } catch (error) {
//     console.error("Error updating application status:", error.message);
//     throw error;
//   }
// };

// // Export functions and Firestore references
// export { signUp, db, auth, addApplication };

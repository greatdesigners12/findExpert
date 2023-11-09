import { db, app } from "../firebaseApp";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { ResultData } from "../structureJson/resultData";
import { UserData } from "./models/userData";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function login(email, password) {
  const auth = getAuth();
  const result = new ResultData();
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

  if (email === "" || password === "") {
    result.data = null;
    result.errorMessage = "Please fill all the inputs";
    result.statusCode = 400;
    return result;
  }

  var errorMsgValidation = "";

  if (!email.match(emailRegex)) {
    errorMsgValidation = "Email";
  }

  if (!password.match(passwordRegex)) {
    if (errorMsgValidation == "") {
      errorMsgValidation = "Password";
    } else {
      errorMsgValidation = " and Password";
    }
  }

  if (errorMsgValidation !== "") {
    errorMsgValidation += " format is not correct";
    if (errorMsgValidation.includes("Password")) {
      errorMsgValidation +=
        " (For password, please input atleast at least one uppercase letter, one lowercase letter and one number)";
    }
    result.data = null;
    result.errorMessage = errorMsgValidation;
    result.statusCode = 400;
    return result;
  }

  await signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      // Signed in
      result.data = userCredential.user;
      result.errorMessage = "";
      result.statusCode = 200;

      const checkUser = doc(db, "userData", userCredential.user.uid);
      const checkUserSnap = await getDoc(checkUser);

      if (checkUserSnap.exists()) {
        result.data["role"] = "user";
      } else {
        const checkExpert = doc(db, "expertData", userCredential.user.uid);
        const checkExpertSnap = await getDoc(checkExpert);
        if (checkExpertSnap.exists()) {
          result.data["role"] = "expert";
        } else {
          const checkAdmin = doc(db, "adminData", userCredential.user.uid);
          const checkAdminSnap = await getDoc(checkAdmin);
          if (checkAdminSnap.exists()) {
            result.data["role"] = "admin";
          }
          result.data["role"] = "admin";
        }
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      result.data = null;
      result.errorMessage = errorMessage;
      result.statusCode = errorCode;
    });

  return result;
}

export function getCurrentUser() {
  const auth = getAuth();
  return auth.currentUser;
}
// please make sure you get the id from the session
export async function checkRole(id) {
  const result = new ResultData();

  try {
    const checkUser = doc(db, "userData", id);
    const checkUserSnap = await getDoc(checkUser);

    if (checkUserSnap.exists()) {
      result.data = "user";
    } else {
      const checkExpert = doc(db, "expertData", id);
      const checkExpertSnap = await getDoc(checkExpert);
      if (checkExpertSnap.exists()) {
        result.data = "expert";
      } else {
        result.data = "admin";
      }
    }
    result.statusCode = 200;
    result.errorMessage = null;
  } catch (e) {
    result.data = e;
    result.statusCode = 200;
    result.errorMessage = e.message;
  }

  return result;
}

export async function register(name, job, email, password, confirmPassword) {
  const result = new ResultData();
  if (
    name === "" ||
    job === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    result.data = null;
    result.errorMessage = "Please fill all the inputs";
    result.statusCode = 400;
    return result;
  }
  if (password != confirmPassword) {
    result.data = null;
    result.errorMessage = "The password doesn't match";
    result.statusCode = 400;
    return result;
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

  var errorMsgValidation = "";

  if (!email.match(emailRegex)) {
    errorMsgValidation = "Email";
  }

  if (!password.match(passwordRegex)) {
    if (errorMsgValidation === "") {
      errorMsgValidation += "Password";
    } else {
      errorMsgValidation += " and Password";
    }
  }

  if (errorMsgValidation !== "") {
    errorMsgValidation += " format is not correct";
    if (errorMsgValidation.includes("Password")) {
      errorMsgValidation +=
        " (For password, please input atleast at least one uppercase letter, one lowercase letter and one number)";
    }
    result.data = null;
    result.errorMessage = errorMsgValidation;
    result.statusCode = 400;
    return result;
  }

  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password)
    .then( async(userCredential) => {
      result.data = userCredential.user;
      result.errorMessage = "";
      result.statusCode = 200;
      const data = new UserData(result.data.uid, name, job).serialize();
      await setDoc(doc(db, "userData", result.data.uid), data);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      result.data = errorCode;
      result.errorMessage = errorMessage;
      result.statusCode = 400;
    });


  return result;
}

export async function registerExpert(expert) {
  const result = new ResultData();

  if (expert.checkIfThereIsEmpty()) {
    result.data = null;
    result.errorMessage = "Please fill all the inputs";
    result.statusCode = 400;
    return result;
  }
  try {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, expert.email, expert.password)
      .then((userCredential) => {
        result.data = userCredential.user;
        result.errorMessage = "";
        result.statusCode = 200;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        result.data = errorCode;
        result.errorMessage = errorMessage;
        result.statusCode = 400;
      });

    if (result.statusCode !== 200) {
      return result;
    }

    const storage = getStorage();
    var curKTPPicName = new Date().getTime().toString() + ".png";
    const storageKTPPicRef = ref(storage, "ktp/" + curKTPPicName);
    await uploadBytes(storageKTPPicRef, expert.ktp[0]).then(
      async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((downloadURL) => {
          curKTPPicName = downloadURL;
        });
      }
    );
    var curProfilePicName = new Date().getTime().toString() + ".png";
    const storageProfilePicRef = ref(
      storage,
      "userProfilePics/" + curProfilePicName
    );

    await uploadBytes(storageProfilePicRef, expert.profilePicture[0]).then(
      async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((downloadURL) => {
          curProfilePicName = downloadURL;
        });
      }
    );

    const allAchievementsPicNames = [];
    for (var el of expert.certificates) {
      const curAchievementPicName = new Date().getTime().toString() + ".png";

      await uploadBytes(
        ref(storage, "achievements/" + curAchievementPicName),
        el
      ).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((downloadURL) => {
          allAchievementsPicNames.push(downloadURL);
        });
      });
    }

    expert.ktp = curKTPPicName;
    expert.certificates = allAchievementsPicNames;
    expert.profilePicture = curProfilePicName;
    expert.id = result.data.uid;
    await setDoc(doc(db, "expertData", result.data.uid), expert.serialize());

    return result;
  } catch (e) {
    result.data = null;
    result.statusCode = 400;
    result.errorMessage = e.message;
    return result;
  }
}

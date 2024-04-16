import { setDoc } from "@firebase/firestore";

export const setDocWithTimeout = (ref, data, options) => {
  const timeoutMS = options && options.timeout || 10000;
  const setDocPromise = setDoc(ref, data);

  return Promise.race([
    setDocPromise.then(() => ({ timeout: false })),
    new Promise((resolve, reject) => setTimeout(resolve, timeoutMS, { timeout: true, promise: setDocPromise }))
  ]);
}


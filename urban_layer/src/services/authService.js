// Mock service — in functions ki body baad mein real API endpoints se replace hogi
export function loginUser({ email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({ id: 'usr_1', name: email.split('@')[0], email });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800);
  });
}

export function registerUser({ fullName, email, mobile, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fullName && email && password) {
        resolve({ id: 'usr_new', name: fullName, email, mobile });
      } else {
        reject(new Error('Please fill all required fields'));
      }
    }, 800);
  });
}

export function sendPasswordResetLink({ method, value }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value) {
        resolve({ success: true, method, value });
      } else {
        reject(
          new Error(`Please enter a valid ${method === 'email' ? 'email address' : 'mobile number'}`)
        );
      }
    }, 800);
  });
}
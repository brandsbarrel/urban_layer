import { Outlet } from 'react-router-dom';

// Auth pages (Login, Register, Forgot Password) apna khud ka AuthHeader
// variant choose karte hain, isliye layout sirf Outlet render karta hai.
function AuthLayout() {
  return <Outlet />;
}

export default AuthLayout;
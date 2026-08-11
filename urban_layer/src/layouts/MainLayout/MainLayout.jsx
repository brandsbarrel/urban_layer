import { Outlet } from 'react-router-dom';
import AnnouncementBar from '../../components/AnnouncementBar/AnnouncementBar';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

function MainLayout() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
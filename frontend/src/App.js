import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import SideNav from './components/SideNav';

function App() {
  return (
    <>
      <Header />
      <SideNav />
      <Home />
      <Footer />
      </>
  );
}

export default App;

import React from 'react';
// import LandingPage from './components/LandingPage';
import Header from './components/Header';
import Gallery from './components/Gallery';
import Follow from './components/Follow';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <main>
      <Header />
      <Gallery />
      <Follow />
      {/* <LandingPage /> */}
      <Footer />
    </main>
  );
}

export default App;

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import HomePage from './landing_page/home/HomePage.jsx';
import AboutPage from './landing_page/about/AboutPage.jsx'
import Navbar from './landing_page/components/Navbar.jsx';
import Footer from './landing_page/components/Footer.jsx';
import NotFound from './landing_page/components/NotFound.jsx';
import Productpage from './landing_page/products/ProductPage.jsx';
import PricingPage from './landing_page/pricing/PricingPage.jsx';
import SupportPage from './landing_page/support/SupportPage.jsx';
import Login from './landing_page/signup/Login.jsx';
import Signup from './landing_page/signup/Signup.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/about' element={<AboutPage/>}></Route>
        <Route path='/product' element={<Productpage/>} />
        <Route path='/pricing' element={<PricingPage />} />
        <Route path='/support' element={<SupportPage/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Footer />
  </BrowserRouter>
);

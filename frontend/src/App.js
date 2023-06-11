import {Container} from 'react-bootstrap';
import {Outlet} from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  console.log(process.env);
  console.log(process.env.REACT_APP_NODE_ENV);
  console.log(process.env.REACT_APP_JWT_SECRET);
  console.log(process.env.REACT_APP_PORT);
  return (
    <>
    <Header />
    <main className='py-3'>
      <Container>
        <Outlet />
      </Container>
    </main>
    <Footer />
    </>
  )
}

export default App
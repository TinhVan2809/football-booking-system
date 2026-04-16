import { RouterProvider } from 'react-router-dom';
import './styles/App.css';

import { router } from './app/router';

function App() {


  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App

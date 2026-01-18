// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
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

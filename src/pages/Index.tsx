
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to HomePage
  return <Navigate to="/home" replace />;
};

export default Index;

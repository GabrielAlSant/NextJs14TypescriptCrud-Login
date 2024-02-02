import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/AuthContext/useContext';

interface PrivateRouteProps {
    children: React.ReactNode;
  }
  
  const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, loading } = useUser();
    const router = useRouter();
    useEffect(() => {
      if (!user && !loading) {
        router.push('/Login');
      }
    }, [user, loading, router]);
  
    return loading ? <p>Carregando...</p> : user ? <>{children}</> : null;
  };
  
  export default PrivateRoute;
import './loading.css'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/AuthContext/useContext';
import Header from './header';

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
  
    return loading ? (
      <div>
        <Header />
        <div className='loader'>
        <div className="c-loader"></div>
        </div>
      </div>
    ) : user ? <>{children}</> : null;
  };
  
  export default PrivateRoute;
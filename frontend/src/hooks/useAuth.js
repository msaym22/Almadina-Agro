import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, status } = useSelector(state => state.auth);

  const isAuthenticated = !!token;
  const isLoading = status === 'loading';

  const login = async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout: logoutUser
  };
};

export default useAuth;
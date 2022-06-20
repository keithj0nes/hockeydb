import { useSelector } from 'react-redux';

const useAuth = () => {
    const auth = useSelector(state => state.auth);

    return { ...auth.user, full_name: `${auth.user.first_name} ${auth.user.last_name}` };
};

export default useAuth;

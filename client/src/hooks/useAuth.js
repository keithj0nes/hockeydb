import { useSelector } from 'react-redux';

const useAuth = () => {
    const auth = useSelector(state => state.auth);

    const hasPermission = (allowedRoleIds) => auth.user.roles.some(item => allowedRoleIds.includes(item.role_id));
    const full_name = `${auth.user.first_name} ${auth.user.last_name}`;

    return { ...auth.user, full_name, hasPermission };
};

export default useAuth;

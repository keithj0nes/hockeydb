import { useSelector } from 'react-redux';

const useAuth = () => {
    const auth = useSelector(state => state.auth);

    const hasPermission = (allowedRoleIds) => auth.user.roles.some(item => allowedRoleIds.includes(item.role_id));

    const associated_accounts = [
        { id: 242, first_name: 'John', last_name: 'Smith', full_name: 'John Smith' },
    ];

    return { ...auth.user, associated_accounts, full_name: `${auth.user.first_name} ${auth.user.last_name}`, hasPermission };
};

export default useAuth;

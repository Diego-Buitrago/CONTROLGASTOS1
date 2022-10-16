import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export default function UseAuthContext() {
    return useContext(AuthContext);
}
import React, { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../apiService';

interface PrivateRouteProps {
    component: ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
    return isAuthenticated() ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;

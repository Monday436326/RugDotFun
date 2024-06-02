import React from 'react';
import { SvgIcon } from '@mui/material';

const RugDotFunLogo = (props) => {
    return (
        <SvgIcon {...props} viewBox="0 0 100 100">
            <rect x="0" y="0" width="100" height="100" fill="#FFD700" />
            <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="#8B4513" />
            <text x="50" y="60" fontFamily="Arial" fontSize="12" textAnchor="middle" fill="#FFF">Rug.fun</text>
        </SvgIcon>
    );
};

export default RugDotFunLogo;

import React from 'react';
import UserIcon from './../resources/images/profilePhoto.svg';

export const UserIconWithStatus = () => {
    return (
        <div className="relative" style={{ width: '32px' }}>
            <img
                className="db br-100"
                style={{ width: '32px', height: '32px' }}
                src={UserIcon}
            />
            <div className="absolute br-100 bg-green"
                style={{
                    top: '1rem',
                    left: '20px',
                    width: '15px',
                    height: '15px',
                    border: '2px solid #fff'
                }}
            >
            </div>
        </div>
    );
};

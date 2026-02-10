import React from 'react';

interface UserProps {
    name: string;
    email: string;
    isAdmin?: boolean;
}

const UserCard: React.FC<UserProps> = ({ name, email, isAdmin = false }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg p-6 bg-white border border-gray-200">
            <h3 className="font-bold text-xl mb-2">{name}</h3>
            <p className="text-gray-700 text-base">{email}</p>
            {isAdmin && (
                <span className="inline-block bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full mt-2 font-semibold">
                    Administrator
                </span>
            )}
        </div>
    );
};

export default UserCard;

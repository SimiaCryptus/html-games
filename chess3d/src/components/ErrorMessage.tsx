import React from 'react';

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({message}) => {
    return (
        <div className="error-message"
             style={{color: 'red', padding: '10px', border: '1px solid red', borderRadius: '5px'}}>
            {message}
        </div>
    );
};

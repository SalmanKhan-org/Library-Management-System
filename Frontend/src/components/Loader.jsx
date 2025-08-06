import React from 'react';

const Loader = () => {
    return (
        <div className='w-full max-w-full h-screen max-h-screen'>
            <div className="flex items-center justify-center w-full h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-emerald-600" />
            </div>
        </div>
    );
};

export default Loader;

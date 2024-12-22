import React from 'react';
import { Toaster } from '@/components/ui/toaster';

const RootLayout = ({ children }: { children: React.ReactNode }) => {  
    return (
        <div className="w-full min-h-screen py-2 lg:px-0 lg:py-10 flex bg-gradient-to-tr from-gray-50 to-gray-300">
            <div className="w-full">
                <main className="w-11/12 lg:w-3/4 xl:w-2/3 mx-auto">      
                    {children}                
                </main>
                <Toaster /> 
            </div>
        </div>
    );
};

export default RootLayout;
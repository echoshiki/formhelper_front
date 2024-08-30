import React from 'react';
import { Toaster } from '@/components/ui/toaster';

const RootLayout = ({ children }: { children: React.ReactNode }) => {  
    return (
        <div className="w-full min-h-screen py-10 flex bg-gradient-to-tr from-slate-50 to-slate-300">
            <main className="w-4/5 lg:w-3/4 xl:w-2/3 mx-auto">{children}</main>
            <Toaster />
        </div>
    );
};

export default RootLayout;
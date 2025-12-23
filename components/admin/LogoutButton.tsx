'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
            });

            if (res.ok) {
                router.push('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-destructive cursor-pointer transition-colors rounded-md hover:bg-muted"
        >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log Out</span>
        </div>
    );
}

import Link from 'next/link';
import { LayoutDashboard, Gamepad2, FileText, Settings, Users, Search, Bell, HelpCircle, Store, LogOut, ExternalLink, ChevronDown, Activity } from 'lucide-react';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

import { ThemeToggle } from '@/components/ThemeToggle';
import LogoutButton from '@/components/admin/LogoutButton';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const token = (await cookies()).get('token')?.value;
    const payload = await verifyToken(token || '');

    const hasAccess = payload && (payload.role === 'admin' || payload.role === 'super_admin');

    if (!hasAccess) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
            {/* Top Header - Permanent */}
            <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-50">
                {/* Left: Store Switcher / Logo */}
                <div className="flex items-center gap-3 w-64">
                    <div className="bg-primary rounded p-1">
                        <Store size={20} className="text-primary-foreground" />
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-foreground leading-tight">choksapk</span>
                        <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">Storefront</span>
                    </div>
                    <ChevronDown size={14} className="text-muted-foreground ml-auto mr-4 cursor-pointer hover:text-primary transition-colors" />
                </div>

                {/* Center: Global Search */}
                <div className="flex-1 max-w-2xl px-8">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search settings..."
                            className="w-full bg-muted border border-border rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/" target="_blank" className="hidden lg:flex items-center gap-2 text-xs font-medium text-primary hover:opacity-80 transition-opacity">
                        View Storefront <ExternalLink size={14} />
                    </Link>
                    <div className="h-6 w-px bg-border mx-2"></div>
                    <button className="text-muted-foreground hover:text-foreground relative transition-colors">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
                    </button>
                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center border border-border text-sm font-bold text-muted-foreground">
                        AD
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-card border-r border-border flex flex-col overflow-y-auto transition-colors duration-300">
                    <div className="p-4 space-y-1">
                        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-2">Main</p>
                        <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Command Center" />
                        <NavLink href="/admin/games" icon={<Gamepad2 size={18} />} label="Games" />
                        <NavLink href="/admin/blogs" icon={<FileText size={18} />} label="Blog Posts" />

                        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6">Management</p>
                        <NavLink href="/admin/seo" icon={<Search size={18} />} label="SEO & Metadata" />
                        <NavLink href="/admin/users" icon={<Users size={18} />} label="User Control Protocol" />

                        <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6">Settings</p>
                        <NavLink href="/admin/settings" icon={<Settings size={18} />} label="Store Settings" />
                    </div>

                    <div className="mt-auto p-4 border-t border-border">
                        <LogoutButton />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8 transition-colors duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all group">
            <span className="group-hover:text-primary transition-colors">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}


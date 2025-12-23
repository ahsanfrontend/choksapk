import GameForm from '@/components/admin/GameForm';

export default function NewGamePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">Vault <span className="text-primary italic">Initialization</span></h1>
                <p className="text-muted-foreground text-sm font-medium mt-1">Register a new asset into the global gaming inventory.</p>
            </div>
            <GameForm />
        </div>
    );
}

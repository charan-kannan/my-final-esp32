'use client';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { Button } from "./ui/button";

export function UserProfile() {
    const { user } = useUser();
    const auth = useAuth();
    const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary">
                    {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
                    <AvatarFallback>
                        <User className="h-8 w-8" />
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{user?.displayName || 'Demo User'}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email || 'user@guardianangel.ai'}</p>
                </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="w-full">
                <LogOut className="mr-2 h-4 w-4"/>
                Logout
            </Button>
        </div>
    );
}

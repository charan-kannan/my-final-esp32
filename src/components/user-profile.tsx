import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

export function UserProfile() {
    const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

    return (
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
                <AvatarFallback>
                    <User className="h-8 w-8" />
                </AvatarFallback>
            </Avatar>
            <div>
                <h3 className="text-lg font-semibold">Demo User</h3>
                <p className="text-sm text-muted-foreground">user@guardianangel.ai</p>
            </div>
        </div>
    );
}

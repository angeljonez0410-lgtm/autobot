import { useUser } from "@/lib/auth";

export function UserAvatar() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="flex items-center gap-2">
      <img
        src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email || "U")}`}
        alt="User avatar"
        className="w-8 h-8 rounded-full border border-pink-200"
      />
      <span className="text-xs font-medium text-[#62314a]">{user.email}</span>
    </div>
  );
}

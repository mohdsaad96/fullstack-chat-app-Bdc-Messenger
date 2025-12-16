import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import AnimatedPanel from "./AnimatedPanel";

const UserProfileModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/users/${userId}`);
        setUser(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (!userId) return null;

  return (
    <AnimatedPanel isOpen={!!userId} onClose={onClose} title={user?.fullName || "Profile"}>
      {loading ? (
        <div className="flex items-center justify-center h-40">Loading...</div>
      ) : (
        <div className="flex flex-col items-center gap-4 p-4">
          <img
            src={user?.profilePic || "/avatar.png"}
            alt={user?.fullName}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
          <h3 className="text-2xl font-semibold">{user?.fullName}</h3>
          <p className="text-sm text-zinc-500">{user?.email}</p>
          {user?.phone && <p className="text-sm text-zinc-500">📱 {user.phone}</p>}
          {user?.about && (
            <div className="text-center mt-2">
              <p className="text-sm text-zinc-400">About</p>
              <p className="text-sm mt-1">{user.about}</p>
            </div>
          )}
          {user?.profilePic && (
            <a
              href={user.profilePic}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline mt-4"
            >
              View Full Image
            </a>
          )}
        </div>
      )}
    </AnimatedPanel>
  );
};

export default UserProfileModal;

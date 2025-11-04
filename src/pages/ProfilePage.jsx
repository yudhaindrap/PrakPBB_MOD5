import { useState } from "react";
import { 
  getUserProfile,
  updateUsername,
  updateBio, 
  updateAvatar 
} from "../services/userService";
import { useFavorites } from "../hooks/useFavorites";
import RecipeGrid from "../components/resep/RecipeGrid";

export default function ProfilePage() {
  const [profile, setProfile] = useState(getUserProfile());
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);

  const { favorites, loading: favLoading, error: favError } = useFavorites();

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateAvatar(reader.result);
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (username.trim().length < 3) {
      alert("Nama harus minimal 3 karakter");
      return;
    }
    if (bio.trim().length > 160) {
      alert("Bio maksimal 160 karakter");
      return;
    }

    updateUsername(username);
    updateBio(bio);

    setProfile(getUserProfile());
    setEditing(false);
  };

  return (
    <div className="p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Profile Info Section */}
        <section>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Profil Pengguna
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6">

            {/* Avatar, Name and Bio */}
            <div className="flex items-start gap-6 mb-6">
              <img
                src={avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border shadow-sm"
              />
              
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border px-4 py-2 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full border px-4 py-2 rounded-lg"
                        rows="3"
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {bio.length}/160 karakter
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{profile.username}</h2>
                    <p className="text-gray-600 mt-1">
                      {profile.bio || "Belum ada biodata"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {editing && (
              <div>
                <label className="block mb-4">
                  <span className="sr-only">Pilih Avatar</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 
                      file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                      file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={handleAvatarUpload}
                  />
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Edit Profil
              </button>
            )}
          </div>
        </section>

        {/* Favorites Section */}
        <section>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Resep Favorit Saya</h2>
          {favLoading ? (
            <p className="text-gray-500">Memuat...</p>
          ) : favError ? (
            <p className="text-red-500">{favError}</p>
          ) : favorites.length === 0 ? (
            <p className="text-gray-500">Belum ada resep favorit.</p>
          ) : (
            <RecipeGrid recipes={favorites} categoryLabel="Favorit" />
          )}
        </section>

      </div>
    </div>
  );
}

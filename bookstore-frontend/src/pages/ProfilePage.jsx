import { useState } from "react";
import { getProfile } from "../api/profileApi";
import ChangePasswordForm from "../components/ChangePasswordForm";
import ProfileForm from "../components/ProfileForm";
import useFetch from "../hooks/useFetch";
import { formatDateTime } from "../utils/format";

export default function ProfilePage() {
  const { data, loading, error } = useFetch(getProfile);
  const [savedProfile, setSavedProfile] = useState(null);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="alert alert-error">{error}</p>;

  // After saving, we show the saved version instead of the first loaded one
  const profile = savedProfile || data;

  return (
    <div>
      <h1>My Profile</h1>

      <div className="card">
        <dl className="details">
          <dt>Name</dt>
          <dd>{profile.name}</dd>
          <dt>Email</dt>
          <dd>{profile.email}</dd>
          <dt>Mobile</dt>
          <dd>{profile.phone || "-"}</dd>
          <dt>Role</dt>
          <dd>{profile.role}</dd>
          <dt>Member since</dt>
          <dd>{formatDateTime(profile.createdAt)}</dd>
        </dl>
      </div>

      <div className="profile-grid">
        <ProfileForm profile={profile} onSaved={setSavedProfile} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
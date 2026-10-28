
import { useMemo } from "react";
import "./Profile.css";

function getTokenPayload() {
  try {
    const token = localStorage.getItem("motorscube_token");
    if (!token) return null;

    const payload = token.split(".")[1];
    return JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
  } catch {
    return null;
  }
}

export default function Profile() {
  const user = useMemo(() => getTokenPayload(), []);

  const profileFields = [
    ["User ID", user?.sub ?? user?.id ?? user?.user_id ?? "Not available"],
    ["Name", user?.user_name ?? user?.name ?? "Not available"],
    ["Email", user?.user_email ?? user?.email ?? "Not available"],
    ["Account Type", user?.user_type ?? "Not available"],
    ["Role", user?.role_id ?? "Not available"],
  ];

  return (
    <main className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar">👤</div>
        <div>
          <p className="profile-eyebrow">MOTORSCUBE ACCOUNT</p>
          <h1>My Profile</h1>
          <p>View your account information.</p>
        </div>
      </header>

      <section className="profile-card">
        <h2>Personal Information</h2>

        <div className="profile-table-wrapper">
          <table className="profile-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Information</th>
              </tr>
            </thead>
            <tbody>
              {profileFields.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="profile-note">
          Some details may not appear until your profile is connected
          to the backend.
        </p>
      </section>
    </main>
  );
}

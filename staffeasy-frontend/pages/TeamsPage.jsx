import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const TeamsPage = () => {
  const { isAuthenticated } = useAuth();
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTeams() {
      try {
        // Query the VIEW, not the 'teams' table
        const { data, error } = await supabase
          .from("teams_with_employees")
          .select("*")
          .order("team_label", { ascending: true });

        if (error) {
          console.error("Error fetching teams_with_employees view:", error);
          setError("Failed to load teams data.");
        } else {
          setTeamsData(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Something went wrong fetching teams.");
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchTeams();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="text-center text-red-500">Access Denied</div>;
  }

  if (loading) {
    return <div className="p-4">Loading teams...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teams</h1>
      {teamsData.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        teamsData.map((team) => (
          <div
            key={team.team_id}
            className="mb-6 bg-white p-4 shadow rounded border"
          >
            <h3 className="text-xl font-semibold mb-2">
              {team.team_label}
            </h3>

            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {/* Check if members array is not empty and not just [null] */}
              {team.members && team.members[0] !== null ? (
                team.members.map((member, idx) => (
                  <li key={idx}>
                    {member.name} – {member.position || "No position"}
                  </li>
                ))
              ) : (
                <li>No members assigned.</li>
              )}
            </ul>

            <p className="text-gray-500 text-xs mt-2">
              Created: {new Date(team.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default TeamsPage;

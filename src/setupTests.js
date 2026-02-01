import { Link } from "react-router-dom";

export default function Games() {
  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 32, marginBottom: 20 }}>
        🎮 ArcadeHub — Games
      </h1>

      <p style={{ marginBottom: 30, color: "#aaa" }}>
        Choose a game to start playing.
      </p>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <Link to="/games/coinflip" style={cardStyle}>
          <h3>🪙 Coinflip</h3>
          <p>Simple heads or tails game</p>
        </Link>

        {/* próximos jogos entram aqui */}
      </div>
    </div>
  );
}

const cardStyle = {
  display: "block",
  width: 220,
  padding: 20,
  borderRadius: 12,
  background: "#0C1224",
  color: "white",
  textDecoration: "none",
  boxShadow: "0 10px 30px rgba(0,0,0,.4)"
};

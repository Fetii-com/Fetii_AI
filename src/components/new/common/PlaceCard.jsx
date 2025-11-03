import React from "react";

// styles
import "../../../assets/styles/card.css";

/* PlaceCard Component */
const PlaceCard = ({
  indicator,
  visits,
  title,
  address,
  category,
  onClick,
}) => {
  return (
    <div
      className="place-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* Top row with indicator and visits */}
      <div className="place-card-header">
        {/* Top-left circle indicator */}
        <div className="place-card-indicator">{indicator}</div>

        {/* Top-right visits tag */}
        <div className="place-card-visits">{visits} Visits</div>
      </div>

      {/* Place name */}
      <h2 className="place-card-title">{title}</h2>

      {/* Address and category */}
      <p className="place-card-subtitle">
        {address} <span className="place-card-bullet">•</span> {category}
      </p>
    </div>
  );
};

export default PlaceCard;

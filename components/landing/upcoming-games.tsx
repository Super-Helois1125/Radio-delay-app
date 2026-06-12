"use client";

import { Radio } from "lucide-react";

import { formatGameDate, formatGameTime } from "@/lib/utils";
import { scheduleService } from "@/services/schedule-service";

export function UpcomingGames() {
  const games = scheduleService.upcomingGames();

  return (
    <div className="upcoming-games-grid grid gap-4 md:grid-cols-3">
      {games.map((game) => {
        const team = scheduleService.getTeam(game.teamId);
        const gameDay = new Date(game.startTime).getDate();
        const matchup = `${team?.shortName ?? "TBD"} ${
          game.homeAway === "home" ? "vs" : "@"
        } ${game.opponent}`;

        return (
          <div key={game.id} className="game-ticket-wrapper">
            <article className="game-ticket">
              <div className="game-ticket__main">
                <div className="game-ticket__content">
                  <div className="game-ticket__header">
                    <div className="game-ticket__logo">
                      <Radio aria-hidden />
                      <span>{team?.league ?? "Game"}</span>
                    </div>
                    <span className="game-ticket__type">{game.network}</span>
                  </div>
                  <h3 className="game-ticket__title">{matchup}</h3>
                  <p className="game-ticket__subtitle">
                    {formatGameDate(game.startTime)} ·{" "}
                    {formatGameTime(game.startTime)} ET
                  </p>
                  <div className="game-ticket__details">
                    <div className="game-ticket__detail-item">
                      <span className="game-ticket__label">Broadcast</span>
                      <span className="game-ticket__value">{game.network}</span>
                    </div>
                    <div className="game-ticket__detail-item">
                      <span className="game-ticket__label">Side</span>
                      <span className="game-ticket__value">
                        {game.homeAway === "home" ? "Home" : "Away"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="game-ticket__perforation" aria-hidden>
                <div className="game-ticket__perf-line" />
              </div>
              <div className="game-ticket__stub">
                <div className="game-ticket__admit">
                  <span className="game-ticket__admit-text">Game day</span>
                  <span className="game-ticket__admit-num">{gameDay}</span>
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}

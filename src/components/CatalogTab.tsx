"use client";

import { songCatalog } from "@/lib/words-data";

export function CatalogTab() {
  const totalStreams = songCatalog.reduce((sum, s) => sum + s.streams, 0);
  const totalSaves = songCatalog.reduce((sum, s) => sum + s.saves, 0);
  const totalListeners = songCatalog.reduce((sum, s) => sum + s.listeners, 0);

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Totale Streams", value: totalStreams.toLocaleString("nl-NL") },
          { label: "Totale Saves", value: totalSaves.toLocaleString("nl-NL") },
          { label: "Unieke Listeners", value: totalListeners.toLocaleString("nl-NL") },
          { label: "Nummers", value: songCatalog.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-4"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="text-2xl font-bold text-accent-light">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Song table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Titel</th>
                <th className="px-4 py-3 font-medium text-right">Streams</th>
                <th className="px-4 py-3 font-medium text-right">Listeners</th>
                <th className="px-4 py-3 font-medium text-right">Saves</th>
                <th className="px-4 py-3 font-medium text-right">Save Rate</th>
                <th className="px-4 py-3 font-medium">Categorie</th>
                <th className="px-4 py-3 font-medium">Thema</th>
                <th className="px-4 py-3 font-medium">Release</th>
              </tr>
            </thead>
            <tbody>
              {songCatalog.map((song, i) => (
                <tr
                  key={song.title}
                  className="border-b border-border/50 hover:bg-card-hover transition-colors"
                >
                  <td className="px-4 py-3 text-muted">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {song.title}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {song.streams.toLocaleString("nl-NL")}
                  </td>
                  <td className="px-4 py-3 text-right text-muted">
                    {song.listeners.toLocaleString("nl-NL")}
                  </td>
                  <td className="px-4 py-3 text-right text-muted">
                    {song.saves.toLocaleString("nl-NL")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-medium ${
                        song.saveRate >= 5.5
                          ? "text-green-400"
                          : song.saveRate >= 4.0
                          ? "text-accent-light"
                          : "text-muted"
                      }`}
                    >
                      {song.saveRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs bg-border text-foreground">
                      {song.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {song.theme}
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">
                    {new Date(song.releaseDate).toLocaleDateString("nl-NL", {
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CatalogTab } from "@/components/CatalogTab";
import { WordsTab } from "@/components/WordsTab";
import { GeneratorTab } from "@/components/GeneratorTab";

const tabs = [
  { id: "catalog", label: "Catalogus" },
  { id: "words", label: "Woorden" },
  { id: "generator", label: "Generator" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("generator");

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Erik Lindeman
            </h1>
            <p className="text-sm text-muted">
              Lyric & Suno Master Generator
            </p>
          </div>
          <div className="flex items-center gap-1 bg-card rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === "catalog" && <CatalogTab />}
          {activeTab === "words" && <WordsTab />}
          {activeTab === "generator" && <GeneratorTab />}
        </div>
      </main>
    </div>
  );
}

import React from "react";
import { useTimeMachine } from "../context.js";

export const Tabs: React.FC = () => {
  const { plugins, activeTab, setActiveTab, translations } = useTimeMachine();

  // Only plugins that provide a panel become tabs
  const panelPlugins = plugins.filter((p) => p.panel);
  if (panelPlugins.length === 0) return null;

  const tabs = [
    { name: "Core", displayName: translations.coreTab, icon: undefined },
    ...panelPlugins.map((p) => ({ ...p, displayName: p.name })),
  ];

  return (
    <div className="time-machine-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          className={`time-machine-tab ${activeTab === tab.name ? "time-machine-tab-active" : ""}`}
          onClick={() => setActiveTab(tab.name)}
        >
          {tab.icon ? (
            <span className="time-machine-tab-icon">{tab.icon}</span>
          ) : null}
          {tab.displayName}
        </button>
      ))}
    </div>
  );
};

Tabs.displayName = "TimeMachine.Tabs";

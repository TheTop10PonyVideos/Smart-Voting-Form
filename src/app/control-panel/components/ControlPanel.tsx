"use client"

import { Suspense, useState } from "react";
import styles from "../page.module.css"
import { video_metadata } from "@/generated/prisma";
import { Flag } from "@/lib/types";
import dynamic from "next/dynamic";

const DataTab = dynamic(() => import("./DataTab"))
const LabelsTab = dynamic(() => import("./LabelsTab"))
const VideoPoolTab = dynamic(() => import("./VideoPoolTab"))

const tabs = ["Data", "Labels", "Pool"]

interface Props {
  labelConfigs: Flag[]
  videoPool0: video_metadata[],
}

export default function ControlPanel({ labelConfigs, videoPool0 }: Props) {
  const [activeTab, setActiveTab] = useState("Labels")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageVideoPool, setPageVideoPool] = useState(videoPool0)

  return (
    <div className={styles.mainContainer}>
      <div className={styles.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? styles.activeTab : styles.tab}
          >
            {tab}
          </button>
        ))}
      </div>

      <Suspense fallback={<div>Loading...</div>}>
      {
        activeTab === "Data" && <DataTab /> ||
        activeTab === "Labels" && <LabelsTab labelSettings={labelConfigs}/> ||
        activeTab === "Pool" && <VideoPoolTab />
      }
      </Suspense>
    </div>
  )
}

import { BallotEntryField, VideoDataClient } from "@/lib/types";
import styles from "../page.module.css";
import Image from "next/image";
import { stampMap } from "@/lib/labels";

interface Props {
  index: number
  voteData: BallotEntryField
  searchResults?: VideoDataClient[]
  focused: boolean
  setFocus: (index: number) => void
  onChanged: (e: React.ChangeEvent<HTMLInputElement>, field_index: number) => void
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>, field_index: number) => void
  onSearchSelection: (index: number, data: VideoDataClient) => void
}

export default function VoteField({ index, voteData, searchResults, focused, onChanged, onPaste, onSearchSelection, setFocus }: Props) {
  const refFlag =
    voteData.flags.find(f => f.trigger === "manual") ||
    voteData.flags.find(f => f.type === "ineligible") ||
    voteData.flags.find(f => f.type === "maybe ineligible")

  const showEligibility = voteData.videoData || voteData.input && !focused

  return (
    <div className={`${styles.field} ${showEligibility && (refFlag?.type === "ineligible" && styles.ineligible || refFlag?.type === "maybe ineligible" && styles.warn)}`}>
      {voteData.videoData &&
        <div className={styles.video_display}>
          <img src={voteData.videoData.thumbnail || ""} width={160} height={90} alt="" fetchPriority="low" loading="lazy" decoding="async" referrerPolicy="no-referrer"/>
          {voteData.videoData.title || ""}
          <div className={styles.video_origin}>By <b>{voteData.videoData.uploader}</b> on <b>{voteData.videoData.platform}</b></div>
        </div>
      }
      <input
        type="text"
        name={"resp" + index}
        onChange={e => onChanged(e, index)}
        onPaste={(e) => onPaste(e, index)}
        value={voteData.input}
        className={styles.input}
        placeholder="Your Vote"
        onFocus={() => setFocus(index)}
        onBlur={() => setFocus(-1)}
      />
      <div className={styles.info}>
        {showEligibility && (
          voteData.videoData === undefined && <div className={styles.loading_icon}/> ||

          refFlag &&
          <>
            <Image src={stampMap[refFlag.type].icon} alt="" width={25} height={25} />
            <div className={styles.note}>
              <h3>
                { `${refFlag.type.replace(/\b\w/g, c => c.toUpperCase())}${refFlag.trigger === "manual" ? " (Manually Checked)" : ""}` }
              </h3>

              <ul>
                {voteData.flags.map((flag, i) => <li key={i}>{flag.details}</li>)}
              </ul>

            </div>
          </> ||

          <>
            <Image src={"checkmark.svg"} alt="" width={25} height={25} />
            <div className={styles.note2}>Eligible!</div>
          </>
        )}
      </div>

      {searchResults &&
        <div className={styles.searchResultBox}>
          {searchResults.length &&
            searchResults.map((resData, i) =>
              <div
                className={styles.searchResultDisplay}
                key={i}
                // TODO: change back to onClick where onBlur doesn't prevent it from running
                onMouseDown={() => onSearchSelection(index, resData)}
              >
                <img src={resData.thumbnail || ""} width={112} height={63} alt="" fetchPriority="low" loading="lazy" decoding="async" referrerPolicy="no-referrer"/>
                {resData.title || ""}
                <div className={styles.video_origin}>By <b>{resData.uploader}</b> on <b>{resData.platform}</b></div>
              </div>
            ) ||
            <div style={{textAlign: "center", padding: "10px", fontWeight: 600, fontSize: "0.9rem"}}>
              No search results here yet!
            </div>
          }
        </div>
      }
    </div>
  )
}
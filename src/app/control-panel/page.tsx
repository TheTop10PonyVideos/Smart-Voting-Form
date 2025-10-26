import { getLabels } from "@/lib/data_cache";
import ControlPanel from "./components/ControlPanel";
import { cookies } from "next/headers";
import { forbidden } from "next/navigation";

export default async function ControlPanelPage() {
  const userCookies = await cookies()
  const uid = userCookies.get("uid")!.value

  if (uid !== process.env.OPERATOR)
    forbidden() // TODO: keep an eye on this between nextjs updates since it's experimental
  
  const label_configs = await getLabels()

  return <ControlPanel labelConfigs={label_configs} />
}
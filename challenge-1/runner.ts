import { exit } from "process";
import processDataDump from "./challenge";

const main = async () => {
  await processDataDump();
  console.log("✅ Done!");
  exit(0);
};

main();

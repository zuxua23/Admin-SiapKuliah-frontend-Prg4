import { useState } from "react";
import MasterPuzzleIndex from "./Index";
import MasterPuzzleAdd from "./Add";
import MasterPuzzleDetail from "./Detail";
import MasterPuzzleEdit from "./Edit";


export default function MasterPuzzle() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterPuzzleIndex onChangePage={handleSetPageMode} />;
    case "add":
        return <MasterPuzzleAdd onChangePage={handleSetPageMode} />;
    case "detail":
        return (
            <MasterPuzzleDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
    case "edit":
        return (
        <MasterPuzzleEdit
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
    }
  }

  function handleSetPageMode(mode) {
    setPageMode(mode);
  }

  function handleSetPageMode(mode, withID) {
    setDataID(withID);
    setPageMode(mode);
  }

  return <div>{getPageMode()}</div>;
}

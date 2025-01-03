import { useState } from "react";
import MasterTebakGambarIndex from "./Index";
import MasterTebakGambarAdd from "./Add";
import MasterTebakGambarDetail from "./Detail";
import MasterTebakGambarEdit from "./Edit";


export default function MasterTebakGambar() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterTebakGambarIndex onChangePage={handleSetPageMode} />;
    case "add":
        return <MasterTebakGambarAdd onChangePage={handleSetPageMode} />;
    case "detail":
        return (
            <MasterTebakGambarDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
    case "edit":
        return (
        <MasterTebakGambarEdit
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

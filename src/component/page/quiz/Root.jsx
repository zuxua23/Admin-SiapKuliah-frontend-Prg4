import { useState } from "react";
import MasterQuizIndex from "./Index";
import MasterQuizAdd from "./Add";
import MasterQuizDetail from "./Detail";
import MasterQuizEdit from "./Edit";


export default function MasterQuiz() {
  const [pageMode, setPageMode] = useState("index");
  const [dataID, setDataID] = useState();

  function getPageMode() {
    switch (pageMode) {
      case "index":
        return <MasterQuizIndex onChangePage={handleSetPageMode} />;
    case "add":
        return <MasterQuizAdd onChangePage={handleSetPageMode} />;
    case "detail":
        return (
            <MasterQuizDetail
            onChangePage={handleSetPageMode}
            withID={dataID}
          />
        );
    case "edit":
        return (
        <MasterQuizEdit
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

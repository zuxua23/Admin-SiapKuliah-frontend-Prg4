import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";


const inisialisasiData = [
  {
    Key: null,
    No: null,
    "Deskripsi": null,
    Count: 0,
  },
];

const dataFilterSort = [
  { Value: "[Deskripsi] asc", Text: "Deskripsi [↑]" },
  { Value: "[Deskripsi] desc", Text: "Deskripsi [↓]" },
];


export default function MasterFeedbackIndex({ onChangePage }) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    sort: "[Deskripsi] asc",
  });

  const searchQuery = useRef();
  const searchFilterSort = useRef();

  function handleSetCurrentPage(newCurrentPage) {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: newCurrentPage,
    }));
  }

  function handleSearch() {
    setIsLoading(true);
    setCurrentFilter((prevFilter) => ({
      ...prevFilter,
      page: 1,
      query: searchQuery.current.value,
      sort: searchFilterSort.current.value,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "MasterFeedback/GetDataFeedback",
          currentFilter
        );

        let ada = "true";
        if(data === null){
          ada = "false";
        }
        console.log(ada);

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const formattedData = data.map((value) => ({
            ...value,
            Alignment: ["center", "center"],
          }));
          setCurrentData(formattedData);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentFilter]);

  return (
  <>
    <div className="d-flex flex-column">
      {isError && (
        <div className="flex-fill">
          <Alert
            type="warning"
            message="Terjadi kesalahan: Gagal mengambil data Feedback."
          />
        </div>
      )}
      <div className="flex-fill">
        <div className="input-group">
          <Input
            ref={searchQuery}
            forInput="pencarianFeedback"
            placeholder="Cari"
          />
          <Button
            iconName="search"
            classType="primary px-4"
            title="Cari"
            onClick={handleSearch}
          />
          <Filter>
            <DropDown
              ref={searchFilterSort}
              forInput="ddUrut"
              label="Urut Berdasarkan"
              type="none"
              arrData={dataFilterSort}
              defaultValue="[Deskripsi] asc"
            />
          </Filter>
        </div>
      </div>
      <div className="mt-3">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="d-flex flex-column">
            <Table
              data={currentData}
            />
            <Paging
              pageSize={PAGE_SIZE}
              pageCurrent={currentFilter.page}
              totalData={currentData[0]["Count"]}
              navigation={handleSetCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  </>
);
}

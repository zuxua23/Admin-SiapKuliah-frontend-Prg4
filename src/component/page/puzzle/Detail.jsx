import { useEffect, useRef, useState } from "react";
import { PAGE_SIZE, API_LINK } from "../../util/Constants";
import { formatDate, separator } from "../../util/Formatting";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import Input from "../../part/Input";
import Table from "../../part/Table";
import Label from "../../part/Label";
import Paging from "../../part/Paging";
import Filter from "../../part/Filter";
import DropDown from "../../part/Dropdown";
import Alert from "../../part/Alert";
import Loading from "../../part/Loading";

const inisialisasiData = [
    {
      Key : null,
      No: null,
      "pzl_id" : null,
      "Judul Puzzle" : null,
      "Gambar 1" : null,
      "Gambar 2" : null,
      "Gambar 3" : null,
      "Gambar 4" : null,
      "Gambar 5" : null,
      "Gambar 6" : null,
      Status : null,
      Count : 0,
  },
];

export default function MasterPuzzleDetail({ onChangePage, withID }) {
const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [currentData, setCurrentData] = useState(inisialisasiData);
  const [isAddDisabled, setAddDisabled] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({
    page: 1,
    query: "",
    id: withID,
  });

   const formDataRef = useRef({
    pzl_id: "",
    "Judul Puzzle": "",
    "Gambar 1": "",
    "Gambar 2": "",
    "Gambar 3": "",
    "Gambar 4": "",
    "Gambar 5": "",
    "Gambar 6": "",
    Status: "",
  });

  useEffect(() => {
        const fetchProjectDetails = async () => {
            setIsError((prevError) => ({ ...prevError, error: false }));
            setIsLoadingDetails(true); 
            try {
                const data = await UseFetch(
                    API_LINK + "MasterPuzzle/GetDataPuzzleById",
                    { "pzl_id": withID }
                );

                if (data === "ERROR" || data.length === 0) {
                    throw new Error(
                        "Terjadi kesalahan: Gagal mengambil data Puzzle."
                    );
                } else {
                    formDataRef.current = {
                        ...formDataRef.current,
                        ...data[0],
                    };
                }
            } catch (error) {
                setIsError((prevError) => ({
                    ...prevError,
                    error: true,
                    message: error.message,
                }));
            } finally {
                setIsLoadingDetails(false);
            }
        };

        fetchProjectDetails();
    }, [withID]);

 useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const data = await UseFetch(
          API_LINK + "MasterPuzzle/DetailPuzzle",
          currentFilter
        );

        if (data === "ERROR") {
          setIsError(true);
        } else if (data.length === 0) {
          setCurrentData(inisialisasiData);
        } else {
          const processedData = processDataForTable(data);

          const formattedData = processedData.map((value) => ({
            ...value,
            Alignment: ["center", "center", "center", "center", "center", "center", "center", "center"],
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

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
       </div>
      )}
      <div className="card">
        <div className="card-header bg-primary fw-medium text-white">
          Detail Puzzle
        </div>
        <div className="card-body p-4">
          <div className="row">
            <div className="col-lg-4">
              <Label
                forLabel="judulPuzzle"
                title="Judul Puzzle"
                data={formDataRef.current.judulPuzzle || "-"}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="gambarBenar"
                title="Jawaban Benar"
                data={formDataRef.current.gambarBenar || "-"}
              />
            </div>
             <div className="col-lg-4">
              <Label
                forLabel="gambar1"
                title="Jawaban 1"
                data={formDataRef.current.gambar1 || "-"}
              />
            </div>
             <div className="col-lg-4">
              <Label
                forLabel="gambar2"
                title="Gambar @"
                data={formDataRef.current.gambar2 || "-"}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="gambar3"
                title="Jawaban 3"
                data={formDataRef.current.gambar3 || "-"}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="gambar4"
                title="Jawaban 4"
                data={formDataRef.current.gambar4 || "-"}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="gambar5"
                title="Jawaban 5"
                data={formDataRef.current.gambar5 || "-"}
              />
            </div>
            bz<div className="col-lg-4">
              <Label
                forLabel="gambar6"
                title="Jawaban 6"
                data={formDataRef.current.gambar6 || "-"}
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="statusPuzzle"
                title="Status"
                data={formDataRef.current.statusPuzzle || "-"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="float-end my-4 mx-1">
        <Button
          classType="secondary px-4 py-2"
          label="KEMBALI"
          onClick={() => onChangePage("index")}
        />
      </div>
    </>
  );
}

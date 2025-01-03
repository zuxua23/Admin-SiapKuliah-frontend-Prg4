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
      "Quz_id" : null,
      "Level" : null,
      "Pertanyaan" : null,
      "Jawaban 1" : null,
      "Jawaban 2" : null,
      "Jawaban 3" : null,
      "Jawaban 4" : null,
      Status : null,
      Count : 0,
  },
];


export default function MasterQuizDetail({ onChangePage, withID }) {
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
    quz_id: "",
    "Level": "",
    "Pertanyaan": "",
    "Jawaban 1": "",
    "Jawaban 2": "",
    "Jawaban 3": "",
    "Jawaban 4": "",
    Status: "",
  });

useEffect(() => {
        const fetchProjectDetails = async () => {
            setIsError((prevError) => ({ ...prevError, error: false }));
            setIsLoadingDetails(true); 
            try {
                const data = await UseFetch(
                    API_LINK + "MasterQuiz/getDataQuizById",
                    { "quz_id": withID }
                );

                if (data === "ERROR" || data.length === 0) {
                    throw new Error(
                        "Terjadi kesalahan: Gagal mengambil data aktivitas."
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
          API_LINK + "MasterQuiz/DetailQuiz",
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
            Alignment: ["center", "center", "center", "center", "center", "center", "center"],
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
          Detail Data Kuis
        </div>
        <div className="card-body p-4">
          <div className="row">
            <div className="col-lg-4">
              <Label 
              forLabel="level" 
              title="Level" 
              data={formDataRef.current.level } />
            </div>
            <div className="col-lg-8">
              <Label
                forLabel="pertanyaan"
                title="Pertanyaan"
                data={formDataRef.current.pertanyaan }
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="jawaban1"
                title="Jawaban 1"
                data={formDataRef.current.jawaban1 }
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="jawaban2"
                title="Jawaban 2"
                data={formDataRef.current.jawaban2 }
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="jawaban3"
                title="Jawaban 3"
                data={formDataRef.current.jawaban3 }
              />
            </div>
            <div className="col-lg-4">
              <Label
                forLabel="jawaban4"
                title="Jawaban 4"
                data={formDataRef.current.jawaban4 }
              />
            </div>
            <div className="col-lg-8">
              <Label
                forLabel="statusKuis"
                title="Status Kuis"
                data={formDataRef.current.status }
              />
            </div>
          </div>
        </div>
        </div>

      {/* Tombol Kembali */}
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

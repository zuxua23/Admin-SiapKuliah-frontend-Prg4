import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import { separator } from "../../util/Formatting";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Label from "../../part/Label";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

export default function MasterQuizAdd({ onChangePage }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [listLevels, setListLevels] = useState([]);
  const formDataRef = useRef({
    level: "",
    pertanyaan: "",
    jawaban1: "",
    jawaban2: "",
    jawaban3: "",
    jawaban4: "",
  });

  const userSchema = object({
    level: string().required("harus dipilih"),
    pertanyaan: string().required("harus diisi"),
    jawaban1: string().required("harus diisi"),
    jawaban2: string().required("harus diisi"),
    jawaban3: string().required("harus diisi"),
    jawaban4: string().required("harus diisi"),
  });

    useEffect(() => {
      const staticLevels = [
        { Value: "1", Text: "Level 1" },
        { Value: "2", Text: "Level 2" },
      ];
      setListLevels(staticLevels);
    }, []);


  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);

    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const validationErrors = await validateAllInputs(
      formDataRef.current,
      userSchema,
      setErrors
    );

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError((prevError) => ({ ...prevError, error: false }));
      setErrors({});

      try {
        const data = await UseFetch(
          API_LINK + "MasterQuiz/CreateQuiz",
          formDataRef.current
        );

        if (data === "ERROR") {
          throw new Error("Terjadi kesalahan: Gagal menyimpan data kuis.");
        } else {
          SweetAlert("Sukses", "Data kuis berhasil disimpan", "success");
          onChangePage("index");
        }
      } catch (error) {
        setIsError((prevError) => ({
          ...prevError,
          error: true,
          message: error.message,
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {isError.error && (
        <div className="flex-fill">
          <Alert type="danger" message={isError.message} />
        </div>
      )}
      <form onSubmit={handleAdd}>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Tambah Data Kuis Baru
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-lg-4">
                <DropDown
                  forInput="level"
                  label="Level"
                  arrData={listLevels} 
                  value={formDataRef.current.level} 
                  isRequired
                  onChange={handleInputChange}
                  errorMessage={errors.level}
                />
              </div>
              <div className="col-lg-8">
                <Input
                  type="text"
                  forInput="pertanyaan"
                  label="Pertanyaan"
                  isRequired
                  value={formDataRef.current.pertanyaan}
                  onChange={handleInputChange}
                  errorMessage={errors.pertanyaan}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="jawaban1"
                  label="Jawaban 1"
                  isRequired
                  value={formDataRef.current.jawaban1}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban1}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="jawaban2"
                  label="Jawaban 2"
                  isRequired
                  value={formDataRef.current.jawaban2}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban2}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="jawaban3"
                  label="Jawaban 3"
                  isRequired
                  value={formDataRef.current.jawaban3}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban3}
                />
              </div>
              <div className="col-lg-4">
                <Input
                  type="text"
                  forInput="jawaban4"
                  label="Jawaban 4"
                  isRequired
                  value={formDataRef.current.jawaban4}
                  onChange={handleInputChange}
                  errorMessage={errors.jawaban4}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="float-end my-4 mx-1">
          <Button
            classType="secondary me-2 px-4 py-2"
            label="BATAL"
            onClick={() => onChangePage("index")}
          />
          <Button
            classType="primary ms-2 px-4 py-2"
            type="submit"
            label="SIMPAN"
          />
        </div>
      </form>
    </>
  );
}

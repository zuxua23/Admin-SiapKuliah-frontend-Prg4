import { useEffect, useRef, useState } from "react";
import { object, string } from "yup";
import { API_LINK } from "../../util/Constants";
import { validateAllInputs, validateInput } from "../../util/ValidateForm";
import SweetAlert from "../../util/SweetAlert";
import UseFetch from "../../util/UseFetch";
import Button from "../../part/Button";
import DropDown from "../../part/Dropdown";
import Input from "../../part/Input";
import Loading from "../../part/Loading";
import Alert from "../../part/Alert";

const listLevelQuiz = [
  { Value: "1", Text: "Level 1" },
  { Value: "2", Text: "Level 2" },
];

export default function MasterQuizEdit({ onChangePage, withID }) {
  const [errors, setErrors] = useState({});
  const [isError, setIsError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Form data menggunakan useRef
  const formDataRef = useRef({
    idQuiz: "", 
    level: "",
    pertanyaan: "",
    jawaban1: "",
    jawaban2: "",
    jawaban3: "",
    jawaban4: "",
  });

  const userSchema = object({
    idQuiz: string(), 
    level: string().required("Level harus dipilih"),
    pertanyaan: string().required("Pertanyaan harus diisi"),
    jawaban1: string().required("Jawaban 1 harus diisi"),
    jawaban2: string().required("Jawaban 2 harus diisi"),
    jawaban3: string().required("Jawaban 3 harus diisi"),
    jawaban4: string().required("Jawaban 4 harus diisi"),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsError({ error: false });

      try {
        const data = await UseFetch(
          API_LINK + "MasterQuiz/GetDataQuizById",
          { id: withID }
        );

        console.log("Respons API:", data);

        if (!data || data === "ERROR" || data.length === 0) {
          throw new Error("Gagal mengambil data kuis.");
        }

        formDataRef.current = { ...formDataRef.current, ...data[0] };
      } catch (error) {
        setIsError({
          error: true,
          message: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [withID]);

  // Handle perubahan input
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    const validationError = await validateInput(name, value, userSchema);
    formDataRef.current[name] = value;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [validationError.name]: validationError.error,
    }));

  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { idQuiz, status, ...validationData } = formDataRef.current;

    const validationErrors = await validateAllInputs(
      validationData,
      userSchema,
      setErrors
    );

    console.log("Error validasi:", validationErrors);

    if (Object.values(validationErrors).every((error) => !error)) {
      setIsLoading(true);
      setIsError({ error: false });

      try {
        console.log("Data yang dikirim ke API:", formDataRef.current);

        const data = await UseFetch(
          API_LINK + "MasterQuiz/EditQuiz",
          formDataRef.current
        );

        console.log("Respons API:", data);

        if (data === "ERROR") {
          throw new Error("Gagal menyimpan data kuis.");
        }

        SweetAlert("Sukses", "Data kuis berhasil disimpan", "success");
        onChangePage("index");
      } catch (error) {
        console.error("Error saat menyimpan data:", error);
        setIsError({
          error: true,
          message: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Validasi gagal, form tidak dikirim.");
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
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header bg-primary fw-medium text-white">
            Edit Data Kuis
          </div>
          <div className="card-body p-4">
            <div className="row">
              {/* Dropdown Level */}
              <div className="col-lg-4">
                <DropDown
                  forInput="level"
                  label="Level"
                  arrData={listLevelQuiz}
                  isRequired
                  value={formDataRef.current.level}
                  onChange={handleInputChange}
                  errorMessage={errors.level}
                />
              </div>

              {/* Input Pertanyaan */}
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

              {/* Jawaban 1 */}
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

              {/* Jawaban 2 */}
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

              {/* Jawaban 3 */}
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

              {/* Jawaban 4 */}
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

        {/* Tombol Aksi */}
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

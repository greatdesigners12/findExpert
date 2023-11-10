import { useState } from "react";
import LoginRegisterPageHelmet from "../../components/shared/LoginRegisterPageHelmet";
import { registerExpert } from "../../controller/auth_controller/auth_controller";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { getAllFieldsWithExperts } from "../../controller/fields_controller/fields_controller";
import { useEffect } from "react";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";

export const RegisterExpert = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [field, setField] = useState("");
  const [NIK, setNIK] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const [fieldData, setFieldData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const data = await getAllFieldsWithExperts();
      setFieldData(data.data);
      console.log(data.data);
      setLoading(false);
    };
    getData();
  }, []);

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerExpert(
        name,
        phone,
        email,
        password,
        confirmPassword
      );

      if (result.data != null) {
        navigate("/login");
      } else {
        setMessage(result.errorMessage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return (
      <>
        <LoginRegisterPageHelmet pageTitle="Register As Expert" />
        <div className="login-register-bg">
          <div className="d-flex flex-row justify-content-lg-start justify-content-center py-lg-0 py-4 logreg-container">
            <div className="login-register-form-bg login-register-form py-5 d-flex align-items-center flex-column">
              <img
                src="assets/img/logo/logo-colored.png"
                className="logologinregister d-lg-none pb-5"
                alt=""
              />
              <h2 className="fw-bold font-montserrat">REGISTER</h2>
              <div className="line1 mx-4"></div>
              <h5 className="font-montserrat fw-semibold mt-3 text-center mx-5">
                We Help <span className="color-purple">Clients</span> Meet The{" "}
                <span className="color-purple">Experts</span> They Need
              </h5>
              <div className="px-5 mx-4 d-flex justify-content-evenly">
                <a href="/register" className="text-decoration-none">
                  <h5 className="font-montserrat fw-bold mt-3 text-center mx-4 px-4 unselected-register pb-2">
                    Client
                  </h5>
                </a>
                <h5 className="font-montserrat fw-bold mt-3 text-center mx-4 px-4 selected-register pb-2">
                  Expert
                </h5>
              </div>
              <form onSubmit={handleSubmit} className="w-75">
                <div className="mb-3 mt-4">
                  <input
                    type="name"
                    className="form-control font-montserrat"
                    id="inputName"
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 mt-4">
                  <input
                    type="tel"
                    className="form-control font-montserrat"
                    id="inputPhoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 mt-4">
                  <input
                    type="email"
                    className="form-control font-montserrat"
                    id="inputEmail"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 mt-4">
                  <input
                    type="password"
                    className="form-control font-montserrat"
                    id="inputPassword"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 mt-4">
                  <input
                    type="password"
                    className="form-control font-montserrat"
                    id="inputConfirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="mb-3 mt-4">
                    <input
                      type="date"
                      className="form-control font-montserrat"
                      id="inputBirthDate"
                      name="birthDate"
                      placeholder="Birth Date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                    />
                  </div>
                  <Form.Select
                    className="mb-3 mt-4"
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                  >
                    <option>Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </Form.Select>
                  <Form.Select
                    className="mb-3 mt-4"
                    value={education}
                    onChange={(e) => {
                      setEducation(e.target.value);
                    }}
                  >
                    <option value="">Education</option>
                    <option value="SMA">SMA</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </Form.Select>
                  <Form.Select
                    className="mb-3 mt-4"
                    value={field}
                    onChange={(e) => {
                      setField(e.target.value);
                    }}
                  >
                    <option>Field</option>
                    {fieldData.map((field) => (
                      <option value={field.id}>{field.name}</option>
                    ))}
                  </Form.Select>
                  <div className="mb-3 mt-4">
                    <input
                      type="number"
                      className="form-control font-montserrat"
                      id="inputNIK"
                      name="NIK"
                      placeholder="NIK"
                      value={NIK}
                      onChange={(e) => setNIK(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3 mt-4">
                    <textarea
                      className="form-control font-montserrat"
                      id="inputJobExperience"
                      name="jobExperience"
                      placeholder="Job Experience"
                      onChange={(e) => setJobExperience(e.target.value)}
                      value={jobExperience}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex flex-column justify-content-center">
                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-primary font-montserrat fw-semibold py-2 px-4"
                    >
                      Register
                    </button>
                  </div>
                  <small className="text-danger font-montserrat text-center mt-3">
                    {message}
                  </small>
                </div>
              </form>
              <h6 className="font-montserrat fw-semibold mt-3 text-center mx-4">
                Already have an account?{" "}
                <span className="color-purple fw-bold">
                  <a
                    href="/login"
                    className="text-decoration-none color-purple fw-bold"
                  >
                    Login Here!
                  </a>
                </span>
              </h6>
            </div>
            <div className="d-none d-lg-block">
              <div className="d-flex justify-content-center align-items-center login-register-logo-container">
                <img
                  src="assets/img/logo/logo-white.png"
                  className="logologinregister"
                  alt=""
                />
              </div>
            </div>
          </div>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
            crossOrigin="anonymous"
          ></script>
        </div>
      </>
    );
  }
};

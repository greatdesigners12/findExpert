import React from "react";
import Footer from "../../components/shared/Footer";
import PageHelmet from "../../components/shared/PageHelmet";
import StyleFiveHeader from "../Home/HeaderStyleFive/StyleFiveHeader";
import { login } from "../../controller/auth_controller/auth_controller";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoadingSpinner } from "../../components/shared/LoadingSpinner";
import "./home.css";

export const HomeExpert = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.data != null) {
        sessionStorage.setItem("role", result.data.role);
        navigate("/");
      } else {
        console.log(result);
        setMessage(result.errorMessage);
        setLoading(false);
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
        <PageHelmet pageTitle="Home Expert" />
        <StyleFiveHeader />
        <section className="services__area home-expert-page pt-115 pb-80">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-4">
                <div
                  className="section__title section__title-3 text-center mb-90 wow fadeInUp "
                  data-wow-delay=".2s"
                >
                  <h3>
                    <span className="span">Expert</span>
                    <span className="text-wrapper-3">Pay</span>
                  </h3>
                  <h3>Rp. 1121211221</h3>
                  <form onSubmit={handleSubmit} className="w-75 mx-auto">
                    <div className="mb-3 mt-4">
                      <input
                        type="email"
                        className="form-control font-montserrat"
                        id="inputEmail"
                        name="email"
                        placeholder="Enter Account Type"
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
                        placeholder="Enter Account Number"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-flex flex-column justify-content-center">
                      <div className="d-flex justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-primary font-montserrat fw-semibold py-1 px-2"
                        >
                          <img
                            src="assets/img/logo/Vector.png"
                            alt="logo"
                            className="p-3"
                          ></img>
                          <span className="white px-3">Cairkan Dana</span>
                        </button>
                      </div>
                      <small className="text-danger font-montserrat text-center mt-3">
                        {message}
                      </small>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-xl-1 col-lg-1"></div>
              <div className="col-xl-7 col-lg-7">
                <div
                  className="section__title section__title-3 mb-90 wow fadeInUp"
                  data-wow-delay=".2s"
                >
                  <h3>Payment History</h3>
                  <div id="table-container"></div>

                  <div class="records table-responsive">
                    <div>
                      <table width="100%">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th> NAMA</th>
                            <th> JAM KERJA</th>
                            <th> NO TELP</th>
                            <th>HAPUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>#0</td>
                            <td>nnn</td>
                            <td>nn</td>
                            <td>nnn</td>
                            <td>asasas</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div>
                  <h3>Consultation</h3>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="textdeco text-center mb-30">
                      <div className="team__thumb mb-25">
                        <img
                          src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Siberischer_tiger_de_edit02.jpg/400px-Siberischer_tiger_de_edit02.jpg'
                          alt="team"
                        />
                        
                      </div>
                      <div className="team__content">
                        <h3>
                          nnn
                        </h3>
                        <span>mmm</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <div>
                  <h3>Consultation List</h3>

                  <div id="table-container"></div>

                  <div class="records table-responsive">
                    <div>
                      <table width="100%">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th> NAMA</th>
                            <th> JAM KERJA</th>
                            <th> NO TELP</th>
                            <th>HAPUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>#0</td>
                            <td>nnn</td>
                            <td>nn</td>
                            <td>nnn</td>
                            <td>asasas</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </>
    );
  }
};

export default HomeExpert;

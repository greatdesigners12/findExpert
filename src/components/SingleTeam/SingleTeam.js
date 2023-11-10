import React from 'react';
import { Link } from 'react-router-dom';
import "./singleteam.css";

const SingleTeam = ({ image, name, title, status }) => {
  // Membuat variabel untuk menentukan warna lingkaran berdasarkan status
  let circleColor;

  switch (status) {
    case 'online':
      circleColor = 'green';
      break;
    case 'busy':
      circleColor = 'red';
      break;
    case 'offline':
      circleColor = 'grey';
      break;
    default:
      circleColor = 'black'; // Default color jika status tidak sesuai
  }

  return (
    <>
      <div className="col-xl-3 col-lg-4 col-md-6">
        <div className="team__item p-relative text-center fix mb-30">
          <div className="team__thumb mb-25">
            <img src={`assets/img/team/team-${image}.jpg`} alt="team" />
            <div className="status-circle" style={{ backgroundColor: circleColor }}>
              
            </div>
            <div className="team__info text-start">
              <h3>
                <Link to="/teamDetails">{name}</Link>
              </h3>
              <span>{title}</span>
            </div>
          </div>
          <div className="team__content">
            <h3>
              <Link to="/teamDetails">{name}</Link>
            </h3>
            <span>{title}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleTeam;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Appointments = () => {
    const params=useParams();
  const [appointments, setAppointments] = useState([]);
  
  const {user}=useSelector(state=>state.user);
  const getAppointments = async () => {
    try {
      const res = await axios.post("http://localhost:3000/users/appointments", 
        {
            userId:user._id,
        },
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        console.log(res.data.data);
        console.log(res.data.doctor);
        const updatedAppointments = res.data.data.map((appointment) => ({
          ...appointment,
          doctor: res.data.doctor,
        }))
        setAppointments(updatedAppointments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "Doctor",
      dataIndex: "doctor",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  return (
    <Layout>
      <h1>Appoinmtnets Lists</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;
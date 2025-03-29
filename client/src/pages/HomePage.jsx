import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Row, Col, Card, Button, Typography, Spin, Empty, notification, Input } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, SearchOutlined } from "@ant-design/icons";
import '../styles/LayoutStyle.css'
import DoctorList from "../components/DoctorList";
const { Title, Text } = Typography;

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all doctors
  const getDoctors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:3000/users/getalldoctors",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
        setError(null);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      setError("Failed to load doctors. Please try again later.");
      notification.error({
        message: "Error fetching doctors",
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter((doctor) => 
    doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Enhanced DoctorCard component
  const DoctorCard = ({ doctor }) => (
    <Col xs={24} sm={12} md={8} lg={6} className="mb-4">
      <Card 
        hoverable 
        style={{ height: "100%" }}
        cover={
          <div style={{ 
            height: 150, 
            background: "#f5f5f5", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center" 
          }}>
            {doctor.profileImage ? (
              <img 
                src={doctor.profileImage} 
                alt={`Dr. ${doctor.firstName} ${doctor.lastName}`} 
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "cover" }} 
              />
            ) : (
              <UserOutlined style={{ fontSize: 64, color: "#bfbfbf" }} />
            )}
          </div>
        }
      >
        <Title level={4} style={{ marginBottom: 8 }}>
          Dr. {doctor.firstName} {doctor.lastName}
        </Title>
        <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
          {doctor.specialization || "General Practitioner"}
        </Text>
        <div style={{ marginBottom: 12 }}>
          {doctor.phone && (
            <Text style={{ display: "block", marginBottom: 4 }}>
              <PhoneOutlined style={{ marginRight: 8 }} /> 
              {doctor.phone}
            </Text>
          )}
          {doctor.email && (
            <Text style={{ display: "block", marginBottom: 4 }}>
              <MailOutlined style={{ marginRight: 8 }} /> 
              {doctor.email}
            </Text>
          )}
        </div>
        <Button type="primary" block>
          Book Appointment
        </Button>
      </Card>
    </Col>
  );

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <div className=" text-yellow-50 flex justify-between items-center mb-6">
          <Title level={2} style={{ margin: 0 }}>
            Available Doctors
          </Title>
          <Input
            placeholder="Search by name or specialization"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Loading doctors...</div>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Text type="danger">{error}</Text>
            <Button type="primary" onClick={getDoctors} style={{ marginTop: 16 }}>
              Try Again
            </Button>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <Empty 
            description={
              searchTerm 
                ? "No doctors match your search criteria" 
                : "No doctors available at the moment"
            }
          />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredDoctors.map((doctor) => (
              // <DoctorCard key={doctor._id || index} doctor={doctor} />
              <DoctorList doctor={doctor} key={doctor._id || index} />
            ))}
          </Row>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
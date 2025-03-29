import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout'
import axios from 'axios'
import { Table } from 'antd';

const Users = () => {
  const [usrs,setUsers]=useState([]);
  const getusers=async(req,res)=>{
    try {
      const res=await axios.get('http://localhost:3000/admin/getalluser',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if(res.status)
      {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
    getusers();
  },[])

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button className="btn btn-danger">Block</button>
        </div>
      ),
    },
  ];
  return (
    <Layout>
        <h1 className="text-center m-2">All Users</h1>
        <Table columns={columns} dataSource={usrs}/>
    </Layout>
  )
}

export default Users

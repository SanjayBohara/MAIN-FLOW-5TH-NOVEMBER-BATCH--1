// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';

function App() {
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState({ name: '', age: 0 }); // Adjust fields based on your schema

  useEffect(() => {
    // Fetch data from the API endpoint
    axios.get('http://localhost:3001/api/data')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  // Define columns for the table
  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Age', accessor: 'age' },
    // Add other columns based on your schema
  ];

  // Use react-table hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:3001/api/data', newData);
      // Refresh data after creating a new record
      const response = await axios.get('http://localhost:3001/api/data');
      setData(response.data);
      // Clear input fields
      setNewData({ name: '', age: 0 });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Reporting Dashboard</h1>
      <div>
        <label>Name:</label>
        <input type="text" value={newData.name} onChange={(e) => setNewData({ ...newData, name: e.target.value })} />
        <label>Age:</label>
        <input type="number" value={newData.age} onChange={(e) => setNewData({ ...newData, age: e.target.value })} />
        <button onClick={handleCreate}>Create</button>
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;

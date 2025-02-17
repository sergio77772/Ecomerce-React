import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';

const API = process.env.REACT_APP_API + "bitacora.php?endpoint=bitacora";

const BitacoraBarChart = () => {
  const [bitacora, setbitacora] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadbitacora();
  }, [search, currentPage]);

  const loadbitacora = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API}&search=${search}&page=${currentPage}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Error al cargar las bitacoras.");
      }
      const data = await response.json();
      setbitacora(data.bitacora || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const groupByUserAndModule = (data) => {
    return data.reduce((acc, curr) => {
      const key = `${curr.usuario}-${curr.modulo}`;
      if (!acc[key]) {
        acc[key] = { usuario: curr.usuario, modulos: [] };
      }
      acc[key].modulos.push(curr.modulo);
      return acc;
    }, {});
  };

  const formatData = (groupedData) => {
    return Object.values(groupedData).map(({ usuario, modulos }) => ({
      usuario,
      modulos: modulos.join(', '),
      moduloCount: modulos.length,
    }));
  };

  const groupedData = groupByUserAndModule(bitacora);
  const formattedData = formatData(groupedData);

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="usuario" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="moduloCount" fill="#8884d8">
              <LabelList dataKey="modulos" position="top" angle={45} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BitacoraBarChart;

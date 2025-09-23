import React from 'react';
import { BloodSugarData } from '../types/BloodSugarData';

interface DataTableProps {
  data: BloodSugarData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
    <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">전체 기록</h2>
      {data.length === 0 ? (
        <p className="text-gray-400 text-center">아직 기록된 데이터가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2 px-4 font-bold">시간</th>
                <th className="py-2 px-4 font-bold">혈당 수치</th>
                <th className="py-2 px-4 font-bold">활동</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2 px-4">{new Date(item.timestamp).toLocaleTimeString()}</td>
                  <td className="py-2 px-4">{item.value} mg/dL</td>
                  <td className="py-2 px-4">{item.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataTable;
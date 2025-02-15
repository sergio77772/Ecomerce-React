import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css' // Asegúrate de que esta línea esté aquí

const SkeletonTable = ({ rows = 5, columns = 3 }) => {
  return (
    <div style={{ display: 'table', width: '80%', borderCollapse: 'collapse' }}>
      {/* Header */}
      <div style={{ display: 'table-row' }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            style={{
              display: 'table-cell',
              border: '1px solid #ddd',
              padding: '10px',
              textAlign: 'left',
              fontWeight: 'bold',
              backgroundColor: '#f4f4f4',
            }}
          >
            <Skeleton height={20} width="80%" />
          </div>
        ))}
      </div>

      {/* Body */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'table-row' }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              style={{
                display: 'table-cell',
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
              }}
            >
              <Skeleton height={20} width="80%" />
            </div>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div style={{ display: 'table-row' }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            style={{
              display: 'table-cell',
              border: '1px solid #ddd',
              padding: '10px',
              textAlign: 'left',
            }}
          >
            <Skeleton height={20} width="80%" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonTable

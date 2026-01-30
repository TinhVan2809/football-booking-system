// component file card , Kết quả cho tìm kiếm 

import { useNavigate } from "react-router-dom";
function FieldCard({ field }) {
    const navigate = useNavigate();
  return (
    <div className="border rounded-lg p-4 shadow">
      <h3 className="font-semibold text-lg">{field.field_name}</h3>
      <p>Chi nhánh: {field.branch_name}</p>
      <p>Loại sân: {field.type_name}</p>
      <p className="text-green-600 font-bold">
        {Number(field.price_per_hour).toLocaleString()} đ / giờ
      </p>
      <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"   onClick={() => navigate(`/detail/${field.field_id}`)}>
        Chi tiết
      </button>
    </div>
  );
}

export default FieldCard;

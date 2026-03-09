import { useParams } from "react-router-dom";
import useFieldsByBranches from "../../hooks/useFieldsByBranhesHook";

function FieldsManagement() {
  const { branch_id } = useParams();

  // Lấy danh sách sân bóng của branch này bằng custom hook
  const {
    fieldsByBranch,
    loading: loadingFields,
    error: errorFields,
    currentPage: currentFieldPage,
    totalPages: totalFieldPages,
    setCurrentPage: setCurrentFieldPage,
  } = useFieldsByBranches({ branch_id });

  if (loadingFields) {
    return <p>Loading...</p>;
  }
  if (errorFields) {
    return <p>false to fetch: {errorFields}</p>;
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(fieldsByBranch) && fieldsByBranch.length > 0 ? (
          fieldsByBranch.map((field) => (
            <div
              key={field.field_id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-2 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                {field.thumbnail ? (
                  <img
                    src={
                      field.thumbnail
                        ? `http://localhost/football-booking-system/backend-php/uploads/fields_img/${field.thumbnail}`
                        : "pexels-pixabay-47730.jpg"
                    }
                    alt={field.field_name}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded text-gray-400 text-sm">
                    No Image
                  </div>
                )}
                <div>
                  <div className="font-semibold text-lg">
                    {field.field_name}
                  </div>
                  <div className="text-sm text-gray-500 capitalize">
                    Trạng thái: {field.status}
                  </div>
                </div>
              </div>
              {Array.isArray(field.field_types) &&
                field.field_types.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium text-gray-700 mb-1">
                      Loại sân:
                    </div>
                    <ul className="space-y-1">
                      {field.field_types.map((type) => (
                        <li
                          key={type.field_field_type_id}
                          className="flex items-center justify-between bg-gray-50 rounded px-2 py-1 border border-gray-100"
                        >
                          <span className="font-semibold">
                            {type.type_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {type.players} người
                          </span>
                          <span className="text-green-600 font-bold">
                            {Number(type.price_per_hour).toLocaleString()}₫/giờ
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-500">
            Không có sân bóng nào
          </div>
        )}
      </div>
    </>
  );
}

export default FieldsManagement;

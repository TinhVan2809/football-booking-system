//[compoent bản hiển thị top sân bóng được bookings nhiều nhất]
//? Đang sử dụng dữ liệu tỉnh để test UI

function TopFields() {
  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="h-10">
            <th className="text-gray-500 font-bold text-start">#</th>
            <th className="text-gray-500 font-bold text-start">Name</th>
            <th className="text-gray-500 font-bold text-start">Favorities</th>
            <th className="text-gray-500 font-bold text-start">Total bookings</th>
          </tr>
        </thead>

        <tbody className="">
          <tr className="border-t border-black/20 h-10">
            <td className="font-bold dark:text-white">1</td>
            <td>Sân 1A</td>
            <td>23</td>
            <td>55</td>
          </tr>
          <tr className="border-t border-black/20 h-10">
            <td className="font-bold dark:text-white">2</td>
            <td>Sân 3C</td>
            <td>55</td>
            <td>40</td>
          </tr>
          <tr className="border-t border-black/20 h-10">
            <td className="font-bold dark:text-white">3</td>
            <td>Sân 5C</td>
            <td>12</td>
            <td>30</td>
          </tr>
          <tr className="border-t border-black/20 h-10">
            <td className="font-bold dark:text-white">4</td>
            <td>Sân 1B</td>
            <td>11</td>
            <td>20</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default TopFields;

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import {AdminChartPie} from "../../../data/AdminChartData.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartForAdmin = () => {
  return (
    <div style={{ width: "400px", height: "400px" }}>
      <Pie data={AdminChartPie} />
    </div>
  );
};

export default PieChartForAdmin;
